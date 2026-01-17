import { NextRequest, NextResponse } from "next/server";
import { TripService } from "@/core/services/TripService";
import { CreateTripDTO } from "@/core/dto/trip.dto";
import { requireAdmin } from "@/lib/requireAdmin"; // Added security

const service = new TripService();

export async function GET(req: NextRequest) {
  // 1. Security Check
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

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
      })),
    );
  } catch (err: any) {
    console.error("Admin Trip GET Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // 1. Security Check
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const json = await req.json().catch(() => null);
    if (!json) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const trip = await service.createTrip(CreateTripDTO.parse(json));

    return NextResponse.json(
      {
        id: trip.id,
        title: trip.title,
        location: trip.location,
        price: trip.price,
        capacity: trip.capacity,
      },
      { status: 201 },
    ); // Added 201 Created status
  } catch (err: any) {
    console.error("Admin Trip POST Error:", err);

    // Better error message for Zod validation failures
    const errorMessage =
      err.name === "ZodError"
        ? "Validation failed: " +
          err.errors.map((e: any) => e.message).join(", ")
        : err.message || "Failed to create trip";

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
