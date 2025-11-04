"use client";

import { useEffect, useState } from "react";
import { IBooking, ITrip } from "@/types";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export const useBooks = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [trips, setTrips] = useState<ITrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<IBooking | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    numPersons: "",
    message: "",
    tripId: "",
    status: "PENDING" as "PENDING" | "CONFIRMED" | "CANCELLED",
    amountPaid: "",
  });

  useEffect(() => {
    fetchBookings();
    fetchTrips();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();

      const bookingsWithTrips = await Promise.all(
        data.map(async (booking: IBooking) => {
          try {
            const tripRes = await fetch(`/api/admin/trips/${booking.tripId}`);
            const trip = await tripRes.json();
            return { ...booking, trip };
          } catch {
            return booking;
          }
        })
      );

      setBookings(bookingsWithTrips);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await fetch("/api/admin/trips");
      const data = await res.json();
      setTrips(data);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    }
  };

  


  // ✅ Update bookings for a specific trip (used by UseTrips hook)
  const updateBookingsForTrip = (tripId: string, updatedTrip: ITrip) => {
    setBookings((prevBookings) => {
      const hasConnectedBookings = prevBookings.some((b) => b.tripId === tripId);
      if (!hasConnectedBookings) {
        return prevBookings;
      }

      return prevBookings.map((booking) => {
        if (booking.tripId === tripId) {
          return { ...booking, trip: updatedTrip };
        }
        return booking;
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      numPersons: parseInt(formData.numPersons),
      message: formData.message || undefined,
      tripId: formData.tripId,
      status: formData.status,
      amountPaid: parseFloat(formData.amountPaid),
    };

    try {
      if (editingBooking) {
        await fetch(`/api/admin/bookings/${editingBooking.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: formData.status }),
        });
      } else {
        await fetch("/api/admin/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      await fetchBookings();
      closeModal();
    } catch (error) {
      console.error("Failed to save booking:", error);
      alert("Failed to save booking. Please check the console for details.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  const openModal = (booking?: IBooking) => {
    if (booking) {
      setEditingBooking(booking);
      setFormData({
        fullName: booking.fullName,
        email: booking.email,
        phone: booking.phone,
        numPersons: booking.numPersons.toString(),
        message: booking.message || "",
        tripId: booking.tripId,
        status: booking.status,
        amountPaid: booking.amountPaid.toString(),
      });
    } else {
      setEditingBooking(null);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        numPersons: "1",
        message: "",
        tripId: "",
        status: "PENDING",
        amountPaid: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBooking(null);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CONFIRMED: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
    };
    const icons = {
      PENDING: <Clock className="w-3 h-3" />,
      CONFIRMED: <CheckCircle className="w-3 h-3" />,
      CANCELLED: <XCircle className="w-3 h-3" />,
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}
      >
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  };

  

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.trip?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
    revenue: bookings
      .filter((b) => b.status === "CONFIRMED")
      .reduce((sum, b) => sum + b.amountPaid, 0),
  };

  return {
    bookings,
    setBookings,
    trips,
    loading,
    searchTerm,
    statusFilter,
    showModal,
    editingBooking,
    formData,
    openModal,
    closeModal,
    getStatusBadge,
    filteredBookings,
    stats,
    setSearchTerm,
    setStatusFilter,
    handleSubmit,
    handleDelete,
    setFormData,
    fetchBookings,
    updateBookingsForTrip,
  };
};
