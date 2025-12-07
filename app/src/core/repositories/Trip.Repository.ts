import { prisma } from "@/lib/prisma";
import { CreateTripInput, UpdateTripInput } from "../dto/trip.dto";
import { Trip } from "@prisma/client";

export class TripRepository {
  async create(data: CreateTripInput) {
    return prisma.trip.create({ data });
  }

  async findAll(): Promise<Trip[]> {
    return prisma.trip.findMany({ orderBy: { startDate: "asc" } });
  }

  async findById(id: string): Promise<Trip | null> {
    return prisma.trip.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateTripInput) {
    return prisma.trip.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.trip.delete({ where: { id } });
  }

  async findByLocation(location: string): Promise<Trip[]> {
    return prisma.trip.findMany({
      where: {
        location: { equals: location, mode: "insensitive" },
        startDate: { gte: new Date() },
      },
      orderBy: { startDate: "asc" },
    });
  }

  // Booking aggregation helpers
  async getTotalBooked(tripId: string): Promise<number> {
    const result = await prisma.booking.aggregate({
      where: { tripId, status: "CONFIRMED" },
      _sum: { numPersons: true },
    });
    return result._sum.numPersons ?? 0;
  }

  async getTotalBookedForTrips(
    tripIds: string[]
  ): Promise<{ tripId: string; total: number }[]> {
    const result = await prisma.booking.groupBy({
      by: ["tripId"],
      where: { tripId: { in: tripIds }, status: "CONFIRMED" },
      _sum: { numPersons: true },
    });
    return result.map((r) => ({
      tripId: r.tripId,
      total: r._sum.numPersons ?? 0,
    }));
  }
}
