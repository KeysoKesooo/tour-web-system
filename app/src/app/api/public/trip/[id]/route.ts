import { NextRequest, NextResponse } from "next/server";
import { TripService } from "@/core/services/TripService";

const tripService = new TripService();

/**
 * 🌎 Fetches details for a single trip by ID (Public Endpoint).
 * URL: /api/public/trip/[id]
 */
export async function GET(
  request: NextRequest,
  // 1. In Next.js 16, params is a Promise
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 2. Await the params before accessing the id
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Trip ID is required." },
        { status: 400 },
      );
    }

    const trip = await tripService.getTripById(id);

    if (!trip) {
      return NextResponse.json({ error: "Trip not found." }, { status: 404 });
    }

    // Filter out sensitive fields before sending to the client
    const responseData = {
      id: trip.id,
      title: trip.title,
      location: trip.location,
      price: trip.price,
      description: trip.description,
      startDate: trip.startDate,
      endDate: trip.endDate,
      remainingSeats: trip.remainingSeats,
      // Note: check if you need to add imageUrl or capacity here too!
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    // Note: Use a generic message for the catch block since 'id' might be the thing that failed
    console.error(`Public Trip API Error:`, error.message);

    return NextResponse.json(
      { error: "Failed to fetch trip details." },
      { status: 500 },
    );
  }
}
