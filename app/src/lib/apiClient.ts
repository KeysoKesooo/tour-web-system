// src/lib/apiClient.ts

export class ApiClient {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private get headers() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.token) headers["Authorization"] = `Bearer ${this.token}`;
    return headers;
  }

  private async request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: "Unknown error" }));
      // Pass the error status and data to our custom error class
      throw new ApiError(
        errorData.error || `HTTP ${res.status}`,
        res.status,
        errorData,
      );
    }

    return res.json();
  }

  async get(path: string) {
    return this.request(path, { method: "GET" });
  }

  async post(path: string, body: object) {
    return this.request(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put(path: string, body: object) {
    return this.request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async patch(path: string, body: object) {
    return this.request(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async delete(path: string) {
    return this.request(path, { method: "DELETE" });
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = undefined;
  }
}

// FIX: Changed 'any' to 'unknown' to satisfy ESLint
export class ApiError extends Error {
  public status: number;
  public data?: unknown; // Use 'unknown' instead of 'any'

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;

    // Standard fix for maintaining stack traces in custom errors
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}
