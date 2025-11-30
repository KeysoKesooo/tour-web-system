// src/types/ITrip.ts
export interface ITrip {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  capacity: number;
  imageUrl?: string | null;
  startDate: string;
  endDate: string;
  remainingSeats: number;
}
