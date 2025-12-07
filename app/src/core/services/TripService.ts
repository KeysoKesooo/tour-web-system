import { TripRepository } from "@/core/repositories/Trip.Repository";
import { BookingRepository } from "@/core/repositories/Booking.Repository";
import { AnalyticsRepository } from "@/core/repositories/Analytics.Repository";
import { TripModel } from "@/core/models/Trip.model";
import { CreateTripInput, UpdateTripInput } from "@/core/dto/trip.dto";
import { CacheService } from "@/lib/redis/cacheService";
import { enqueueJob } from "@/lib/redis/upstash";

export class TripService {
  private repo = new TripRepository();
  private bookingRepo = new BookingRepository();
  private analyticsRepo = new AnalyticsRepository();

  // ------------------- GET Methods (Cache TTL) -------------------
  async getAllTrips(): Promise<TripModel[]> {
    return CacheService.getOrSet("trips:all", 60, async () => {
      const trips = await this.repo.findAll();
      const tripIds = trips.map((t) => t.id);

      const bookingsSum = await this.bookingRepo.getTotalConfirmedForTrip(
        tripIds
      );

      return trips.map((trip) => {
        const booked =
          bookingsSum.find((b) => b.tripId === trip.id)?.total ?? 0;
        return new TripModel(trip, booked);
      });
    });
  }

  async getTripsByDestination(destination: string): Promise<TripModel[]> {
    const cacheKey = `trips:destination:${destination.toLowerCase()}`;
    return CacheService.getOrSet(cacheKey, 60, async () => {
      const trips = await this.repo.findByLocation(destination);
      const tripIds = trips.map((t) => t.id);

      const bookingsSum = await this.bookingRepo.getTotalConfirmedForTrip(
        tripIds
      );

      return trips.map((trip) => {
        const booked =
          bookingsSum.find((b) => b.tripId === trip.id)?.total ?? 0;
        return new TripModel(trip, booked);
      });
    });
  }

  async getTripById(id: string): Promise<TripModel> {
    return CacheService.getOrSet(`trip:${id}`, 60, async () => {
      const trip = await this.repo.findById(id);
      if (!trip) throw new Error("Trip not found");

      const bookingsSum = await this.bookingRepo.getTotalConfirmedForTrip([
        trip.id,
      ]);
      const booked = bookingsSum.find((b) => b.tripId === trip.id)?.total ?? 0;

      return new TripModel(trip, booked);
    });
  }

  async getAllTripsWithBookings(): Promise<TripModel[]> {
    return this.getAllTrips(); // Already optimized above
  }

  // ------------------- CREATE (Write-Behind via QStash) -------------------
  async createTrip(data: CreateTripInput): Promise<TripModel> {
    await enqueueJob("trip-worker", {
      type: "createTrip",
      payload: data,
    });
    return this.createTripCore(data);
  }

  private async createTripCore(data: CreateTripInput): Promise<TripModel> {
    const trip = await this.repo.create(data);

    // Invalidate cache
    await CacheService.invalidate("trips:all");

    // Update analytics via repository
    const dateKey = trip.createdAt.toISOString().slice(0, 10);
    await this.analyticsRepo.upsertTripAnalytics(dateKey, 1);

    return new TripModel(trip);
  }

  // ------------------- UPDATE (Invalidate Cache) -------------------
  async updateTrip(id: string, data: UpdateTripInput): Promise<TripModel> {
    const trip = await this.repo.update(id, data);

    await CacheService.invalidate(`trip:${id}`);
    await CacheService.invalidate("trips:all");

    return new TripModel(trip);
  }

  // ------------------- DELETE (Invalidate Cache) -------------------
  async deleteTrip(id: string): Promise<void> {
    const trip = await this.repo.findById(id);
    if (!trip) throw new Error("Trip not found");

    await this.repo.delete(id);

    const dateKey = trip.createdAt.toISOString().slice(0, 10);
    await this.analyticsRepo.decrementTripAnalytics(dateKey, 1);

    await CacheService.invalidate(`trip:${id}`);
    await CacheService.invalidate("trips:all");
  }

  // ------------------- Analytics (Cache optional) -------------------
  async getTripAnalytics(tripId: string) {
    return CacheService.getOrSet(`trip:analytics:${tripId}`, 60, async () => {
      const totalBooked = await this.bookingRepo.getTotalConfirmedForTrip([
        tripId,
      ]);
      const totalRevenue = await this.bookingRepo.getTotalRevenueForTrip(
        tripId
      );

      return { totalBookings: totalBooked, totalRevenue };
    });
  }
}
