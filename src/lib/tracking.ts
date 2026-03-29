/**
 * Frontend event tracking placeholders.
 * Replace with your analytics provider (e.g., Mixpanel, Amplitude, PostHog).
 */

type TrackingEvent =
  | "view_home"
  | "login_success"
  | "signup_step1_complete"
  | "signup_step2_complete"
  | "signup_complete"
  | "click_start_free"
  | "onboarding_started"
  | "onboarding_completed"
  | "lesson_started"
  | "lesson_completed"
  | "quiz_completed"
  | "subscription_started"
  | "preview_mission_clicked"
  | "view_mode_switched";

export const trackEvent = (
  event: TrackingEvent,
  properties?: Record<string, unknown>,
) => {
  // Placeholder: replace with real analytics SDK
  if (import.meta.env.DEV) {
    console.log(`[Track] ${event}`, properties);
  }
};
