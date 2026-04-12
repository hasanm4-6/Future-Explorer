import React from "react";
import Navbar from "@/components/layout/Navbar";

/** Reusable pulse block */
export const SkeletonPulse = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-muted ${className}`} />
);

/** Skeleton for a single stat card */
export const StatCardSkeleton = () => (
  <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card">
    <SkeletonPulse className="h-12 w-12 rounded-full" />
    <div className="space-y-2 flex-1">
      <SkeletonPulse className="h-6 w-16" />
      <SkeletonPulse className="h-3 w-24" />
    </div>
  </div>
);

/** Skeleton for a mission/quiz card */
export const CardSkeleton = () => (
  <div className="rounded-2xl bg-card p-6 shadow-card space-y-4">
    <div className="flex items-center gap-3">
      <SkeletonPulse className="h-12 w-12 rounded-xl" />
      <div className="space-y-2 flex-1">
        <SkeletonPulse className="h-5 w-32" />
        <SkeletonPulse className="h-3 w-20" />
      </div>
    </div>
    <SkeletonPulse className="h-4 w-full" />
    <SkeletonPulse className="h-3 w-3/4" />
  </div>
);

/** Full dashboard skeleton — shown during initial page load */
export const DashboardSkeleton = React.memo(() => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8 space-y-6">
      <SkeletonPulse className="h-12 w-64" />
      <div className="flex gap-3">
        {[1, 2].map((i) => (
          <SkeletonPulse key={i} className="h-20 w-40 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  </div>
));

DashboardSkeleton.displayName = "DashboardSkeleton";

/** Lessons-only skeleton — shown when children loaded but lessons still fetching */
export const LessonsSkeleton = React.memo(() => (
  <div className="space-y-6">
    <div className="rounded-2xl bg-card p-6 shadow-card">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <SkeletonPulse className="h-[72px] w-[72px] rounded-full shrink-0 mx-auto sm:mx-0" />
        <div className="space-y-3 flex-1">
          <SkeletonPulse className="h-7 w-40" />
          <SkeletonPulse className="h-4 w-56" />
          <SkeletonPulse className="h-2.5 w-full max-w-xs" />
        </div>
      </div>
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <CardSkeleton />
      <CardSkeleton />
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  </div>
));

LessonsSkeleton.displayName = "LessonsSkeleton";
