"use client";

import { useState, useEffect, useCallback } from "react";
import { ITrip, BookingFormData } from "@/types";

interface UseTripDetailReturn {
  trip: ITrip | null;
  isLoading: boolean;
  error: string | null;
  formData: BookingFormData;
  isSubmitting: boolean;
  bookingError: string | null;
  bookingSuccess: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmitBooking: () => Promise<void>;
  setBookingSuccess: (val: boolean) => void;
}

export function useBookTrip(tripId: string): UseTripDetailReturn {
  const [trip, setTrip] = useState<ITrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    email: "",
    phone: "",
    numPersons: 1,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Fetch trip
  const fetchTrip = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/public/trip/${tripId}`);
      if (!res.ok) throw new Error("Trip not found or failed to load.");
      const data: ITrip = await res.json();
      setTrip(data);

      // Ensure numPersons does not exceed remainingSeats
      setFormData((prev) => ({
        ...prev,
        numPersons: Math.min(prev.numPersons, data.remainingSeats || 1),
      }));
    } catch (err: any) {
      setError(err.message || "Could not load trip details.");
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    if (tripId) fetchTrip();
  }, [tripId, fetchTrip]);

  // Booking handlers
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;

      setFormData((prev) => {
        if (name === "numPersons" && trip) {
          const val = parseInt(value) || 1;
          // Enforce maxSeats
          return {
            ...prev,
            numPersons: Math.min(Math.max(val, 1), trip.remainingSeats),
          };
        }
        return {
          ...prev,
          [name]: type === "number" ? parseInt(value) || 0 : value,
        };
      });
    },
    [trip]
  );

  const handleSubmitBooking = useCallback(async () => {
    if (!trip) return;

    setIsSubmitting(true);
    setBookingError(null);
    setBookingSuccess(false);

    try {
      const payload = { ...formData, tripId: trip.id };

      const res = await fetch("/api/public/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to complete booking.");
      }

      setBookingSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        numPersons: 1,
        message: "",
      });

      // Refresh trip after booking to update remainingSeats
      await fetchTrip();
    } catch (err: any) {
      setBookingError(err.message || "Unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, trip, fetchTrip]);

  return {
    trip,
    isLoading,
    error,
    formData,
    isSubmitting,
    bookingError,
    bookingSuccess,
    handleChange,
    handleSubmitBooking,
    setBookingSuccess,
  };
}
