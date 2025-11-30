"use client";

import { useEffect, useState } from "react";
import { ITrip } from "@/types";
import { useBooks } from "@/hooks/admin/UseBooks";

export function useTrips() {
  const [trips, setTrips] = useState<ITrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<ITrip | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    capacity: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
  });

  // booking refresh logic
  const { fetchBookings, setBookings } = useBooks();

  // Fetch trips when component mounts
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await fetch("/api/admin/trips");
      const data = await res.json();
      setTrips(data);
      
      // Auto-update bookings for any trips that have connected bookings
      // This ensures bookings stay in sync when trips are loaded/refreshed
      const tripIds = data.map((trip: ITrip) => trip.id);
      setBookings((prevBookings) => {
        const bookingsToUpdate = prevBookings.filter((b) => tripIds.includes(b.tripId));
        if (bookingsToUpdate.length === 0) {
          return prevBookings;
        }

        return prevBookings.map((booking) => {
          if (tripIds.includes(booking.tripId)) {
            const updatedTrip = data.find((t: ITrip) => t.id === booking.tripId);
            if (updatedTrip) {
              return { ...booking, trip: updatedTrip };
            }
          }
          return booking;
        });
      });
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update bookings connected to a specific trip
  const updateBookingsForTrip = async (tripId: string, updatedTripData?: ITrip) => {
    try {
      // Use provided trip data or fetch it if not provided
      let updatedTrip = updatedTripData;
      if (!updatedTrip) {
        const tripRes = await fetch(`/api/admin/trips/${tripId}`);
        if (!tripRes.ok) {
          throw new Error("Failed to fetch updated trip");
        }
        updatedTrip = await tripRes.json();
      }

      // Update only bookings that are connected to this trip
      setBookings((prevBookings) => {
        const hasConnectedBookings = prevBookings.some((b) => b.tripId === tripId);
        if (!hasConnectedBookings) {
          // No bookings to update, return unchanged
          return prevBookings;
        }

        return prevBookings.map((booking) => {
          if (booking.tripId === tripId) {
            // Update the trip data for bookings connected to this trip
            return { ...booking, trip: updatedTrip };
          }
          // Keep other bookings unchanged
          return booking;
        });
      });
    } catch (error) {
      console.error("Failed to update bookings for trip:", error);
      // Fallback to full refresh if update fails
      await fetchBookings();
    }
  };

  // ✅ Add or update a trip
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      imageUrl: formData.imageUrl || undefined,
    };

    try {
      let tripId: string;
      let savedTrip: ITrip;
      
      if (editingTrip) {
        // update
        const res = await fetch(`/api/admin/trips/${editingTrip.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error("Failed to update trip");
        }
        savedTrip = await res.json();
        tripId = editingTrip.id;
      } else {
        // create
        const res = await fetch("/api/admin/trips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error("Failed to create trip");
        }
        savedTrip = await res.json();
        tripId = savedTrip.id;
      }

      await fetchTrips();
      // Auto-update bookings connected to this trip with the saved trip data
      await updateBookingsForTrip(tripId, savedTrip);
      closeModal();
    } catch (error) {
      console.error("Failed to save trip:", error);
    }
  };

  // ✅ Delete a trip
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    try {
      await fetch(`/api/admin/trips/${id}`, { method: "DELETE" });
      
      // Remove bookings connected to deleted trip from state
      setBookings((prevBookings) => 
        prevBookings.filter((booking) => booking.tripId !== id)
      );
      
      await fetchTrips();
      // Refresh all bookings to ensure consistency
      await fetchBookings();
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  // ✅ Open and close modal
  const openModal = (trip?: ITrip) => {
    if (trip) {
      setEditingTrip(trip);
      setFormData({
        title: trip.title,
        description: trip.description,
        location: trip.location,
        price: trip.price.toString(),
        capacity: trip.capacity.toString(),
        startDate: trip.startDate
          ? new Date(trip.startDate).toISOString().split("T")[0]
          : "",
        endDate: trip.endDate
          ? new Date(trip.endDate).toISOString().split("T")[0]
          : "",
        imageUrl: trip.imageUrl || "",
      });
    } else {
      setEditingTrip(null);
      setFormData({
        title: "",
        description: "",
        location: "",
        price: "",
        capacity: "",
        startDate: "",
        endDate: "",
        imageUrl: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTrip(null);
  };

  // ✅ Filter logic
  const filteredTrips = trips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    trips,
    loading,
    searchTerm,
    setSearchTerm,
    showModal,
    openModal,
    closeModal,
    editingTrip,
    formData,
    setFormData,
    handleSubmit,
    handleDelete,
    filteredTrips,
    fetchTrips,
  };
}
