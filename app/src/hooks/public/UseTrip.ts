import { ITrip } from "@/types";

/**
 * Fetches all upcoming trips for a specific location (Listing Page).
 */
export async function fetchTripsByLocation(
  locationSlug: string
): Promise<ITrip[]> {
  try {
    const res = await fetch(`/api/public/trips/location/${locationSlug}`);

    if (res.status === 404) {
      return [];
    }

    if (!res.ok) {
      throw new Error(
        `Failed to fetch trips for ${locationSlug}: ${res.statusText}`
      );
    }

    const data: ITrip[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching trips by location:", error);
    throw error;
  }
}

/**
 * Fetches details for a single trip (Booking Detail Page).
 */
export async function fetchTripById(tripId: string): Promise<ITrip> {
  try {
    // NOTE: Uses admin route for GET, ensure authentication is enforced
    // to prevent unauthorized admin access, or create a public endpoint.
    const res = await fetch(`/api/public/trip/${tripId}`);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Trip not found.");
      }
      throw new Error(`Failed to fetch trip details: ${res.statusText}`);
    }

    const data: ITrip = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching trip ${tripId}:`, error);
    throw error;
  }
}
