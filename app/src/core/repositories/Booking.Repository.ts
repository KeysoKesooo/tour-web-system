import { prisma } from "@/lib/prisma";
import { CreateBookingInput, UpdateBookingInput } from "../dto/booking.dto";
import { BookingStatus } from "@/types/BookingStatus";

export class BookingRepository {
  async create(data: CreateBookingInput) {
    return prisma.booking.create({ data });
  }

  async findAll() {
    return prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: { trip: true },
    });
  }

  async findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: { trip: true },
    });
  }

  async update(id: string, data: UpdateBookingInput) {
    return prisma.booking.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.booking.delete({ where: { id } });
  }

  /** Helper: get total confirmed bookings for a trip */
  async getTotalConfirmedForTrip(tripIds: string[]) {
    if (tripIds.length === 0) return [];
    return prisma.booking
      .groupBy({
        by: ["tripId"],
        where: { tripId: { in: tripIds }, status: BookingStatus.CONFIRMED },
        _sum: { numPersons: true },
      })
      .then((results) =>
        results.map((r) => ({
          tripId: r.tripId,
          total: r._sum.numPersons ?? 0,
        }))
      );
  }

  /**
   * Get total revenue for a trip or multiple trips
   */
  async getTotalRevenueForTrip(
    tripIds: string | string[]
  ): Promise<{ tripId: string; totalRevenue: number }[]> {
    const ids = Array.isArray(tripIds) ? tripIds : [tripIds];
    if (ids.length === 0) return [];

    const result = await prisma.booking.groupBy({
      by: ["tripId"],
      where: {
        tripId: { in: ids },
        status: BookingStatus.CONFIRMED,
      },
      _sum: { amountPaid: true },
    });

    return result.map((r) => ({
      tripId: r.tripId,
      totalRevenue: r._sum.amountPaid ?? 0,
    }));
  }

  /** Analytics: upsert confirmed booking */
  async upsertAnalytics(booking: any) {
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

  /** Analytics: decrement on booking delete */
  async decrementAnalytics(booking: any) {
    const dateKey = booking.createdAt.toISOString().slice(0, 10);
    await prisma.analytics.updateMany({
      where: { date: new Date(dateKey) },
      data: {
        totalBookings: { decrement: 1 },
        totalRevenue: { decrement: booking.amountPaid || 0 },
      },
    });
  }
}
