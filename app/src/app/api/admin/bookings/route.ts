import { NextRequest, NextResponse } from "next/server";
import { BookingService } from "@/core/services/BookingService";
import { CreateBookingDTO } from "@/core/dto/booking.dto";
import { requireAdmin } from "@/lib/requireAdmin"; // Added security

const service = new BookingService();

export async function GET(req: NextRequest) {
  // 1. Security Check
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const bookings = await service.getAllBookingsWithTrips();

    return NextResponse.json(
      bookings.map((b) => ({
        id: b.id,
        fullName: b.fullName,
        email: b.email,
        phone: b.phone,
        numPersons: b.numPersons,
        message: b.message,
        status: b.status,
        tripId: b.tripId,
        amountPaid: b.amountPaid,
        createdAt: b.createdAt,
      })),
    );
  } catch (err: any) {
    console.error("Admin Booking GET Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  // 1. Security Check
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    // 2. Safe JSON parsing for Next.js 16
    const json = await req.json().catch(() => null);
    if (!json) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = CreateBookingDTO.parse(json);
    const booking = await service.createBooking(parsed);

    return NextResponse.json(
      {
        id: booking.id,
        fullName: booking.fullName,
        email: booking.email,
        status: booking.status,
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Admin Booking POST Error:", err);

    // Better feedback for validation errors
    const errorMessage =
      err.name === "ZodError"
        ? "Validation failed: " +
          err.errors.map((e: any) => e.message).join(", ")
        : err.message || "Failed to create booking";

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
