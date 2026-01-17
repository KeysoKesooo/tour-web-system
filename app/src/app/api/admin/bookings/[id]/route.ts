import { NextRequest, NextResponse } from "next/server";
import { BookingService } from "@/core/services/BookingService";
import { BookingStatus } from "@/types/BookingStatus";
import { requireAdmin } from "@/lib/requireAdmin";

const service = new BookingService();

// 1. GET Booking Details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Type as Promise
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params; // Must await params
    const booking = await service.getBookingById(id);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: booking.id,
      fullName: booking.fullName,
      email: booking.email,
      status: booking.status,
      readAt: booking.readAt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. PATCH Booking Status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Type as Promise
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params; // Must await params
    const json = await req.json().catch(() => ({}));
    const status = json.status as BookingStatus;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    }

    const booking = await service.updateBookingStatus(id, status);
    return NextResponse.json({ id: booking.id, status: booking.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// 3. DELETE Booking
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Type as Promise
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params; // Must await params
    const res = await service.deleteBooking(id);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
