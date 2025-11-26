import { prisma } from "@/lib/prisma";
import { AnalyticsOutput } from "../dto/analytics.dto";

export class AnalyticsRepository {
  async findLatest(): Promise<AnalyticsOutput | null> {
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

  async upsertAnalytics(
    date: Date,
    bookingsIncrement = 0,
    revenueIncrement = 0
  ) {
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

  async countTrips(): Promise<number> {
    return prisma.trip.count();
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

  async countOngoingTrips(today: Date): Promise<number> {
    return prisma.trip.count({
      where: {
        startDate: { lte: today },
        endDate: { gte: today },
      },
    });
  }
}
