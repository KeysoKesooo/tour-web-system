// pages/api/qstash/analytics-worker.ts
import { NextRequest, NextResponse } from "next/server";
import { AnalyticsRepository } from "@/core/repositories/Analytics.Repository";
import { CacheService } from "@/lib/redis/cacheService";

const repo = new AnalyticsRepository();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, amount, createdAt } = body;
    const dateKey = new Date(createdAt).toISOString().slice(0, 10);

    if (type === "incrementBooking") {
      await repo.upsertAnalytics(new Date(dateKey), 1, amount);
    } else if (type === "decrementBooking") {
      await repo.upsertAnalytics(new Date(dateKey), -1, -amount);
    } else {
      throw new Error("Unknown analytics job type");
    }

    // Invalidate related caches
    await Promise.all([
      CacheService.invalidate("analytics:dashboard"),
      CacheService.invalidate("analytics:totalTrips"),
      CacheService.invalidate("analytics:mostBookedTrip"),
      CacheService.invalidate(`analytics:ongoingTrips:${dateKey}`),
    ]);

    return NextResponse.json({ message: "Analytics updated" });
  } catch (err: any) {
    console.error("QStash analytics worker error:", err);
    return NextResponse.json(
      { error: err.message || "Worker error" },
      { status: 500 }
    );
  }
}
