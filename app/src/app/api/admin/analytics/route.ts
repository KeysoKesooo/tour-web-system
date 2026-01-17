// src/app/api/admin/analytics/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { AnalyticsService } from "@/core/services/AnalyticsService";

export async function GET() {
  try {
    // ✅ MOVE THIS INSIDE:
    const service = new AnalyticsService();

    const latest = await service.getDashboardAnalytics();
    const totalTrips = await service.getTotalTrips();
    const mostBooked = await service.getMostBookedTrip();

    return NextResponse.json({
      latest,
      totalTrips,
      mostBookedTrip: mostBooked,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
