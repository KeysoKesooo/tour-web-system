import { NextRequest, NextResponse } from "next/server";
import { BookingService } from "@/core/services/BookingService";
import { BookingStatus } from "@/types/BookingStatus";

const service = new BookingService();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const booking = await service.getBookingById(params.id);
  return NextResponse.json({
    id: booking.id,
    fullName: booking.fullName,
    email: booking.email,
    status: booking.status
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const json = await req.json();
  const status = json.status as BookingStatus;
  const booking = await service.updateBookingStatus(params.id, status);
  return NextResponse.json({ id: booking.id, status: booking.status });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const res = await service.deleteBooking(params.id);
  return NextResponse.json(res);
}
