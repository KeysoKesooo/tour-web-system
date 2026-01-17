import { NextRequest, NextResponse } from "next/server";
import { TripService } from "@/core/services/TripService";
import { UpdateTripDTO } from "@/core/dto/trip.dto";
import { requireAdmin } from "@/lib/requireAdmin"; // Added for security

const service = new TripService();

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  // 1. Security Check
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const trip = await service.getTripById(id);

  // 2. 404 Safety Check
  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

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
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  try {
    const json = await req.json().catch(() => ({})); // Prevent crash on empty body
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
    const status = err.name === "ZodError" ? 400 : 500;
    return NextResponse.json(
      { error: err.message || "Failed to update trip" },
      { status },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    await service.deleteTrip(id);
    return NextResponse.json({ message: "Trip deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to delete trip" },
      { status: 500 },
    );
  }
}
