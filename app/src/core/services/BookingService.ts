import { BookingRepository } from "@/core/repositories/bookingRepository";
import { BookingModel } from "@/core/models/Booking.model";
import { CreateBookingInput, UpdateBookingInput } from "@/core/dto/booking.dto";
import { BookingStatus } from "@/types/BookingStatus";
import { prisma } from "@/lib/prisma";

export class BookingService {
  private repo = new BookingRepository();

  /**
   * Calculate remaining seats for a trip (only counts CONFIRMED bookings)
   */
  static async getRemainingSeats(tripId: string): Promise<number> {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new Error("Trip not found");

    const totalBooked = await prisma.booking.aggregate({
      _sum: { numPersons: true },
      where: { tripId, status: BookingStatus.CONFIRMED },
    });

    return trip.capacity - (totalBooked._sum.numPersons ?? 0);
  }

  /**
   * Validate if a booking can be made based on trip capacity
   * @returns null if valid, error message if invalid
   */
  static async validateBookingCapacity(
    tripId: string,
    numPersons: number
  ): Promise<string | null> {
    if (!tripId || !numPersons || numPersons <= 0) {
      return "Number of persons must be greater than 0";
    }

    const remaining = await BookingService.getRemainingSeats(tripId);

    if (numPersons > remaining) {
      return `Cannot book more than ${remaining} person(s). Only ${remaining} seat(s) remaining.`;
    }

    return null;
  }

  async getAllBookings(): Promise<BookingModel[]> {
    const bookings = await this.repo.findAll();
    return bookings.map((b) => new BookingModel(b));
  }

  async getBookingById(id: string): Promise<BookingModel> {
    const booking = await this.repo.findById(id);
    if (!booking) throw new Error("Booking not found");
    return new BookingModel(booking);
  }

  async createBooking(data: CreateBookingInput): Promise<BookingModel> {
    // Validate booking capacity
    const validationError = await BookingService.validateBookingCapacity(
      data.tripId,
      data.numPersons
    );

    if (validationError) {
      throw new Error(validationError);
    }

    const booking = await this.repo.create(data);

    if (booking.status === BookingStatus.CONFIRMED) {
      await this.updateAnalytics(booking);
    }

    return new BookingModel(booking);
  }

  async updateBookingStatus(
    id: string,
    status: BookingStatus
  ): Promise<BookingModel> {
    const booking = await this.repo.update(id, { status });

    // Update analytics only if status becomes CONFIRMED
    if (status === BookingStatus.CONFIRMED) {
      await this.updateAnalytics(booking);
    }

    return new BookingModel(booking);
  }

  async deleteBooking(id: string) {
    const booking = await this.repo.findById(id);
    if (!booking) throw new Error("Booking not found");

    await this.repo.delete(id);

    // Decrement analytics if booking was CONFIRMED
    if (booking.status === BookingStatus.CONFIRMED) {
      const dateKey = booking.createdAt.toISOString().slice(0, 10);
      await prisma.analytics.updateMany({
        where: { date: new Date(dateKey) },
        data: {
          totalBookings: { decrement: 1 },
          totalRevenue: { decrement: booking.amountPaid || 0 },
        },
      });
    }

    return { message: "Booking deleted successfully" };
  }

  /**
   * Mark a booking as read
   */
  async markBookingAsRead(id: string): Promise<BookingModel> {
    const booking = await this.getBookingById(id);
    return await booking.markAsRead();
  }

  private async updateAnalytics(booking: any) {
    const dateKey = booking.createdAt.toISOString().slice(0, 10);

    await prisma.analytics.upsert({
      where: { date: new Date(dateKey) },
      update: {
        totalBookings: { increment: 1 },
        totalRevenue: { increment: booking.amountPaid || 0 },
      },
      create: {
        date: new Date(dateKey),
        totalBookings: 1,
        totalRevenue: booking.amountPaid || 0,
      },
    });
  }
}
