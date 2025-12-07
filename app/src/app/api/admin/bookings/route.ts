import { NextRequest, NextResponse } from "next/server";
import { BookingService } from "@/core/services/BookingService";
import { CreateBookingDTO } from "@/core/dto/booking.dto";

const service = new BookingService();

export async function GET() {
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
    }))
  );
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = CreateBookingDTO.parse(json);

  const booking = await service.createBooking(parsed);
  return NextResponse.json({
    id: booking.id,
    fullName: booking.fullName,
    email: booking.email,
    status: booking.status,
  });
}
