import { ITrip } from "./IntTrip";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export interface IBooking {
  id: string;
  createdAt: Date;
  fullName: string;
  email: string;
  phone: string;
  numPersons: number;
  message?: string | null;
  status: BookingStatus;
  tripId: string;
  amountPaid: number;
  readAt?: Date | null;
  trip?: ITrip;
}

export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  numPersons: number;
  message: string;
}
