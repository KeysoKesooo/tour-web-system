import { TripRepository } from "@/core/repositories/Trip.Repository";
import { TripModel } from "@/core/models/Trip.model";
import { CreateTripInput, UpdateTripInput } from "@/core/dto/trip.dto";
import { prisma } from "@/lib/prisma";

export class TripService {
  private repo = new TripRepository();

  async getAllTrips(): Promise<TripModel[]> {
    const trips = await this.repo.findAll();
    return Promise.all(
      trips.map(async (t) => {
        const totalBooked = await prisma.booking.aggregate({
          _sum: { numPersons: true },
          where: { tripId: t.id, status: "CONFIRMED" },
        });
        return new TripModel(t, totalBooked._sum.numPersons ?? 0);
      })
    );
  }

  async getTripsByDestination(destination: string): Promise<TripModel[]> {
    // We use prisma.trip directly here because the filtering logic is complex and involves business logic (future dates).
    const trips = await prisma.trip.findMany({
      where: {
        // Filter by the 'location' field, which represents the destination
        location: {
          equals: destination,
          mode: "insensitive", // Use case-insensitive mode for robust search
        },
        startDate: {
          gt: new Date(), // Only show trips that haven't started yet
        },
      },
      orderBy: {
        startDate: "asc", // Order by the nearest upcoming date
      },
    });

    // We must still calculate the total booked seats for each trip
    return Promise.all(
      trips.map(async (t) => {
        const totalBooked = await prisma.booking.aggregate({
          _sum: { numPersons: true },
          where: { tripId: t.id, status: "CONFIRMED" },
        });
        return new TripModel(t, totalBooked._sum.numPersons ?? 0);
      })
    );
  }

  async getTripById(id: string): Promise<TripModel> {
    const trip = await this.repo.findById(id);
    if (!trip) throw new Error("Trip not found");

    const totalBooked = await prisma.booking.aggregate({
      _sum: { numPersons: true },
      where: { tripId: trip.id, status: "CONFIRMED" },
    });

    return new TripModel(trip, totalBooked._sum.numPersons ?? 0);
  }

  async createTrip(data: CreateTripInput): Promise<TripModel> {
    const trip = await this.repo.create(data); // Automatically initialize analytics for this trip

    await prisma.analytics.updateMany({
      where: { date: new Date(trip.createdAt.toISOString().slice(0, 10)) },
      data: { totalTrips: { increment: 1 } },
    });

    return new TripModel(trip);
  }

  async updateTrip(id: string, data: UpdateTripInput): Promise<TripModel> {
    const trip = await this.repo.update(id, data);
    return new TripModel(trip);
  }

  async deleteTrip(id: string): Promise<void> {
    const trip = await this.repo.findById(id);
    if (!trip) throw new Error("Trip not found");

    await this.repo.delete(id); // Decrement analytics totalTrips

    const dateKey = trip.createdAt.toISOString().slice(0, 10);
    await prisma.analytics.updateMany({
      where: { date: new Date(dateKey) },
      data: { totalTrips: { decrement: 1 } },
    });
  } // Optional: get total bookings and revenue for a specific trip

  async getTripAnalytics(tripId: string) {
    const bookings = await prisma.booking.findMany({
      where: { tripId, status: "CONFIRMED" },
    });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (sum, b) => sum + (b.amountPaid || 0),
      0
    );

    return { totalBookings, totalRevenue };
  }
}
