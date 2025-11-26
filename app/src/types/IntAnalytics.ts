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

export interface Trend {
  date: string;
  totalBookings: number;
  totalRevenue: number;
}

export interface TopTrip {
  id: string;
  title: string;
  bookings: number;
  revenue: number;
}
