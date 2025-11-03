import { BookingRepository } from "@/core/repositories/bookingRepository";
import { BookingModel } from "@/core/models/Booking.model";
import { CreateBookingInput, UpdateBookingInput } from "@/core/dto/booking.dto";
import { BookingStatus } from "@/types/BookingStatus";
import { prisma } from "@/lib/prisma";

export class BookingService {
  private repo = new BookingRepository();

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
    // Check if trip exists and get remaining seats
    const trip = await prisma.trip.findUnique({ where: { id: data.tripId } });
    if (!trip) throw new Error("Trip not found");

    const totalBooked = await prisma.booking.aggregate({
      _sum: { numPersons: true },
      where: { tripId: data.tripId, status: BookingStatus.CONFIRMED },
    });

    const remainingSeats = trip.capacity - (totalBooked._sum.numPersons ?? 0);

    if (data.numPersons > remainingSeats) {
      throw new Error(`Not enough seats. Remaining: ${remainingSeats}`);
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
