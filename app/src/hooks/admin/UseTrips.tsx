"use client";

import { useEffect, useState, useCallback } from "react";
import { ITrip } from "@/types";

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

const fetchTrips = useCallback(async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/admin/trips");
    if (!res.ok) throw new Error("Failed to fetch trips");

    const data = await res.json(); // data already has remainingSeats
    setTrips(data);
  } catch (error) {
    console.error("Failed to fetch trips:", error);
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  fetchTrips();
}, [fetchTrips]);


  // ------------------- ADD OR UPDATE TRIP -------------------
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
      let savedTrip: ITrip;

      if (editingTrip) {
        const res = await fetch(`/api/admin/trips/${editingTrip.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update trip");
        savedTrip = await res.json();

        setTrips((prev) =>
          prev.map((t) => (t.id === savedTrip.id ? savedTrip : t))
        );
      } else {
        const res = await fetch("/api/admin/trips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create trip");
        savedTrip = await res.json();

        setTrips((prev) => [...prev, savedTrip]);
      }

      closeModal();
    } catch (error) {
      console.error("Failed to save trip:", error);
    }
  };

  // ------------------- DELETE TRIP -------------------
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    try {
      const res = await fetch(`/api/admin/trips/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete trip");

      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  // ------------------- MODAL -------------------
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

  // ------------------- FILTERED TRIPS -------------------
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
