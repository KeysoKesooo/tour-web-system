// src/lib/api.ts - Client-side API wrapper
import { ApiClient, ApiError } from "./apiClient";
import { BookingStatus } from "@/types/BookingStatus";

// Initialize API client (use environment variable or default)
const api = new ApiClient(
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
);

// ==================== AUTH METHODS ====================

export async function register(name: string, email: string, password: string) {
  try {
    const response = await api.post("/api/auth/register", {
      name,
      email,
      password,
      // ✅ NO role field - always creates as "user"
    });
    return response.data.user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.data?.error || error.message);
    }
    throw error;
  }
}

export async function login(email: string, password: string) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });
    return response.data.user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.data?.error || error.message);
    }
    throw error;
  }
}

export async function logout() {
  try {
    await api.post("/api/auth/logout", {});
    return true;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.data?.error || error.message);
    }
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get("/api/auth/me");
    return response.data.user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null; // Not authenticated
    }
    throw error;
  }
}

// ==================== USER METHODS ====================

export async function getAllUsers() {
  const response = await api.get("/api/users");
  return response.data;
}

export async function getUserById(id: string) {
  const response = await api.get(`/api/users/${id}`);
  return response.data;
}

// ✅ ADMIN ONLY: Create user with specific role
export async function adminCreateUser(userData: {
  name: string;
  email: string;
  password: string;
  role: "admin" | "staff";
}) {
  const response = await api.post("/api/users", userData);
  return response.data;
}

export async function updateUser(
  id: string,
  userData: Partial<{
    name: string;
    email: string;
    role: "admin" | "staff";
  }>
) {
  const response = await api.put(`/api/users/${id}`, userData);
  return response.data;
}

export async function deleteUser(id: string) {
  await api.delete(`/api/users/${id}`);
  return true;
}

// =========================
//  PUBLIC BOOKING METHODS
// =========================

// Public user creates booking (no admin role)
export async function publicCreateBooking(data: {
  tripId: string;
  numPersons: number;
  name: string;
  email: string;
  phone: string;
}) {
  const response = await api.post("/api/bookings/public", data);
  return response.data;
}

// Get remaining seats for a trip (public)
export async function getRemainingSeats(tripId: string) {
  const response = await api.get(`/api/bookings/remaining/${tripId}`);
  return response.data.remainingSeats;
}

// =========================
//  ADMIN BOOKING METHODS
// =========================

// Admin: get all bookings
export async function getAllBookings() {
  const response = await api.get("/api/admin/bookings");
  return response.data;
}

// Admin: get one booking by id
export async function getBookingById(id: string) {
  const response = await api.get(`/api/admin/bookings/${id}`);
  return response.data;
}

// Admin: create booking internally
export async function createBooking(data: {
  tripId: string;
  numPersons: number;
  name: string;
  email: string;
  phone: string;
  status: BookingStatus;
  amountPaid: number;
}) {
  const response = await api.post("/api/admin/bookings", data);
  return response.data;
}

// Admin: update booking (status only)
export async function updateBookingStatus(id: string, status: BookingStatus) {
  const response = await api.patch(`/api/admin/bookings/${id}`, {
    status,
  });
  return response.data;
}

// Admin: delete booking
export async function deleteBooking(id: string) {
  const response = await api.delete(`/api/admin/bookings/${id}`);
  return response.data;
}

// Admin: mark booking as read
export async function markBookingAsRead(id: string) {
  const response = await api.patch(`/api/admin/bookings/${id}/read`, {});
  return response.data;
}

// =========================
//  PUBLIC TRIP METHODS
// =========================

// Get all trips (with total booked seats)
export async function getAllTrips() {
  const response = await api.get("/api/trips");
  return response.data;
}

// Get trips filtered by destination
export async function getTripsByDestination(destination: string) {
  const response = await api.get(
    `/api/trips/destination/${encodeURIComponent(destination)}`
  );
  return response.data;
}

// Get a single trip by ID
export async function getTripById(id: string) {
  const response = await api.get(`/api/trips/${id}`);
  return response.data;
}

// Get analytics for a specific trip
export async function getTripAnalytics(tripId: string) {
  const response = await api.get(`/api/trips/${tripId}/analytics`);
  return response.data;
}

// =========================
//  ADMIN TRIP METHODS
// =========================

// Admin: create a new trip
export async function createTrip(data: {
  location: string;
  startDate: string;
  endDate: string;
  capacity: number;
  price: number;
}) {
  const response = await api.post("/api/admin/trips", data);
  return response.data;
}

// Admin: update an existing trip
export async function updateTrip(
  id: string,
  data: Partial<{
    location: string;
    startDate: string;
    endDate: string;
    capacity: number;
    price: number;
  }>
) {
  const response = await api.put(`/api/admin/trips/${id}`, data);
  return response.data;
}

// Admin: delete a trip
export async function deleteTrip(id: string) {
  const response = await api.delete(`/api/admin/trips/${id}`);
  return response.data;
}

// Export the API client instance for custom requests
export { api };
