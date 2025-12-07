import { NextRequest, NextResponse } from "next/server";
import { TripService } from "@/core/services/TripService";
import { CreateTripDTO } from "@/core/dto/trip.dto";

const service = new TripService();

export async function GET() {
  try {
    const trips = await service.getAllTripsWithBookings();
    return NextResponse.json(
      trips.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        location: t.location,
        price: t.price,
        capacity: t.capacity,
        remainingSeats: t.remainingSeats,
        startDate: t.startDate ? new Date(t.startDate).toISOString() : null,
        endDate: t.endDate ? new Date(t.endDate).toISOString() : null,
        imageUrl: t.imageUrl || null,
      }))
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const trip = await service.createTrip(CreateTripDTO.parse(json));

    return NextResponse.json({
      id: trip.id,
      title: trip.title,
      location: trip.location,
      price: trip.price,
      capacity: trip.capacity,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Failed to create trip" },
      { status: 400 }
    );
  }
}
