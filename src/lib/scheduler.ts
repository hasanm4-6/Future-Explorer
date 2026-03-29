/**
 * Scheduler for weekly summary emails
 * In production, this would be replaced by a proper cron job or serverless function
 */

import { automationService } from "./api";

export class EmailScheduler {
  private intervalId: NodeJS.Timeout | null = null;

  start() {
    // Stop any existing scheduler
    this.stop();

    // Run weekly summary check every hour (in production, use proper cron scheduling)
    this.intervalId = setInterval(
      async () => {
        try {
          await automationService.sendWeeklySummaries();
          console.log("[Scheduler] Weekly summary check completed");
        } catch (error) {
          console.error("[Scheduler] Weekly summary check failed:", error);
        }
      },
      60 * 60 * 1000,
    ); // Every hour

    console.log("[Scheduler] Email scheduler started");
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("[Scheduler] Email scheduler stopped");
    }
  }

  // Manual trigger for testing
  async triggerWeeklySummaries() {
    try {
      await automationService.sendWeeklySummaries();
      console.log("[Scheduler] Weekly summaries triggered manually");
    } catch (error) {
      console.error("[Scheduler] Manual weekly summary trigger failed:", error);
    }
  }
}

// Global scheduler instance
export const emailScheduler = new EmailScheduler();

// Auto-start scheduler in development
if (import.meta.env.DEV) {
  emailScheduler.start();
}
