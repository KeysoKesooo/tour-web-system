import { prisma } from "@/lib/prisma";

export class AnalyticsRepository {
  // ------------------- General Analytics -------------------
  async findLatest() {
    const latest = await prisma.analytics.findFirst({
      orderBy: { date: "desc" },
    });

    if (!latest) return null;

    return {
      totalBookings: latest.totalBookings,
      totalRevenue: latest.totalRevenue,
      totalTrips: latest.totalTrips,
      mostBookedTrip: null, // handled in service
      ongoingTripsToday: 0, // handled in service
    };
  }

  // ------------------- Upsert / Increment Analytics -------------------
  async upsertTripAnalytics(dateKey: string, increment = 1) {
    const date = new Date(dateKey);
    return prisma.analytics.upsert({
      where: { date },
      update: { totalTrips: { increment } },
      create: { date, totalTrips: increment },
    });
  }

  async decrementTripAnalytics(dateKey: string, decrement = 1) {
    const date = new Date(dateKey);
    return prisma.analytics.updateMany({
      where: { date },
      data: { totalTrips: { decrement } },
    });
  }

  async upsertBookingAnalytics(
    dateKey: string,
    bookingsIncrement = 0,
    revenueIncrement = 0
  ) {
    const date = new Date(dateKey);
    return prisma.analytics.upsert({
      where: { date },
      update: {
        totalBookings: { increment: bookingsIncrement },
        totalRevenue: { increment: revenueIncrement },
      },
      create: {
        date,
        totalBookings: bookingsIncrement,
        totalRevenue: revenueIncrement,
      },
    });
  }

  // ------------------- Trip Stats -------------------
  async countTrips(): Promise<number> {
    return prisma.trip.count();
  }

  async countOngoingTrips(today: Date): Promise<number> {
    return prisma.trip.count({
      where: {
        startDate: { lte: today },
        endDate: { gte: today },
      },
    });
  }

  async findMostBookedTrip() {
    const bookings = await prisma.booking.groupBy({
      by: ["tripId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 1,
    });

    if (!bookings || bookings.length === 0) return null;

    return prisma.trip.findUnique({ where: { id: bookings[0].tripId } });
  }
}
