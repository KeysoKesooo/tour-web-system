import { NextRequest, NextResponse } from "next/server";
import { TripService } from "@/core/services/TripService";
import { UpdateTripDTO } from "@/core/dto/trip.dto"; // ✅ import your DTO

const service = new TripService();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const trip = await service.getTripById(params.id);
  return NextResponse.json({
    id: trip.id,
    title: trip.title,
    description: trip.description,
    location: trip.location,
    price: trip.price,
    capacity: trip.capacity,
    remainingSeats: trip.remainingSeats,
    startDate: trip.startDate ? new Date(trip.startDate).toISOString() : null,
    endDate: trip.endDate ? new Date(trip.endDate).toISOString() : null,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const json = await req.json();

    // ✅ Validate + transform data
    const validatedData = UpdateTripDTO.parse(json);

    const trip = await service.updateTrip(params.id, validatedData);

    return NextResponse.json({
      id: trip.id,
      title: trip.title,
      location: trip.location,
      capacity: trip.capacity,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Failed to update trip" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await service.deleteTrip(params.id);
  return NextResponse.json({ message: "Trip deleted" });
}
