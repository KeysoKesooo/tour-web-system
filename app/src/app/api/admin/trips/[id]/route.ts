import { NextRequest, NextResponse } from "next/server";
import { TripService } from "@/core/services/TripService";
import { UpdateTripDTO } from "@/core/dto/trip.dto";

const service = new TripService();

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await params
  const trip = await service.getTripById(id);

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
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await params
  try {
    const json = await req.json();
    const validatedData = UpdateTripDTO.parse(json);

    const trip = await service.updateTrip(id, validatedData);

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
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await params
  await service.deleteTrip(id);
  return NextResponse.json({ message: "Trip deleted" });
}
