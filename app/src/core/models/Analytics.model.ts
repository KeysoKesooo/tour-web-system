import { IAnalytics } from "@/types"; // explicit path

export class AnalyticsModel implements IAnalytics {
  constructor(private analytics: IAnalytics) {}

  get totalBookings(): number {
    return this.analytics.totalBookings;
  }

  get totalRevenue(): number {
    return this.analytics.totalRevenue;
  }

  get totalTrips(): number {
    return this.analytics.totalTrips;
  }

  get mostBookedTrip() {
    return this.analytics.mostBookedTrip;
  }

  get ongoingTripsToday(): number {
    return this.analytics.ongoingTripsToday ?? 0;
  }

  // Optional helper
  revenueInUSD(): string {
    return `$${this.analytics.totalRevenue.toFixed(2)}`;
  }
}
