// app/api/public/trips/location/[location]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { TripService } from "@/core/services/TripService";

const tripService = new TripService();

/**
 * Utility function to convert the URL slug back into a capitalized location name.
 * e.g., 'palenke' -> 'Palenke'
 */
const normalizeSlugToLocation = (slug: string): string => {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * 🌎 Fetches all upcoming trips available for a specific destination (Public Endpoint).
 * URL: /api/public/trips/location/[location]
 */
export async function GET(
  request: NextRequest,
  // Next.js convention to access dynamic route parameters
  { params }: { params: { location: string } }
) {
  const { location: locationSlug } = params;

  if (!locationSlug) {
    return NextResponse.json(
      { error: "Location slug is required." },
      { status: 400 }
    );
  }

  // Convert the URL slug (e.g., 'palenke') back to the expected database name (e.g., 'Palenke')
  const locationName = normalizeSlugToLocation(locationSlug);

  try {
    // 1. Call the service layer to fetch and enrich trip data
    const trips = await tripService.getTripsByDestination(locationName);

    // 2. Return the trips (empty array if none found)
    if (trips.length === 0) {
      // Note: Returning 200 with an empty array is standard for "no results found"
      return NextResponse.json([]);
    }

    // 3. Filter out sensitive fields (like internal IDs or secrets) before responding.
    // Assuming TripModel contains necessary public fields.
    const responseData = trips.map((trip) => ({
      id: trip.id,
      title: trip.title,
      location: trip.location,
      price: trip.price,
      startDate: trip.startDate,
      endDate: trip.endDate,
      remainingSeats: trip.remainingSeats,
      // Include other publicly displayed fields here
    }));

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error(
      `Public Trip List API Error for ${locationName}:`,
      error.message
    );

    // This 500 status typically indicates a database or service error
    return NextResponse.json(
      { error: "An unexpected server error occurred while fetching trips." },
      { status: 500 }
    );
  }
}
