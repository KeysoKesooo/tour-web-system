import { prisma } from "@/lib/prisma";
import { TripModel } from "@/core/models/Trip.model";

export class AnalyticsService {
  // Get latest dashboard analytics
  async getDashboardAnalytics() {
    const analytics = await prisma.analytics.findMany({
      orderBy: { date: "desc" },
      take: 1,
    });

    const latest = analytics[0] ?? {
      totalBookings: 0,
      totalRevenue: 0,
      totalTrips: 0,
      mostBookedTrip: null,
    };

    return latest;
  }

  // Total trips in system
  async getTotalTrips(): Promise<number> {
    return prisma.trip.count();
  }

  // Get the most booked trip
  async getMostBookedTrip(): Promise<TripModel | null> {
    const bookings = await prisma.booking.groupBy({
      by: ["tripId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 1,
    });

    if (!bookings || bookings.length === 0) return null;

    const trip = await prisma.trip.findUnique({ where: { id: bookings[0].tripId } });
    if (!trip) return null;

    return new TripModel(trip);
  }

  // --- helpers for booking updates ---
  async incrementAnalyticsForBooking(amount: number, createdAt: Date) {
    const dateKey = createdAt.toISOString().slice(0, 10);
    await prisma.analytics.upsert({
      where: { date: new Date(dateKey) },
      update: {
        totalBookings: { increment: 1 },
        totalRevenue: { increment: amount },
      },
      create: {
        date: new Date(dateKey),
        totalBookings: 1,
        totalRevenue: amount,
      },
    });
  }

  async decrementAnalyticsForCancelledBooking(amount: number, createdAt: Date) {
    const dateKey = createdAt.toISOString().slice(0, 10);
    await prisma.analytics.updateMany({
      where: { date: new Date(dateKey) },
      data: {
        totalBookings: { decrement: 1 },
        totalRevenue: { decrement: amount },
      },
    });
  }
}
