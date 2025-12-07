import { AnalyticsRepository } from "@/core/repositories/Analytics.Repository";
import { TripModel } from "@/core/models/Trip.model";
import { CacheService } from "@/lib/redis/cacheService";
import { Client as QStashClient } from "@upstash/qstash";

const qstash = new QStashClient({ token: process.env.QSTASH_TOKEN! });

export class AnalyticsService {
  private repo = new AnalyticsRepository();

  // ------------------- READ-HEAVY METHODS (TTL CACHE) -------------------
  async getDashboardAnalytics() {
    return CacheService.getOrSet("analytics:dashboard", 60, async () => {
      const latest = await this.repo.findLatest();
      return (
        latest ?? {
          totalBookings: 0,
          totalRevenue: 0,
          totalTrips: 0,
          mostBookedTrip: null,
          ongoingTripsToday: 0,
        }
      );
    });
  }

  async getTotalTrips(): Promise<number> {
    return CacheService.getOrSet("analytics:totalTrips", 60, () =>
      this.repo.countTrips()
    );
  }

  async getMostBookedTrip(): Promise<TripModel | null> {
    return CacheService.getOrSet("analytics:mostBookedTrip", 60, async () => {
      const trip = await this.repo.findMostBookedTrip();
      if (!trip) return null;
      return new TripModel(trip);
    });
  }

  async getOngoingTripsToday(): Promise<number> {
    const key = `analytics:ongoingTrips:${new Date()
      .toISOString()
      .slice(0, 10)}`;
    return CacheService.getOrSet(key, 60, () =>
      this.repo.countOngoingTrips(new Date())
    );
  }

  // ------------------- WRITE-BEHIND (ASYNC via QStash) -------------------
  async incrementAnalyticsForBooking(amount: number, createdAt: Date) {
    await qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/qstash/analytics-worker`,
      body: { type: "incrementBooking", amount, createdAt },
    });
  }

  async decrementAnalyticsForCancelledBooking(amount: number, createdAt: Date) {
    await qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/qstash/analytics-worker`,
      body: { type: "decrementBooking", amount, createdAt },
    });
  }

  // ------------------- DASHBOARD DATA -------------------
  async getDashboardData() {
    const [latest, totalTrips, mostBookedTrip, ongoingTripsToday] =
      await Promise.all([
        this.getDashboardAnalytics(),
        this.getTotalTrips(),
        this.getMostBookedTrip(),
        this.getOngoingTripsToday(),
      ]);

    return {
      latest,
      totalTrips,
      mostBookedTrip,
      ongoingTripsToday,
    };
  }
}
