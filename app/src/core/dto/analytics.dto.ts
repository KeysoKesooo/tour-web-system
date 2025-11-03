export const AnalyticsDTO = {
  totalBookings: 0,
  totalRevenue: 0,
  totalTrips: 0,
  mostBookedTrip: null as { tripId: string; title: string; bookings: number } | null,
  ongoingTripsToday: 0,
};

export type AnalyticsOutput = typeof AnalyticsDTO;
