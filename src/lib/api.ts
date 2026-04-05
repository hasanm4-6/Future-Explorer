import {
  ApiResponse,
  Booking,
  DashboardStats,
  DbChildProfile,
  LessonWithScenes,
  LessonWithStatus,
  PaginatedResponse,
  PriceCalculation,
  PricingConfig,
  Slot,
} from "@/types";

export interface ApiClientError extends Error {
  status?: number;
  errors?: Array<{ field: string; message: string }>;
}

const API_BASE = "/api";

class ApiClient {
  private buildError(payload: unknown, status: number): ApiClientError {
    const normalized =
      typeof payload === "object" && payload !== null
        ? (payload as { message?: unknown; errors?: unknown })
        : {};

    const error = new Error(
      typeof normalized.message === "string"
        ? normalized.message
        : `HTTP ${status}`,
    ) as ApiClientError;

    error.status = status;
    error.errors = Array.isArray(normalized.errors)
      ? normalized.errors.filter(
          (entry): entry is { field: string; message: string } =>
            typeof entry?.field === "string" &&
            typeof entry?.message === "string",
        )
      : undefined;

    return error;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Network error" }));
      throw this.buildError(error, res.status);
    }

    if (res.headers.get("content-type")?.includes("text/csv")) {
      return (await res.text()) as unknown as T;
    }

    return res.json();
  }

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

  async signup(formData: FormData) {
    return fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      body: formData,
      credentials: "include",
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw this.buildError(data, res.status);
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
    ApiResponse<{ token: string; parent: { name: string; email: string } }>
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

  async updateProfile(data: {
    name: string;
    email: string;
    currentPassword?: string;
  }) {
    return this.request("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async updatePassword(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request("/auth/password", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(data: {
    currentPassword: string;
    confirmation: "DELETE";
  }) {
    return this.request("/auth/account", {
      method: "DELETE",
      body: JSON.stringify(data),
    });
  }

  async getChildren(): Promise<ApiResponse<DbChildProfile[]>> {
    return this.request("/children");
  }

  async createChild(data: unknown) {
    return this.request("/children", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getLessons(
    childId: string,
    level = 1,
  ): Promise<ApiResponse<{ lessons: LessonWithStatus[] }>> {
    return this.request(`/lessons?childId=${childId}&level=${level}`);
  }

  async getLessonById(
    lessonId: number,
    childId: string,
  ): Promise<ApiResponse<{ lesson: LessonWithScenes }>> {
    return this.request(`/lessons/${lessonId}?childId=${childId}`);
  }

  async saveLessonProgress(
    childId: string,
    lessonId: number,
    data: {
      current_scene_index?: number;
      completed_scenes?: number[];
      quiz_score?: number;
      attempts?: number;
    },
  ): Promise<ApiResponse<null>> {
    return this.request(`/children/${childId}/lessons/${lessonId}/progress`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async completeLesson(
    childId: string,
    lessonId: number,
    quizScore: number,
  ): Promise<
    ApiResponse<{ badge_name: string | null; next_lesson_id: number | null }>
  > {
    return this.request(`/children/${childId}/lessons/${lessonId}/complete`, {
      method: "POST",
      body: JSON.stringify({ quiz_score: quizScore }),
    });
  }

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
