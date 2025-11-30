import { AnalyticsRepository } from "@/core/repositories/Analytics.Repository";
import { TripModel } from "@/core/models/Trip.model";

export class AnalyticsService {
  private repo = new AnalyticsRepository();

  async getDashboardAnalytics() {
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
  }

  async getTotalTrips(): Promise<number> {
    return this.repo.countTrips();
  }

  async getMostBookedTrip(): Promise<TripModel | null> {
    const trip = await this.repo.findMostBookedTrip();
    if (!trip) return null;
    return new TripModel(trip);
  }

  async getOngoingTripsToday(): Promise<number> {
    return this.repo.countOngoingTrips(new Date());
  }

  async incrementAnalyticsForBooking(amount: number, createdAt: Date) {
    const dateKey = createdAt.toISOString().slice(0, 10);
    await this.repo.upsertAnalytics(new Date(dateKey), 1, amount);
  }

  async decrementAnalyticsForCancelledBooking(amount: number, createdAt: Date) {
    const dateKey = createdAt.toISOString().slice(0, 10);
    await this.repo.upsertAnalytics(new Date(dateKey), -1, -amount);
  }

  // Optional: fetch all dashboard data in one call
  async getDashboardData() {
    const latest = await this.getDashboardAnalytics();
    const totalTrips = await this.getTotalTrips();
    const mostBookedTrip = await this.getMostBookedTrip();
    const ongoingTripsToday = await this.getOngoingTripsToday();

    return {
      latest,
      totalTrips,
      mostBookedTrip,
      ongoingTripsToday,
    };
  }
}
