// src/core/models/TripModel.ts
import { Trip } from "@prisma/client";
import { ITrip } from "@/types";

export class TripModel implements ITrip {
  constructor(private trip: Trip, private totalBooked: number = 0) {}

  get id(): string {
    return this.trip.id;
  }
  get title(): string {
    return this.trip.title;
  }
  get description(): string {
    return this.trip.description;
  }
  get location(): string {
    return this.trip.location;
  }
  get price(): number {
    return this.trip.price;
  }
  get imageUrl(): string | undefined {
    return this.trip.imageUrl ?? undefined;
  }
  get startDate(): string {
    return this.trip.startDate.toISOString();
  }
  get endDate(): string {
    return this.trip.endDate.toISOString();
  }
  get capacity() {
    return this.trip.capacity;
  }

  durationDays(): number {
    const diff = this.trip.endDate.getTime() - this.trip.startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  get remainingSeats() {
    return this.trip.capacity - this.totalBooked;
  }

  isFull() {
    return this.remainingSeats <= 0;
  }
}
