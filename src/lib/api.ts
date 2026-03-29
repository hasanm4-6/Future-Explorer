import {
  ApiResponse,
  Booking,
  DashboardStats,
  PaginatedResponse,
  PriceCalculation,
  PricingConfig,
  Slot,
} from "@/types";

let API_BASE = "";
if (import.meta.env.VITE_PUBLIC_ENVIRONMENT === "production") {
  API_BASE =
    import.meta.env.VITE_PUBLIC_API_URL ||
    "https://future-explorer-backend-skat.vercel.app/api";
} else {
  API_BASE = import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:5000/api";
}
class ApiClient {
  // private getToken(): string | null {
  //   if (typeof window === "undefined") return null;
  //   return localStorage.getItem("futureexplorer_token");
  // }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    // const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
      // credentials: "include",
    };

    // if (token) {
    //   headers["Authorization"] = `Bearer ${token}`;
    // }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    if (res.headers.get("content-type")?.includes("text/csv")) {
      return (await res.text()) as unknown as T;
    }

    return res.json();
  }

  // Public booking endpoints
  async createBooking(
    data: Record<string, unknown>,
  ): Promise<ApiResponse<Booking>> {
    return this.request("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getPricePerHour(): Promise<ApiResponse<number>> {
    return this.request("/bookings/pricePerHour");
  }

  async trackBooking(trackingNumber: string): Promise<ApiResponse<Booking>> {
    return this.request(`/bookings/${trackingNumber}`);
  }

  async calculatePrice(
    startTime: string,
    endTime: string,
  ): Promise<ApiResponse<PriceCalculation>> {
    return this.request(
      `/bookings/price?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`,
    );
  }

  // Auth
  // async signup(data: any) {
  //   return this.request("/auth/signup", {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //   });
  // }

  async signup(formData: FormData) {
    return fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      body: formData,
      credentials: "include",
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    });
  }

  async uploadAvatar(formData: FormData) {
    return fetch(`${API_BASE}/upload/avatar`, {
      method: "POST",
      body: formData,
    });
  }

  async login(
    email: string,
    password: string,
  ): Promise<
    ApiResponse<{ token: string; admin: { name: string; email: string } }>
  > {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async profile() {
    return this.request("/auth/me");
  }

  async getChildren(): Promise<ApiResponse<{ children: any[] }>> {
    return this.request("/children");
  }

  async createChild(data: any) {
    return this.request("/children", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Admin endpoints
  async getDashboard(): Promise<ApiResponse<DashboardStats>> {
    return this.request("/admin/dashboard");
  }

  async getBookings(params: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set("status", params.status);
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.search) searchParams.set("search", params.search);
    return this.request(`/admin/bookings?${searchParams.toString()}`);
  }

  async updateBookingStatus(
    id: string,
    status: string,
    actualExitTime?: string,
  ): Promise<ApiResponse<Booking>> {
    return this.request(`/admin/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, actualExitTime }),
    });
  }

  async exportBookings(status?: string): Promise<string> {
    const searchParams = status ? `?status=${status}` : "";
    return this.request(`/admin/bookings/export${searchParams}`);
  }

  async getSlots(status?: string): Promise<
    ApiResponse<{
      slots: Slot[];
      stats: { total: number; available: number; occupied: number };
    }>
  > {
    const searchParams = status ? `?status=${status}` : "";
    return this.request(`/admin/slots${searchParams}`);
  }

  async updateSlot(
    id: string,
    status: "available" | "occupied",
  ): Promise<ApiResponse<Slot>> {
    return this.request(`/admin/slots/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async getPricing(): Promise<ApiResponse<PricingConfig>> {
    return this.request("/admin/pricing");
  }

  async updatePricing(data: {
    pricePerHour: number;
    discountRules: { minDays: number; percentage: number }[];
  }): Promise<ApiResponse<PricingConfig>> {
    return this.request("/admin/pricing", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
