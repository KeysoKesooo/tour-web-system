import { prisma } from "@/lib/prisma";
import { CreateBookingInput, UpdateBookingInput } from "../dto/booking.dto";
import { BookingStatus } from "@/types/BookingStatus";

export class BookingRepository {
  async create(data: CreateBookingInput) {
    return prisma.booking.create({ data });
  }

  async findAll() {
    return prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: { trip: true },
    });
  }

  async findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: { trip: true },
    });
  }

  async update(id: string, data: UpdateBookingInput) {
    return prisma.booking.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.booking.delete({ where: { id } });
  }
}
