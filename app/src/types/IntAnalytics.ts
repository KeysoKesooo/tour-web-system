export interface IAnalytics {
  totalBookings: number;
  totalRevenue: number;
  totalTrips: number;
  mostBookedTrip?: {
    tripId: string;
    title: string;
    bookings: number;
  } | null;
  ongoingTripsToday?: number;
}
