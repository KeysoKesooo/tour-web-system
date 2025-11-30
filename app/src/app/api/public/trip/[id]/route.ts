// src/app/api/public/trip/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { TripService } from "@/core/services/TripService";

const tripService = new TripService();

/**
 * 🌎 Fetches details for a single trip by ID (Public Endpoint).
 * URL: /api/public/trip/[id]
 */
export async function GET(
  request: NextRequest,
  // Destructure 'params' directly from the second argument
  { params }: { params: { id: string } }
) {
  // 🔑 FIX APPLIED: Access the 'id' property directly from the destructured 'params' object.
  // If the error persists, the solution is usually found by simplifying the argument definition.
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Trip ID is required." },
      { status: 400 }
    );
  }

  try {
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
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error(`Public Trip API Error for ID ${id}:`, error.message);

    // ... (error handling) ...
    return NextResponse.json(
      { error: "Failed to fetch trip details." },
      { status: 500 }
    );
  }
}

// NOTE: If the error still occurs, try restarting your development server,
// as Next.js caches module resolution heavily.
