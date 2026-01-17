// app/api/public/trips/location/[location]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { TripService } from "@/core/services/TripService";

const tripService = new TripService();

const normalizeSlugToLocation = (slug: string): string => {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export async function GET(
  request: NextRequest,
  // 1. Update the type to Promise
  { params }: { params: Promise<{ location: string }> },
) {
  // 2. Await the params before destructuring
  const resolvedParams = await params;
  const locationSlug = resolvedParams.location;

  if (!locationSlug) {
    return NextResponse.json(
      { error: "Location slug is required." },
      { status: 400 },
    );
  }

  const locationName = normalizeSlugToLocation(locationSlug);

  try {
    const trips = await tripService.getTripsByDestination(locationName);

    if (trips.length === 0) {
      return NextResponse.json([]);
    }

    const responseData = trips.map((trip) => ({
      id: trip.id,
      title: trip.title,
      location: trip.location,
      price: trip.price,
      startDate: trip.startDate,
      endDate: trip.endDate,
      remainingSeats: trip.remainingSeats,
      imageUrl: trip.imageUrl, // Ensure this is included for your UI
      description: trip.description,
      capacity: trip.capacity,
    }));

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error(
      `Public Trip List API Error for ${locationName}:`,
      error.message,
    );
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 },
    );
  }
}
