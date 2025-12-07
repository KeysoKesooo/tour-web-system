import { NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

import { BookingRepository } from "@/core/repositories/Booking.Repository";
import { CacheService } from "@/lib/redis/cacheService";

async function handler(req: Request) {
  try {
    const { type, payload } = await req.json();
    const repo = new BookingRepository();

    // Equivalent of BullMQ worker switch-case
    if (type === "createBooking") {
      const booking = await repo.create(payload);

      // invalidate caches
      await CacheService.invalidate("bookings:all");
      await CacheService.invalidate(`booking:${booking.id}`);

      return NextResponse.json({ ok: true, booking });
    }

    if (type === "updateBookingStatus") {
      const booking = await repo.update(payload.id, {
        status: payload.status,
      });

      // invalidate caches
      await CacheService.invalidate(`booking:${payload.id}`);
      await CacheService.invalidate("bookings:all");

      return NextResponse.json({ ok: true, booking });
    }

    throw new Error("Unknown job type");
  } catch (err) {
    console.error("QStash Worker Error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}

export const POST = verifySignatureAppRouter(handler);
