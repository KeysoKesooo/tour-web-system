// src/lib/api.ts - Client-side API wrapper
import { ApiClient, ApiError } from "./apiClient";

// Initialize API client (use environment variable or default)
const api = new ApiClient(
  typeof window !== "undefined" 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
);

// ==================== AUTH METHODS ====================

export async function register(
  name: string,
  email: string,
  password: string
) {
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
  role: "admin" | "staff" | "user";
}) {
  const response = await api.post("/api/users", userData);
  return response.data;
}

export async function updateUser(id: string, userData: Partial<{
  name: string;
  email: string;
  role: "admin" | "staff" | "user";
}>) {
  const response = await api.put(`/api/users/${id}`, userData);
  return response.data;
}

export async function deleteUser(id: string) {
  await api.delete(`/api/users/${id}`);
  return true;
}

// Export the API client instance for custom requests
export { api };