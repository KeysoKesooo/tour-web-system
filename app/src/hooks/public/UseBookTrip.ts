"use client";

import { useState, useEffect, useCallback } from "react";
import { ITrip, BookingFormData } from "@/types";

export const useBookTrip = (tripId: string) => {
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

  // ============================
  // FETCH TRIP
  // ============================
  const fetchTrip = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/public/trip/${tripId}`);
      if (!res.ok) throw new Error("Trip not found.");

      const data: ITrip = await res.json();
      setTrip(data);

      // Ensure numPersons does not exceed remaining seats
      setFormData((prev) => ({
        ...prev,
        numPersons: Math.min(prev.numPersons, data.remainingSeats || 1),
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    if (tripId) fetchTrip();
  }, [tripId, fetchTrip]);

  // ============================
  // REMAINING SEATS
  // ============================
  const getRemainingSeats = useCallback(() => {
    if (!trip) return 0;
    return trip.remainingSeats ?? 0;
  }, [trip]);

  const validateNumPersons = useCallback(
    (num: number) => {
      if (!trip) return null;

      const remaining = getRemainingSeats();

      if (num > remaining) {
        return `You cannot book more than ${remaining} person(s). Only ${remaining} seat(s) remaining.`;
      }

      return null;
    },
    [trip, getRemainingSeats]
  );

  // ============================
  // INPUT HANDLER
  // ============================
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      // Allow only digits
      if (!/^\d*$/.test(value)) return;

      setFormData((prev) => {
        if (name === "numPersons" && trip) {
          const val = parseInt(value) || 0;
          const clamped = Math.min(val, trip.remainingSeats); // clamp to remaining seats
          return { ...prev, numPersons: clamped };
        }
        return { ...prev, [name]: value };
      });
    },
    [trip]
  );

  // ============================
  // SUBMIT BOOKING
  // ============================
  const handleSubmitBooking = useCallback(async () => {
    if (!trip) return;

    // Validate number of persons
    const validationError = validateNumPersons(formData.numPersons);
    if (validationError) {
      setBookingError(validationError);
      return;
    }

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
        throw new Error(errorData.error || "Booking failed.");
      }

      setBookingSuccess(true);

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        numPersons: 1,
        message: "",
      });

      // Refresh seats
      await fetchTrip();
    } catch (err: any) {
      setBookingError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, trip, fetchTrip, validateNumPersons]);

  // ============================
  // PHONE VALIDATION
  // ============================
  const validatePhone = (phone: string) => {
    if (phone && phone.length < 12) {
      return `Phone number must be at least 12 characters (current: ${phone.length})`;
    }
    return null;
  };

  return {
    trip,
    isLoading,
    error,

    formData,
    setFormData,

    isSubmitting,
    bookingError,
    bookingSuccess,
    setBookingSuccess,

    handleChange,
    handleSubmitBooking,

    getRemainingSeats,
    validateNumPersons,
    validatePhone,
  };
};
