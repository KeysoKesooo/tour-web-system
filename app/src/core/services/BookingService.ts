import { BookingRepository } from "@/core/repositories/Booking.Repository";
import { TripRepository } from "@/core/repositories/Trip.Repository";
import { BookingModel } from "@/core/models/Booking.model";
import {
  CreateBookingInput,
  PublicCreateBookingInput,
} from "@/core/dto/booking.dto";
import { BookingStatus } from "@/types/BookingStatus";
import { CacheService } from "@/lib/redis/cacheService";
import { enqueueJob } from "@/lib/redis/upstash";

export class BookingService {
  private repo = new BookingRepository();
  private tripRepo = new TripRepository();

  // ------------------- Static Helpers -------------------
  static async getRemainingSeats(tripId: string): Promise<number> {
    const tripRepo = new TripRepository();
    const bookingRepo = new BookingRepository();

    const trip = await tripRepo.findById(tripId);
    if (!trip) throw new Error("Trip not found");

    // Use batch method for single trip
    const bookingsSum = await bookingRepo.getTotalConfirmedForTrip([tripId]);
    const totalBooked =
      bookingsSum.find((b) => b.tripId === tripId)?.total ?? 0;

    return trip.capacity - totalBooked;
  }

  static async validateBookingCapacity(tripId: string, numPersons: number) {
    if (!tripId || !numPersons || numPersons <= 0)
      return "Number of persons must be greater than 0";

    const remaining = await BookingService.getRemainingSeats(tripId);
    if (numPersons > remaining)
      return `Cannot book more than ${remaining} person(s). Only ${remaining} seat(s) remaining.`;

    return null;
  }

  // ------------------- GET Methods (Cache TTL) -------------------
  async getBookingById(id: string): Promise<BookingModel> {
    return CacheService.getOrSet(`booking:${id}`, 60, async () => {
      const booking = await this.repo.findById(id);
      if (!booking) throw new Error("Booking not found");
      return new BookingModel(booking);
    });
  }

  async getAllBookings(): Promise<BookingModel[]> {
    return CacheService.getOrSet("bookings:all", 30, async () => {
      const bookings = await this.repo.findAll();
      return bookings.map((b) => new BookingModel(b));
    });
  }

  async getAllBookingsWithTrips(): Promise<BookingModel[]> {
    return this.getAllBookings();
  }

  // ------------------- Customer Side (Write-Behind via QStash) -------------------
  async publicCreateBooking(
    data: PublicCreateBookingInput
  ): Promise<BookingModel> {
    const validationError = await BookingService.validateBookingCapacity(
      data.tripId,
      data.numPersons
    );
    if (validationError) throw new Error(validationError);

    const trip = await this.tripRepo.findById(data.tripId);
    if (!trip) throw new Error("Trip not found during booking creation");

    const internalData: CreateBookingInput = {
      ...data,
      status: BookingStatus.PENDING,
      amountPaid: trip.price * data.numPersons,
    };

    await enqueueJob("booking-worker", {
      type: "createBooking",
      payload: internalData,
    });

    return this.createBookingCore(internalData);
  }

  // ------------------- Admin Side (Write-Through) -------------------
  async createBooking(data: CreateBookingInput): Promise<BookingModel> {
    const validationError = await BookingService.validateBookingCapacity(
      data.tripId,
      data.numPersons
    );
    if (validationError) throw new Error(validationError);

    const booking = await this.repo.create(data);

    if (booking.status === BookingStatus.CONFIRMED) {
      await this.repo.upsertAnalytics(booking);
    }

    await CacheService.writeThrough(`booking:${booking.id}`, booking);
    await CacheService.invalidate("bookings:all");

    return new BookingModel(booking);
  }

  private async createBookingCore(
    data: CreateBookingInput
  ): Promise<BookingModel> {
    const validationError = await BookingService.validateBookingCapacity(
      data.tripId,
      data.numPersons
    );
    if (validationError) throw new Error(validationError);

    const booking = await this.repo.create(data);

    if (booking.status === BookingStatus.CONFIRMED) {
      await this.repo.upsertAnalytics(booking);
    }

    return new BookingModel(booking);
  }

  async updateBookingStatus(
    id: string,
    status: BookingStatus
  ): Promise<BookingModel> {
    const booking = await this.repo.update(id, { status });

    if (status === BookingStatus.CONFIRMED) {
      await this.repo.upsertAnalytics(booking);
    }

    await CacheService.writeThrough(`booking:${booking.id}`, booking);
    await CacheService.invalidate("bookings:all");

    return new BookingModel(booking);
  }

  async deleteBooking(id: string) {
    const booking = await this.repo.findById(id);
    if (!booking) throw new Error("Booking not found");

    await this.repo.delete(id);

    if (booking.status === BookingStatus.CONFIRMED) {
      await this.repo.decrementAnalytics(booking);
    }

    await CacheService.invalidate(`booking:${id}`);
    await CacheService.invalidate("bookings:all");

    return { message: "Booking deleted successfully" };
  }
}
