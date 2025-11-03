import { prisma } from "@/lib/prisma";
import { CreateTripInput, UpdateTripInput } from "../dto/trip.dto";

export class TripRepository {
  async create(data: CreateTripInput) {
    return prisma.trip.create({ data });
  }

  async findAll() {
    return prisma.trip.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findById(id: string) {
    return prisma.trip.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateTripInput) {
    return prisma.trip.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.trip.delete({ where: { id } });
  }
}
