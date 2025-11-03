// src/core/models/BookingModel.ts
import { Booking } from "@prisma/client";
import { BookingStatus, IBooking } from "@/types";
import { prisma } from "@/lib/prisma";

export class BookingModel implements IBooking {
  constructor(private booking: Booking) {}

  get id(): string { return this.booking.id; }
  get fullName(): string { return this.booking.fullName; }
  get email(): string { return this.booking.email; }
  get phone(): string { return this.booking.phone; }
  get numPersons(): number { return this.booking.numPersons; }
  get message(): string | null { return this.booking.message; }
  get status(): BookingStatus { return this.booking.status as BookingStatus; }
  get tripId(): string { return this.booking.tripId; }
  get amountPaid(): number { return this.booking.amountPaid || 0; }
  get createdAt(): Date { return this.booking.createdAt; }

  isPending(): boolean { return this.status === BookingStatus.PENDING; }
  isConfirmed(): boolean { return this.status === BookingStatus.CONFIRMED; }
  isCancelled(): boolean { return this.status === BookingStatus.CANCELLED; }

  async setStatus(newStatus: BookingStatus) {
    const updated = await prisma.booking.update({
      where: { id: this.booking.id },
      data: { status: newStatus },
    });
    this.booking = updated;
    return this;
  }
}
