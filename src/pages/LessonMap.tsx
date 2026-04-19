import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Lock,
  CheckCircle,
  Star,
  ArrowRight,
  Trophy,
  Compass,
  AlertCircle,
  UserPlus,
  Zap,
  Flame,
  PartyPopper,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { DbChildProfile, LessonWithStatus } from "@/types";

// ── Status visual config ──────────────────────────────────────────────────────
const statusConfig: Record<
  LessonWithStatus["status"],
  { nodeClass: string; icon: React.ReactNode }
> = {
  completed: {
    nodeClass: "lesson-node lesson-node-completed",
    icon: <CheckCircle className="h-6 w-6 text-primary-foreground" />,
  },
  unlocked: {
    nodeClass: "lesson-node lesson-node-unlocked animate-float",
    icon: <Star className="h-6 w-6 text-primary-foreground" />,
  },
  locked: {
    nodeClass: "lesson-node lesson-node-locked",
    icon: <Lock className="h-5 w-5 text-muted-foreground" />,
  },
};

// ── Skeleton loader ────────────────────────────────────────────────────────────
const SkeletonPulse = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-muted ${className}`} />
);

const LessonMapSkeleton = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row">
        <SkeletonPulse className="h-14 w-14 shrink-0 rounded-full" />
        <div className="flex-1 w-full space-y-2">
          <SkeletonPulse className="h-7 w-48 rounded-lg" />
          <SkeletonPulse className="h-4 w-32 rounded-lg" />
          <SkeletonPulse className="h-3 w-full max-w-xs rounded-full" />
        </div>
        <SkeletonPulse className="h-10 w-32 rounded-full" />
      </div>

      {/* Map skeleton */}
      <div className="relative mx-auto max-w-md">
        {/* Path line */}
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-muted animate-pulse" />
        <div className="relative space-y-8">
          {Array.from({ length: 6 }).map((_, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={i}
                className={`relative flex items-center gap-4 ${
                  isEven ? "flex-row" : "flex-row-reverse"
                }`}
                style={{ opacity: 1 - i * 0.08 }}
              >
                <div className={`flex-1 ${isEven ? "text-right" : "text-left"}`}>
                  <div className="inline-block w-full rounded-2xl bg-card p-4 shadow-card space-y-2">
                    <SkeletonPulse className="h-3 w-16" />
                    <SkeletonPulse className="h-5 w-32" />
                    <SkeletonPulse className="h-9 w-full rounded-xl" />
                  </div>
                </div>
                <SkeletonPulse className="z-10 h-14 w-14 shrink-0 rounded-full" />
                <div className="flex-1" />
              </div>
            );
          })}
        </div>
        {/* Final goal skeleton */}
        <div className="mt-8 flex justify-center">
          <SkeletonPulse className="h-20 w-20 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

// ── Scene dots — shows how far through a lesson's scenes the child is ─────────
const SceneDots = ({
  total,
  completed,
}: {
  total: number;
  completed: number;
}) => (
  <div className="mt-2 flex items-center gap-1">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`h-1.5 flex-1 rounded-full transition-colors ${
          i < completed ? "bg-explorer-coral" : "bg-muted"
        }`}
      />
    ))}
  </div>
);

// ── LessonMap ─────────────────────────────────────────────────────────────────
const LessonMap = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // ── Step 1: fetch parent's children ───────────────────────────────────────
  const {
    data: childrenRes,
    isLoading: childrenLoading,
    isError: childrenError,
  } = useQuery({
    queryKey: queryKeys.children.all,
    queryFn: () => api.getChildren(),
    staleTime: 5 * 60 * 1000,
  });

  const children: DbChildProfile[] = childrenRes?.data ?? [];

  // ── Step 2: resolve active child ──────────────────────────────────────────
  const childIdFromUrl = searchParams.get("childId");
  const activeChild: DbChildProfile | undefined =
    children.find((c) => c.id === childIdFromUrl) ?? children[0];

  // ── Step 3: redirect if parent has no children ────────────────────────────
  useEffect(() => {
    if (!childrenLoading && !childrenError && children.length === 0) {
      navigate("/create-child", { replace: true });
    }
  }, [childrenLoading, childrenError, children.length, navigate]);

  // ── Step 4: keep URL in sync with resolved active child ───────────────────
  useEffect(() => {
    if (activeChild && activeChild.id !== childIdFromUrl) {
      setSearchParams({ childId: activeChild.id }, { replace: true });
    }
  }, [activeChild, childIdFromUrl, setSearchParams]);

  // ── Step 5: fetch lessons for the active child ────────────────────────────
  const {
    data: lessonsRes,
    isLoading: lessonsLoading,
    isError: lessonsError,
    error: lessonsErr,
  } = useQuery({
    queryKey: queryKeys.lessons.byChild(activeChild?.id ?? ""),
    queryFn: () => api.getLessons(activeChild!.id, 1),
    enabled: !!activeChild,
    staleTime: 30 * 1000,
  });

  const lessons: LessonWithStatus[] = lessonsRes?.data?.lessons ?? [];

  // ── Prefetch: warm cache for the unlocked lesson's detail page ───────────
  const unlockedLesson = lessons.find((l) => l.status === "unlocked");
  const unlockedLessonId = unlockedLesson?.id;
  const activeChildId = activeChild?.id;
  useEffect(() => {
    if (unlockedLessonId != null && activeChildId) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.lesson.detail(unlockedLessonId, activeChildId),
        queryFn: () => api.getLessonById(unlockedLessonId, activeChildId),
        staleTime: 60 * 1000,
      });
    }
  }, [unlockedLessonId, activeChildId, queryClient]);
  const completedCount = lessons.filter((l) => l.status === "completed").length;
  const totalLessons = lessons.length;
  const progressPct =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const allDone = totalLessons > 0 && completedCount === totalLessons;

  // Derive stats from child profile progress field
  const childProgress = activeChild?.progress;
  const totalXp = childProgress?.total_xp ?? 0;
  const streakDays = childProgress?.streak_days ?? 0;

  // Achievement badge milestones for display
  const earnedBadges: string[] = childProgress?.badges ?? [];
  const achievementBadges = ["Explorer Start", "AI Beginner", "AI Explorer", "Smart Thinker"];
  const earnedAchievements = achievementBadges.filter((b) => earnedBadges.includes(b));

  // Find the index of the first unlocked (active) lesson for ring highlight
  const activeIndex = lessons.findIndex((l) => l.status === "unlocked");

  // ── Loading ────────────────────────────────────────────────────────────────
  if (childrenLoading || (!!activeChild && lessonsLoading)) {
    return <LessonMapSkeleton />;
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (childrenError || lessonsError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-destructive" />
          <h2 className="font-display text-xl font-bold">Something went wrong</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {(lessonsErr as Error | null)?.message ?? "Please try again later."}
          </p>
          <Button
            variant="explorer-outline"
            className="mt-6"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  // ── No active child ────────────────────────────────────────────────────────
  if (!activeChild) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <UserPlus className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h2 className="font-display text-xl font-bold">No child profile yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a profile to start exploring!
          </p>
          <Link to="/create-child">
            <Button variant="explorer" className="mt-6">
              Create Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Lesson map ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">

        {/* ── Level-complete celebration banner ─────────────────────────── */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              className="mb-6 rounded-2xl bg-gradient-gold p-5 text-center shadow-playful"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", damping: 14 }}
            >
              <div className="flex items-center justify-center gap-3">
                <PartyPopper className="h-6 w-6 text-accent-foreground" />
                <p className="font-display text-lg font-bold text-accent-foreground">
                  🎉 Level 1 Complete! You're an AI Explorer!
                </p>
                <PartyPopper className="h-6 w-6 text-accent-foreground" />
              </div>
              <p className="mt-1 text-sm text-accent-foreground/80">
                All missions conquered. Level 2 coming soon!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <motion.div
          className="mb-6 rounded-2xl bg-card p-5 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:text-left">
            {/* Avatar with completion ring */}
            <div className="relative shrink-0">
              <svg
                className="absolute inset-0 -rotate-90"
                width="64"
                height="64"
                viewBox="0 0 64 64"
              >
                <circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  stroke="hsl(var(--explorer-coral))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 28 * (1 - progressPct / 100),
                  }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                />
              </svg>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl">
                {activeChild.avatar}
              </div>
            </div>

            {/* Name + progress text */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="font-display text-2xl font-bold leading-tight">
                {activeChild.name}&apos;s Explorer Map
              </h1>
              <p className="text-sm text-muted-foreground">
                Level 1 &middot;{" "}
                <span className="font-bold text-foreground">{completedCount}</span>
                /{totalLessons} missions &middot;{" "}
                <span className="font-bold text-explorer-coral">{progressPct}%</span>
              </p>
              {/* Progress bar */}
              <div className="mt-2.5 h-2.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-gradient-coral"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Stats pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:flex-col sm:items-end">
              <div className="flex items-center gap-1.5 rounded-full bg-accent/30 px-3 py-1.5">
                <Trophy className="h-4 w-4 text-explorer-gold" />
                <span className="font-display text-sm font-bold">
                  {completedCount} Badges
                </span>
              </div>
              {totalXp > 0 && (
                <div className="flex items-center gap-1.5 rounded-full bg-explorer-blue/10 px-3 py-1.5">
                  <Zap className="h-4 w-4 text-explorer-blue" />
                  <span className="font-display text-sm font-bold text-explorer-blue">
                    {totalXp} XP
                  </span>
                </div>
              )}
              {streakDays > 0 && (
                <div className="flex items-center gap-1.5 rounded-full bg-explorer-coral/10 px-3 py-1.5">
                  <Flame className="h-4 w-4 text-explorer-coral" />
                  <span className="font-display text-sm font-bold text-explorer-coral">
                    {streakDays} day streak
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Achievement badges row */}
          {earnedAchievements.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border/40 pt-4">
              {earnedAchievements.map((badge) => {
                const badgeEmoji: Record<string, string> = {
                  "Explorer Start": "🚀",
                  "AI Beginner": "🤖",
                  "AI Explorer": "🏆",
                  "Smart Thinker": "🧠",
                };
                return (
                  <div
                    key={badge}
                    className="flex items-center gap-1.5 rounded-full bg-gradient-gold px-3 py-1"
                  >
                    <span className="text-sm">{badgeEmoji[badge]}</span>
                    <span className="font-display text-xs font-bold text-accent-foreground">
                      {badge}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* ── Multi-child switcher ───────────────────────────────────────────── */}
        {children.length > 1 && (
          <motion.div
            className="mb-6 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {children.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => setSearchParams({ childId: child.id })}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  child.id === activeChild.id
                    ? "bg-gradient-coral text-white shadow-playful scale-105"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <span>{child.avatar}</span>
                {child.name}
              </button>
            ))}
          </motion.div>
        )}

        {/* ── Lesson map ─────────────────────────────────────────────────────── */}
        {(() => {
          // ── Layout constants ──────────────────────────────────────────────
          // SVG viewBox width (logical units). Node x positions are 25% / 75%.
          const SVG_W = 400;
          const NODE_LEFT_X = 100;   // 25% of SVG_W
          const NODE_RIGHT_X = 300;  // 75% of SVG_W
          const ROW_H = 190;         // px per lesson row
          const TOTAL_H = lessons.length * ROW_H;
          const TOTAL_SCENES = 4;

          // Node x centre for row i (alternates left / right)
          const nodeX = (i: number) => (i % 2 === 0 ? NODE_LEFT_X : NODE_RIGHT_X);
          const nodeY = (i: number) => i * ROW_H + ROW_H / 2;

          return (
            <div className="relative mx-auto max-w-md">

              {/* ── SVG animated dotted paths ─────────────────────────────── */}
              <svg
                viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
                width="100%"
                height={TOTAL_H}
                preserveAspectRatio="none"
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
              >
                {lessons.slice(0, -1).map((lesson, i) => {
                  const x1 = nodeX(i);
                  const y1 = nodeY(i);
                  const x2 = nodeX(i + 1);
                  const y2 = nodeY(i + 1);
                  const midY = (y1 + y2) / 2;
                  const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

                  // Completed paths get coral colour; locked/active get muted
                  const isPathDone = lesson.status === "completed";
                  const strokeColor = isPathDone
                    ? "hsl(4 85% 62%)"   // explorer-coral
                    : "hsl(40 22% 82%)"; // muted border

                  return (
                    <g key={`path-${lesson.id}`}>
                      {/* Static base path (slightly wider, low-opacity) */}
                      <path
                        d={d}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="10"
                        strokeDasharray="0"
                        strokeLinecap="round"
                        opacity="0.18"
                      />
                      {/* Animated marching-ants dotted path */}
                      <path
                        d={d}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="7"
                        strokeDasharray="14 14"
                        strokeLinecap="round"
                        className={isPathDone ? "animate-dash-path" : "animate-dash-path-slow"}
                        opacity={isPathDone ? 0.85 : 0.45}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* ── Lesson rows ───────────────────────────────────────────── */}
              <div className="relative">
                {lessons.map((lesson, i) => {
                  const config = statusConfig[lesson.status];
                  const isEven = i % 2 === 0;   // even → node on left
                  const isActive = i === activeIndex;
                  const scenesCompleted = lesson.completed_scenes.length;

                  return (
                    <motion.div
                      key={lesson.id}
                      className="relative"
                      style={{ height: ROW_H }}
                      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                    >
                      {/* ── Node circle (absolutely placed at 25% or 75%) ── */}
                      <div
                        className={[
                          config.nodeClass,
                          "absolute top-1/2 z-10 h-14 w-14 -translate-x-1/2 -translate-y-1/2",
                          isEven ? "left-1/4" : "left-3/4",
                        ].join(" ")}
                      >
                        {config.icon}
                      </div>

                      {/* ── Card (on the opposite side from the node) ──────── */}
                      <div
                        className={[
                          "absolute inset-y-3 flex items-stretch",
                          isEven ? "left-[38%] right-2" : "left-2 right-[38%]",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "w-full rounded-2xl bg-card p-4 shadow-card transition-all duration-200 flex flex-col justify-center",
                            lesson.status !== "locked"
                              ? "hover:shadow-card-hover hover:-translate-y-0.5"
                              : "opacity-60",
                            isActive
                              ? "ring-2 ring-explorer-coral ring-offset-2 ring-offset-background"
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {/* Mission label + XP */}
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <p className="text-xs text-muted-foreground">
                              Mission {lesson.order_index}
                            </p>
                            {lesson.status !== "completed" && (
                              <span className="text-xs font-bold text-explorer-gold">
                                +{lesson.xp_reward ?? 10} XP
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="font-display font-bold leading-snug text-sm">
                            {lesson.title}
                          </h3>

                          {/* Badge chip (completed) */}
                          {lesson.badge_name && lesson.status === "completed" && (
                            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/40 px-2 py-0.5 text-xs font-bold text-accent-foreground">
                              <Star className="h-3 w-3" /> {lesson.badge_name}
                            </div>
                          )}

                          {/* Scene micro-progress */}
                          {lesson.status === "unlocked" && scenesCompleted > 0 && (
                            <div className="mt-1.5">
                              <SceneDots total={TOTAL_SCENES} completed={scenesCompleted} />
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {scenesCompleted}/{TOTAL_SCENES} scenes
                              </p>
                            </div>
                          )}

                          {/* CTA */}
                          <div className="mt-2">
                            {lesson.status === "unlocked" ? (
                              <Link to={`/lesson/${lesson.id}?childId=${activeChild.id}`}>
                                <Button variant="explorer" size="sm" className="w-full min-h-[40px] text-xs">
                                  {scenesCompleted > 0 ? "Continue" : "Start"}
                                  <ArrowRight className="h-3 w-3" />
                                </Button>
                              </Link>
                            ) : lesson.status === "completed" ? (
                              <Link to={`/lesson/${lesson.id}?childId=${activeChild.id}`}>
                                <Button variant="explorer-outline" size="sm" className="w-full min-h-[40px] text-xs">
                                  Review <CheckCircle className="h-3 w-3" />
                                </Button>
                              </Link>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Lock className="h-3 w-3 shrink-0" />
                                <span>Complete {lesson.order_index - 1} first</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ── Final goal ────────────────────────────────────────────── */}
              <motion.div
                className="relative mt-6 flex flex-col items-center gap-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-all ${
                    allDone
                      ? "bg-gradient-gold animate-celebrate"
                      : "bg-muted opacity-50"
                  }`}
                >
                  <Compass className="h-10 w-10 text-accent-foreground" />
                </div>
                <p className={`font-display font-bold ${allDone ? "text-explorer-gold" : "text-muted-foreground"}`}>
                  {allDone ? "🏆 Level 1 Complete!" : "Level 1 Goal"}
                </p>
              </motion.div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default LessonMap;
