/**
 * Centralized query key factory.
 * Ensures consistent keys across components for caching, invalidation, and prefetching.
 */
export const queryKeys = {
  auth: {
    profile: ["auth", "profile"] as const,
  },
  children: {
    all: ["children"] as const,
  },
  lessons: {
    byChild: (childId: string) => ["lessons", childId] as const,
  },
  lesson: {
    detail: (lessonId: number, childId: string) =>
      ["lesson", lessonId, childId] as const,
  },
} as const;
