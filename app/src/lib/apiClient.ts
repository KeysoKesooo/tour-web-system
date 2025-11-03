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

  // Enhanced fetch with credentials for cookie support
  private async request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
      credentials: "include", // ✅ Include cookies in requests
    });

    // Handle non-OK responses
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new ApiError(error.error || `HTTP ${res.status}`, res.status, error);
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

  // ✅ Update token dynamically (useful for Bearer token scenarios)
  setToken(token: string) {
    this.token = token;
  }

  // ✅ Clear token
  clearToken() {
    this.token = undefined;
  }
}

// Custom error class for better error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}