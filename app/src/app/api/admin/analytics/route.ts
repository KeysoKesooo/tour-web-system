import { NextResponse } from "next/server";
import { AnalyticsService } from "@/core/services/AnalyticsService";

const service = new AnalyticsService();

export async function GET() {
  const latest = await service.getDashboardAnalytics();
  const totalTrips = await service.getTotalTrips();
  const mostBooked = await service.getMostBookedTrip();

  return NextResponse.json({
    latest,
    totalTrips,
    mostBookedTrip: mostBooked,
  });
}
