import { NextRequest, NextResponse } from "next/server";
import { AnalyticsService } from "@/core/services/AnalyticsService";
import { requireAdmin } from "@/lib/requireAdmin";

// Next.js 16: Ensure this route is always fresh at request time
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // 1. Security Check: Protect sensitive dashboard data
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    // 2. Initialize service inside the handler for clean scope
    const service = new AnalyticsService();

    // 3. Fetch analytics data in parallel for better performance
    const [latest, totalTrips, mostBooked] = await Promise.all([
      service.getDashboardAnalytics(),
      service.getTotalTrips(),
      service.getMostBookedTrip(),
    ]);

    return NextResponse.json({
      latest,
      totalTrips,
      mostBookedTrip: mostBooked,
    });
  } catch (error: any) {
    console.error("Analytics API Error:", error.message);

    return NextResponse.json(
      { error: "An error occurred while generating analytics." },
      { status: 500 },
    );
  }
}
