/**
 * Email automation system for lifecycle events
 * Handles timing and conditions for sending automated emails
 */

// import { emailService } from "./email";

export interface User {
  id: string;
  email: string;
  parentName: string;
  childProfiles: ChildProfile[];
  createdAt: Date;
  lastActivity?: Date;
}

export interface ChildProfile {
  id?: string;
  name: string;
  ageGroup: string;
  learningLevel?: string;
  progress?: string;
  lessonsCompleted?: number;
  achievements?: string[];
  weeklyMinutes?: number;
  currentMission?: string;
  lastLessonDate?: Date;
}

export interface AutomationState {
  welcomeSent: boolean;
  profileReminderSent: boolean;
  firstMissionReminderSent: boolean;
  lastWeeklySummarySent?: Date;
}

export interface Booking {
  _id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  carMake: string;
  carModel: string;
  carNumber: string;
  carColor: string;
  slotId: string;
  slotNumber: number;
  trackingNumber: string;
  bookedStartTime: string;
  bookedEndTime: string;
  actualExitTime?: string;
  departureTerminal?: string;
  departureFlightNo?: string;
  arrivalTerminal?: string;
  arrivalFlightNo?: string;
  status: "upcoming" | "active" | "completed" | "cancelled";
  price: number;
  overtimeHours: number;
  overtimePrice: number;
  totalPrice: number;
  pricePerHour: number;
  discountPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Slot {
  _id: string;
  slotNumber: number;
  status: "available" | "occupied";
  currentBookingId?: Booking | null;
  createdAt: string;
  updatedAt: string;
}

export interface PricingConfig {
  _id: string;
  pricePerHour: number;
  discountRules: { minDays: number; percentage: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface PriceCalculation {
  totalHours: number;
  totalDays: number;
  pricePerHour: number;
  basePrice: number;
  discountPercent: number;
  discountAmount: number;
  finalPrice: number;
}

export interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  todayBookings: number;
  slots: {
    total: number;
    available: number;
    occupied: number;
  };
}

// ── Child profile (as returned by the database / backend) ────────────────────
export interface DbChildProfile {
  id: string;
  parent_id: string;
  name: string;
  age_band: "6-7" | "8-10" | "11-13";
  age: number;
  avatar: string;
  learning_level: "beginner" | "intermediate" | "advanced" | null;
  progress: {
    lessons_completed: number;
    current_lesson: number | null;
    badges: string[];
    total_xp: number;
    streak_days: number;
    topics_covered?: string[];
  } | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Lesson types ─────────────────────────────────────────────────────────────

export type LessonStatus = "locked" | "unlocked" | "completed";

export interface LessonScene {
  id: string;
  lesson_id: number;
  order_index: number;
  type: "content" | "quiz";
  title: string;
  content: string;
  icon: string;
  quiz_question?: string | null;
  quiz_options?: Array<{ text: string; is_correct: boolean; hint: string }> | null;
}

export interface LessonWithStatus {
  id: number;
  title: string;
  description: string;
  icon: string;
  order_index: number;
  badge_name: string | null;
  xp_reward: number;
  level: number;
  video_url: string | null;
  status: LessonStatus;
  current_scene_index: number;
  completed_scenes: number[];
  quiz_score: number | null;
  completed_at: string | null;
}

export interface LessonWithScenes extends LessonWithStatus {
  scenes: LessonScene[];
}

// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: { field: string; message: string }[];
}

export interface PaginatedResponse<T> {
  bookings: T[];
  total: number;
  page: number;
  totalPages: number;
}
