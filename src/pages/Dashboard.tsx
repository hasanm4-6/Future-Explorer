import { useState, useEffect, memo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { useAuth } from "@/hooks/use-auth";
import { DashboardSkeleton, LessonsSkeleton } from "@/components/ui/skeleton-loaders";
import type { DbChildProfile, LessonWithStatus } from "@/types";
import {
  Plus, Star, Trophy, BookOpen, ArrowRight, BarChart3, Clock, Target,
  TrendingUp, Flame, Zap, Compass, Users, TrendingDown, Calendar,
  AlertCircle, RefreshCw, PartyPopper, CheckCircle, Medal, Lock, Sparkles,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_SCENES = 4;
const MINS_PER_LESSON = 10;

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
} as const;

// ─── Helpers (unchanged) ──────────────────────────────────────────────────────

function scoreToHeight(score: number): string {
  if (score >= 90) return "h-full";
  if (score >= 75) return "h-4/5";
  if (score >= 60) return "h-3/4";
  if (score >= 45) return "h-3/5";
  if (score >= 30) return "h-1/2";
  if (score >= 15) return "h-1/3";
  return "h-1/4";
}

function xpLevel(totalXp: number): string {
  if (totalXp >= 400) return "Master Explorer";
  if (totalXp >= 250) return "Expert Explorer";
  if (totalXp >= 100) return "Explorer";
  return "Cadet";
}

function xpToNextLevel(totalXp: number): { current: number; max: number; label: string } {
  if (totalXp < 100) return { current: totalXp, max: 100, label: "Explorer" };
  if (totalXp < 250) return { current: totalXp - 100, max: 150, label: "Expert Explorer" };
  if (totalXp < 400) return { current: totalXp - 250, max: 150, label: "Master Explorer" };
  return { current: 400, max: 400, label: "Max Level!" };
}

const BADGE_EMOJIS: Record<string, string> = {
  "AI Curious": "🔍", "Robot Friend": "🤖", "Pattern Pro": "🧩",
  "Data Detective": "🗂️", "Error Hunter": "🐛", "Voice Whiz": "🎤",
  "AI Hero": "🦸", "AI Explorer": "🏆",
};

function badgeEmoji(name: string): string {
  return BADGE_EMOJIS[name] ?? "🏅";
}

// ─── Derived stats (unchanged logic) ──────────────────────────────────────────

interface DashboardStats {
  lessonsCompleted: number;
  totalLessons: number;
  progressPct: number;
  allDone: boolean;
  badges: string[];
  totalXp: number;
  streakDays: number;
  quizScores: number[];
  avgQuizScore: number;
  quizTrend: "improving" | "declining" | "neutral";
  skillsMastered: string[];
  skillsInProgress: string[];
  weeklyMinutes: number;
  currentMissionTitle: string;
  currentMissionLessonId: number | null;
  currentMissionProgress: number;
  currentMissionScenesDone: number;
  nextUnlockedLesson: LessonWithStatus | null;
}

function computeStats(
  child: DbChildProfile | null,
  lessons: LessonWithStatus[],
): DashboardStats {
  if (!child) {
    return {
      lessonsCompleted: 0, totalLessons: 0, progressPct: 0, allDone: false,
      badges: [], totalXp: 0, streakDays: 0, quizScores: [], avgQuizScore: 0,
      quizTrend: "neutral", skillsMastered: [], skillsInProgress: [],
      weeklyMinutes: 0, currentMissionTitle: "No mission yet",
      currentMissionLessonId: null, currentMissionProgress: 0,
      currentMissionScenesDone: 0, nextUnlockedLesson: null,
    };
  }

  const completedLessons = lessons.filter((l) => l.status === "completed");
  const unlockedLesson = lessons.find((l) => l.status === "unlocked") ?? null;
  const totalLessons = lessons.length;
  const lessonsCompleted = completedLessons.length;
  const allDone = totalLessons > 0 && lessonsCompleted === totalLessons;
  const progressPct = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;

  const badges = child.progress?.badges ?? [];
  const totalXp = child.progress?.total_xp ?? 0;
  const streakDays = child.progress?.streak_days ?? 0;

  const quizScores = completedLessons
    .map((l) => l.quiz_score)
    .filter((s): s is number => s !== null);

  const avgQuizScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
    : 0;

  let quizTrend: "improving" | "declining" | "neutral" = "neutral";
  if (quizScores.length >= 2) {
    const last = quizScores[quizScores.length - 1];
    const prev = quizScores[quizScores.length - 2];
    if (last > prev) quizTrend = "improving";
    else if (last < prev) quizTrend = "declining";
  }

  const skillsMastered = completedLessons.map((l) => l.title);
  const skillsInProgress = lessons.filter((l) => l.status === "unlocked").map((l) => l.title);
  const weeklyMinutes = lessonsCompleted * MINS_PER_LESSON;

  const currentMissionTitle = unlockedLesson?.title ?? (allDone ? "Level Complete!" : "Starting Out");
  const currentMissionLessonId = unlockedLesson?.id ?? null;
  const currentMissionScenesDone = unlockedLesson?.completed_scenes?.length ?? 0;
  const currentMissionProgress = unlockedLesson
    ? Math.round((currentMissionScenesDone / TOTAL_SCENES) * 100)
    : allDone ? 100 : 0;

  return {
    lessonsCompleted, totalLessons, progressPct, allDone, badges, totalXp,
    streakDays, quizScores, avgQuizScore, quizTrend, skillsMastered,
    skillsInProgress, weeklyMinutes, currentMissionTitle,
    currentMissionLessonId, currentMissionProgress, currentMissionScenesDone,
    nextUnlockedLesson: unlockedLesson,
  };
}

// ─── Memoized Sub-Components ──────────────────────────────────────────────────

/** Error state */
const ErrorState = memo(({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-destructive font-medium">{message}</p>
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    </div>
  </div>
));
ErrorState.displayName = "ErrorState";

/** Empty children placeholder */
const EmptyChildrenCard = memo(({ custom }: { custom: number }) => (
  <motion.div
    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-12 text-center"
    initial="hidden" animate="visible" variants={fadeUp} custom={custom}
  >
    <Users className="h-14 w-14 text-muted-foreground mx-auto mb-4" />
    <h3 className="mb-2 font-display text-xl font-semibold">No Explorers Yet</h3>
    <p className="mb-6 text-sm text-muted-foreground max-w-xs">
      Add your first child profile to start their AI learning adventure!
    </p>
    <Link to="/create-child">
      <Button variant="explorer" className="gap-2"><Plus className="h-4 w-4" /> Add First Explorer</Button>
    </Link>
  </motion.div>
));
EmptyChildrenCard.displayName = "EmptyChildrenCard";

/** XP Level Bar */
const XpLevelBar = memo(({ totalXp }: { totalXp: number }) => {
  const tier = xpLevel(totalXp);
  const { current, max, label } = xpToNextLevel(totalXp);
  const pct = Math.min(100, Math.round((current / max) * 100));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-explorer-gold">{tier}</span>
        {max !== 400 && (
          <span className="text-xs text-muted-foreground">
            {current}/{max} XP → {label}
          </span>
        )}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-gradient-gold"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
});
XpLevelBar.displayName = "XpLevelBar";

/** Badge Gallery */
const BadgeGallery = memo(({
  earned, all,
}: {
  earned: string[];
  all: Array<{ badge_name: string | null; title: string }>;
}) => {
  const allBadges = all.filter((l) => l.badge_name);
  if (allBadges.length === 0) return null;

  return (
    <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-gold">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold">
          <Medal className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold">Badge Collection</h3>
          <p className="text-xs text-muted-foreground">{earned.length}/{allBadges.length} earned</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {allBadges.map((l) => {
          const isEarned = l.badge_name ? earned.includes(l.badge_name) : false;
          return (
            <div
              key={l.badge_name}
              className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-all ${
                isEarned ? "bg-accent/40 shadow-sm" : "bg-muted/50 opacity-50"
              }`}
            >
              <span className="text-2xl">{isEarned ? badgeEmoji(l.badge_name!) : "🔒"}</span>
              <span className={`text-xs font-bold leading-tight ${isEarned ? "text-foreground" : "text-muted-foreground"}`}>
                {l.badge_name}
              </span>
              {!isEarned && <span className="text-[10px] text-muted-foreground">{l.title}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
});
BadgeGallery.displayName = "BadgeGallery";

/** Child selector pills */
const ChildSelector = memo(({
  children, activeChild, hasChildren, onSelect,
}: {
  children: DbChildProfile[];
  activeChild: DbChildProfile | null;
  hasChildren: boolean;
  onSelect: (childId: string) => void;
}) => (
  <motion.div className="mb-6 flex gap-3 overflow-x-auto pb-2" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
    {!hasChildren ? (
      <EmptyChildrenCard custom={1} />
    ) : (
      <>
        {children.map((c) => (
          <button
            key={c.id} type="button"
            onClick={() => onSelect(c.id)}
            className={`flex items-center gap-3 rounded-2xl border-2 p-3 min-w-[150px] transition-all ${
              c.id === activeChild?.id
                ? "border-primary bg-primary/5 shadow-card"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xl">{c.avatar}</div>
            <div className="text-left">
              <p className="font-display font-bold text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground">Age {c.age}</p>
              {c.progress && <p className="text-xs font-bold text-explorer-gold">{c.progress.total_xp} XP</p>}
            </div>
          </button>
        ))}
        {children.length < 3 && (
          <Link
            to="/create-child"
            className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-border p-3 min-w-[140px] text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="font-display font-semibold text-sm">Add Explorer</span>
          </Link>
        )}
      </>
    )}
  </motion.div>
));
ChildSelector.displayName = "ChildSelector";

// ─── Parent View Content ──────────────────────────────────────────────────────

const ParentViewContent = memo(({
  activeChild, stats, lessons,
}: {
  activeChild: DbChildProfile;
  stats: DashboardStats;
  lessons: LessonWithStatus[];
}) => (
  <>
    {/* Level-complete banner */}
    <AnimatePresence>
      {stats.allDone && (
        <motion.div
          className="mb-6 rounded-2xl bg-gradient-gold p-5 text-center shadow-playful"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", damping: 14 }}
        >
          <div className="flex items-center justify-center gap-3">
            <PartyPopper className="h-6 w-6 text-accent-foreground" />
            <p className="font-display text-lg font-bold text-accent-foreground">
              🎉 {activeChild.name} completed Level 1! AI Explorer unlocked!
            </p>
            <PartyPopper className="h-6 w-6 text-accent-foreground" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Overall progress card */}
    <motion.div className="mb-6 rounded-2xl bg-card p-6 shadow-card" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative shrink-0 mx-auto sm:mx-0">
          <svg className="absolute inset-0 -rotate-90" width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="31" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
            <motion.circle cx="36" cy="36" r="31" fill="none" stroke="hsl(var(--explorer-coral))" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 31}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 31 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 31 * (1 - stats.progressPct / 100) }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
          </svg>
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-muted text-4xl">{activeChild.avatar}</div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-display text-2xl font-bold">{activeChild.name}</h2>
          <p className="text-sm text-muted-foreground">
            Level 1 &middot; <span className="font-bold text-foreground">{stats.lessonsCompleted}</span>/{stats.totalLessons} topics &middot; <span className="font-bold text-explorer-coral">{stats.progressPct}%</span>
          </p>
          <div className="mt-2 h-2.5 w-full max-w-xs overflow-hidden rounded-full bg-muted mx-auto sm:mx-0">
            <motion.div className="h-full rounded-full bg-gradient-coral" initial={{ width: 0 }} animate={{ width: `${stats.progressPct}%` }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} />
          </div>
          <div className="mt-3 max-w-xs mx-auto sm:mx-0"><XpLevelBar totalXp={stats.totalXp} /></div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:flex-col sm:items-end">
          <div className="flex items-center gap-1.5 rounded-full bg-accent/30 px-3 py-1.5">
            <Trophy className="h-4 w-4 text-explorer-gold" /><span className="font-display text-sm font-bold">{stats.badges.length} Badges</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-explorer-blue/10 px-3 py-1.5">
            <Zap className="h-4 w-4 text-explorer-blue" /><span className="font-display text-sm font-bold text-explorer-blue">{stats.totalXp} XP</span>
          </div>
          {stats.streakDays > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-explorer-coral/10 px-3 py-1.5">
              <Flame className="h-4 w-4 text-explorer-coral" /><span className="font-display text-sm font-bold text-explorer-coral">{stats.streakDays}d streak</span>
            </div>
          )}
          <Link to={`/lessons?childId=${activeChild.id}`} className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
            <Compass className="h-4 w-4" /> View Map
          </Link>
        </div>
      </div>
    </motion.div>

    {/* Row 1: Current Mission + Weekly Activity */}
    <motion.div className="mb-6 grid gap-6 lg:grid-cols-2" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
      {/* Current Mission */}
      <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-coral">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-coral"><Target className="h-6 w-6 text-primary-foreground" /></div>
          <div><h3 className="font-display text-lg font-bold">Current Mission</h3><p className="text-xs text-muted-foreground">{activeChild.name}'s Progress</p></div>
        </div>
        <div className="space-y-3">
          {stats.allDone ? (
            <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-explorer-green shrink-0" /><span className="font-display text-xl font-bold text-explorer-green">Level 1 Complete!</span></div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-bold">{stats.currentMissionTitle}</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-explorer-coral/10 text-explorer-coral">In Progress</span>
              </div>
              <Progress value={stats.currentMissionProgress} className="h-3" />
              <p className="text-xs text-muted-foreground">{stats.currentMissionScenesDone}/{TOTAL_SCENES} scenes &middot; Topic {stats.lessonsCompleted + 1} of {stats.totalLessons}</p>
              {stats.nextUnlockedLesson && (
                <Link to={`/lesson/${stats.nextUnlockedLesson.id}?childId=${activeChild.id}`}>
                  <Button variant="explorer" size="sm" className="gap-2 mt-1"><ArrowRight className="h-3 w-3" />{stats.currentMissionScenesDone > 0 ? "Continue Lesson" : "Start Lesson"}</Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-blue">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-blue"><Clock className="h-6 w-6 text-primary-foreground" /></div>
          <div><h3 className="font-display text-lg font-bold">Learning Activity</h3><p className="text-xs text-muted-foreground">Estimated time & sessions</p></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-end gap-2">
            <span className="font-display text-4xl font-bold text-explorer-blue">{stats.weeklyMinutes}</span>
            <span className="text-sm text-muted-foreground mb-1">est. minutes learned</span>
          </div>
          <div className="flex gap-1 items-end h-10">
            {lessons.map((l) => (
              <div key={l.id} title={l.title} className={`flex-1 rounded transition-all ${l.status === "completed" ? "bg-explorer-blue h-full" : l.status === "unlocked" ? "bg-explorer-blue/30 h-3/4" : "bg-muted h-1/4"}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{stats.lessonsCompleted} topics covered &middot; {stats.totalLessons - stats.lessonsCompleted} remaining</p>
        </div>
      </div>
    </motion.div>

    {/* Row 2: Quiz Accuracy + Skills Overview */}
    <motion.div className="mb-6 grid gap-6 lg:grid-cols-2" initial="hidden" animate="visible" variants={fadeUp} custom={4}>
      {/* Quiz Accuracy */}
      <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-green">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-green">
            {stats.quizTrend === "improving" ? <TrendingUp className="h-6 w-6 text-primary-foreground" /> : stats.quizTrend === "declining" ? <TrendingDown className="h-6 w-6 text-primary-foreground" /> : <Target className="h-6 w-6 text-primary-foreground" />}
          </div>
          <div><h3 className="font-display text-lg font-bold">Quiz Performance</h3><p className="text-xs text-muted-foreground">Average across {stats.quizScores.length} quiz{stats.quizScores.length !== 1 ? "zes" : ""}</p></div>
        </div>
        {stats.quizScores.length === 0 ? (
          <p className="text-sm text-muted-foreground">No quizzes completed yet. Keep learning!</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="font-display text-4xl font-bold">{stats.avgQuizScore}%</span>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${stats.quizTrend === "improving" ? "bg-explorer-green/10 text-explorer-green" : stats.quizTrend === "declining" ? "bg-explorer-coral/10 text-explorer-coral" : "bg-muted text-muted-foreground"}`}>
                {stats.quizTrend === "improving" ? <><TrendingUp className="h-3 w-3" /> Improving</> : stats.quizTrend === "declining" ? <><TrendingDown className="h-3 w-3" /> Needs Attention</> : <><Target className="h-3 w-3" /> Stable</>}
              </div>
            </div>
            <div className="flex gap-1 items-end h-8">
              {stats.quizScores.map((score, i) => (
                <div key={i} title={`Quiz ${i + 1}: ${score}%`} className={`flex-1 rounded-sm bg-explorer-green transition-all ${scoreToHeight(score)}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{stats.quizTrend === "improving" ? "Great progress! Keep up the excellent work." : stats.quizTrend === "declining" ? "Consider reviewing recent lessons for support." : "Consistent performance. Good job!"}</p>
          </div>
        )}
      </div>

      {/* Topics Covered */}
      <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-purple">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-purple"><BookOpen className="h-6 w-6 text-primary-foreground" /></div>
          <div>
            <h3 className="font-display text-lg font-bold">Topics Covered</h3>
            <p className="text-xs text-muted-foreground">{stats.skillsMastered.length}/{stats.totalLessons} topics learned</p>
          </div>
        </div>
        <div className="space-y-0.5">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center gap-2.5 py-1.5 border-b border-border/40 last:border-0">
              <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${lesson.status === "completed" ? "bg-explorer-green" : lesson.status === "unlocked" ? "bg-explorer-coral animate-pulse" : "bg-muted-foreground/30"}`} />
              <span className={`text-sm flex-1 min-w-0 truncate ${lesson.status === "locked" ? "text-muted-foreground" : lesson.status === "unlocked" ? "font-semibold text-explorer-coral" : "font-medium"}`}>{lesson.title}</span>
              {lesson.status === "completed" && lesson.quiz_score !== null && (
                <span className="text-xs font-bold text-explorer-green shrink-0">{lesson.quiz_score}%</span>
              )}
              {lesson.status === "completed" && lesson.quiz_score === null && (
                <CheckCircle className="h-3.5 w-3.5 text-explorer-green shrink-0" />
              )}
              {lesson.status === "unlocked" && <span className="text-xs font-bold text-explorer-coral shrink-0">Active</span>}
            </div>
          ))}
        </div>
      </div>
    </motion.div>

    {/* Row 3: Next Lesson + Gentle Reminders */}
    <motion.div className="mb-6 grid gap-6 lg:grid-cols-2" initial="hidden" animate="visible" variants={fadeUp} custom={5}>
      {/* Suggested Next Lesson */}
      <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-coral">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-coral"><Sparkles className="h-6 w-6 text-primary-foreground" /></div>
          <div className="flex-1"><h3 className="font-display text-lg font-bold">Suggested Next</h3><p className="text-xs text-muted-foreground">Based on current progress</p></div>
        </div>
        {stats.allDone ? (
          <div className="space-y-2"><p className="font-display text-lg font-bold text-explorer-green">🎉 All missions complete!</p><p className="text-sm text-muted-foreground">{activeChild.name} has finished Level 1. Level 2 is coming soon!</p></div>
        ) : stats.nextUnlockedLesson ? (
          <div className="space-y-3">
            <div><p className="text-xs text-muted-foreground mb-1">Topic {stats.nextUnlockedLesson.order_index}</p><h4 className="font-display text-lg font-semibold">{stats.nextUnlockedLesson.title}</h4><p className="text-sm text-muted-foreground mt-1">{stats.currentMissionScenesDone > 0 ? `${stats.currentMissionScenesDone}/${TOTAL_SCENES} scenes done — almost there!` : "Ready to start this topic!"}</p></div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-explorer-gold">+{stats.nextUnlockedLesson.xp_reward ?? 50} XP</span>
              {stats.nextUnlockedLesson.badge_name && <span className="text-xs font-bold text-accent-foreground bg-accent/30 px-2 py-0.5 rounded-full">🏅 {stats.nextUnlockedLesson.badge_name}</span>}
            </div>
            <Link to={`/lesson/${stats.nextUnlockedLesson.id}?childId=${activeChild.id}`}>
              <Button variant="explorer" size="sm" className="gap-2"><ArrowRight className="h-4 w-4" />{stats.currentMissionScenesDone > 0 ? "Continue Mission" : "Start Mission"}</Button>
            </Link>
          </div>
        ) : (<p className="text-sm text-muted-foreground">Complete the current mission to unlock more!</p>)}
      </div>

      {/* Gentle Reminders */}
      <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-pink">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-pink"><Calendar className="h-6 w-6 text-primary-foreground" /></div>
          <div><h3 className="font-display text-lg font-bold">Encouragement</h3><p className="text-xs text-muted-foreground">Consistency & momentum</p></div>
        </div>
        <div className="space-y-3">
          {stats.streakDays >= 3 ? (
            <div className="flex items-center gap-3 p-3 bg-explorer-green/5 rounded-lg"><Flame className="h-5 w-5 text-explorer-green shrink-0" /><p className="text-sm text-muted-foreground"><span className="font-semibold text-explorer-green">Great consistency!</span> {stats.streakDays} day streak going strong! 🔥</p></div>
          ) : stats.streakDays > 0 ? (
            <div className="flex items-center gap-3 p-3 bg-explorer-coral/5 rounded-lg"><Flame className="h-5 w-5 text-explorer-coral shrink-0" /><p className="text-sm text-muted-foreground"><span className="font-semibold text-explorer-coral">{stats.streakDays} day streak!</span> Keep it going — 3 days unlocks a bonus!</p></div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg"><Calendar className="h-5 w-5 text-muted-foreground shrink-0" /><p className="text-sm text-muted-foreground"><span className="font-semibold">Start a streak!</span> Regular practice builds confidence fast.</p></div>
          )}
          {stats.totalXp >= 100 ? (
            <div className="flex items-center gap-3 p-3 bg-explorer-gold/10 rounded-lg"><Zap className="h-5 w-5 text-explorer-gold shrink-0" /><p className="text-sm text-muted-foreground"><span className="font-semibold text-explorer-gold">{stats.totalXp} XP earned!</span> {activeChild.name} is levelling up fast.</p></div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg"><Zap className="h-5 w-5 text-muted-foreground shrink-0" /><p className="text-sm text-muted-foreground"><span className="font-semibold">Keep earning XP!</span> Each mission rewards points toward new levels.</p></div>
          )}
        </div>
      </div>
    </motion.div>

    {/* Badge Collection */}
    <motion.div className="mb-6" initial="hidden" animate="visible" variants={fadeUp} custom={6}>
      <BadgeGallery earned={stats.badges} all={lessons.map((l) => ({ badge_name: l.badge_name, title: l.title }))} />
    </motion.div>
  </>
));
ParentViewContent.displayName = "ParentViewContent";

// ─── Explorer (Child) View Content ────────────────────────────────────────────

const ExplorerViewContent = memo(({
  activeChild, stats, lessons,
}: {
  activeChild: DbChildProfile;
  stats: DashboardStats;
  lessons: LessonWithStatus[];
}) => (
  <>
    {/* Level-complete celebration */}
    <AnimatePresence>
      {stats.allDone && (
        <motion.div className="mb-6 rounded-2xl bg-gradient-gold p-5 text-center shadow-playful"
          initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", damping: 14 }}>
          <div className="flex items-center justify-center gap-3">
            <PartyPopper className="h-6 w-6 text-accent-foreground" />
            <p className="font-display text-lg font-bold text-accent-foreground">🎉 You finished Level 1! You're an AI Explorer!</p>
            <PartyPopper className="h-6 w-6 text-accent-foreground" />
          </div>
          <p className="mt-1 text-sm text-accent-foreground/80">All missions conquered. Level 2 coming soon!</p>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Stats bar */}
    <motion.div className="mb-6 grid gap-4 sm:grid-cols-4" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
      <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold"><Trophy className="h-6 w-6 text-primary-foreground" /></div>
        <div><p className="text-2xl font-bold font-display">{stats.badges.length}</p><p className="text-xs text-muted-foreground">Badges Earned</p></div>
      </div>
      <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-coral"><Flame className="h-6 w-6 text-primary-foreground" /></div>
        <div><p className="text-2xl font-bold font-display">{stats.streakDays}<span className="text-base ml-1">day{stats.streakDays !== 1 ? "s" : ""}</span></p><p className="text-xs text-muted-foreground">Learning Streak 🔥</p></div>
      </div>
      <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-blue"><Zap className="h-6 w-6 text-primary-foreground" /></div>
        <div><p className="text-2xl font-bold font-display text-explorer-blue">{stats.totalXp}</p><p className="text-xs text-muted-foreground">Total XP</p></div>
      </div>
      <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-green"><Star className="h-6 w-6 text-primary-foreground" /></div>
        <div><p className="text-xl font-bold font-display">{xpLevel(stats.totalXp)}</p><p className="text-xs text-muted-foreground">Explorer Rank</p></div>
      </div>
    </motion.div>

    {/* XP progress bar */}
    <motion.div className="mb-6 rounded-2xl bg-card p-5 shadow-card" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
      <div className="flex items-center gap-3 mb-3">
        <Zap className="h-5 w-5 text-explorer-gold" /><h3 className="font-display text-base font-bold">XP Progress</h3>
        <span className="ml-auto text-sm font-bold text-explorer-gold">{stats.totalXp} XP</span>
      </div>
      <XpLevelBar totalXp={stats.totalXp} />
    </motion.div>

    {/* Current Mission CTA */}
    {!stats.allDone && stats.nextUnlockedLesson && (
      <motion.div className="mb-6 overflow-hidden rounded-2xl bg-gradient-coral p-8 text-primary-foreground shadow-playful" initial="hidden" animate="visible" variants={fadeUp} custom={4}>
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm shrink-0 text-4xl">{stats.nextUnlockedLesson.icon ?? "🚀"}</div>
          <div className="flex-1">
            <p className="text-sm font-bold opacity-80">Your Current Topic</p>
            <h2 className="font-display text-2xl font-bold">Topic {stats.nextUnlockedLesson.order_index}: {stats.currentMissionTitle}</h2>
            <p className="text-sm opacity-80 mt-1">{stats.currentMissionScenesDone > 0 ? `You're ${stats.currentMissionScenesDone}/${TOTAL_SCENES} scenes through — keep going!` : "Start this topic and earn a new badge!"}</p>
            <div className="mt-2 flex items-center gap-3 opacity-90">
              <span className="text-sm font-bold">+{stats.nextUnlockedLesson.xp_reward ?? 50} XP</span>
              {stats.nextUnlockedLesson.badge_name && <span className="text-sm font-bold">🏅 {stats.nextUnlockedLesson.badge_name}</span>}
            </div>
          </div>
          <Link to={`/lesson/${stats.nextUnlockedLesson.id}?childId=${activeChild.id}`}>
            <Button size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 font-display font-bold">
              {stats.currentMissionScenesDone > 0 ? "Continue" : "Start Mission"} <ArrowRight className="h-5 w-5 ml-1" />
            </Button>
          </Link>
        </div>
      </motion.div>
    )}

    {/* Mission Progress Map (mini) */}
    <motion.div className="mb-6 rounded-2xl bg-card p-6 shadow-card" initial="hidden" animate="visible" variants={fadeUp} custom={5}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-bold">Topics Covered</h3>
        <span className="text-sm font-bold text-explorer-coral">{stats.lessonsCompleted}/{stats.totalLessons} topics</span>
      </div>
      <div className="space-y-2">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="flex items-center gap-3">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${lesson.status === "completed" ? "bg-explorer-green text-white" : lesson.status === "unlocked" ? "bg-explorer-coral text-white animate-pulse" : "bg-muted text-muted-foreground"}`}>
              {lesson.status === "completed" ? <CheckCircle className="h-4 w-4" /> : lesson.status === "unlocked" ? <Star className="h-4 w-4" /> : <Lock className="h-3 w-3" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold truncate ${lesson.status === "locked" ? "text-muted-foreground" : "text-foreground"}`}>{lesson.title}</p>
              {lesson.status === "unlocked" && lesson.completed_scenes.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: TOTAL_SCENES }).map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${i < lesson.completed_scenes.length ? "bg-explorer-coral" : "bg-muted"}`} />
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {lesson.status === "completed" && lesson.badge_name && <span className="text-xs text-accent-foreground bg-accent/40 px-2 py-0.5 rounded-full font-bold">{badgeEmoji(lesson.badge_name)} {lesson.badge_name}</span>}
              {lesson.status !== "completed" && <span className="text-xs text-muted-foreground font-bold">+{lesson.xp_reward ?? 50} XP</span>}
            </div>
          </div>
        ))}
      </div>
    </motion.div>

    {/* Badges earned */}
    {stats.badges.length > 0 && (
      <motion.div className="mb-6 rounded-2xl bg-card p-6 shadow-card" initial="hidden" animate="visible" variants={fadeUp} custom={6}>
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="h-5 w-5 text-explorer-gold" /><h3 className="font-display text-lg font-bold">My Badges</h3>
          <span className="ml-auto text-sm font-bold text-explorer-gold">{stats.badges.length} earned!</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {stats.badges.map((badge) => (
            <motion.div key={badge} className="flex flex-col items-center gap-1 rounded-xl bg-accent/40 p-3 shadow-sm min-w-[80px]" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <span className="text-3xl">{badgeEmoji(badge)}</span>
              <span className="text-xs font-bold text-center leading-tight">{badge}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )}

    {/* View full map */}
    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7}>
      <Link to={`/lessons?childId=${activeChild.id}`}>
        <Button variant="explorer-outline" size="lg" className="w-full sm:w-auto">
          <Compass className="h-5 w-5" /> View Full Explorer Map <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </motion.div>
  </>
));
ExplorerViewContent.displayName = "ExplorerViewContent";

// ─── Dashboard (main) ─────────────────────────────────────────────────────────

type ViewMode = "parent" | "child";

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("parent");

  const childIdFromUrl = searchParams.get("childId");

  // ── Fetch children (cached via React Query) ─────────────────────────────
  const {
    data: childrenRes,
    isLoading: childrenLoading,
    isError: childrenError,
    refetch: refetchChildren,
  } = useQuery({
    queryKey: queryKeys.children.all,
    queryFn: () => api.getChildren(),
    staleTime: 5 * 60 * 1000,
  });

  const children: DbChildProfile[] = childrenRes?.data ?? [];
  const activeChild: DbChildProfile | null =
    children.find((c) => c.id === childIdFromUrl) ?? children[0] ?? null;

  // Sync URL with active child
  useEffect(() => {
    if (activeChild && activeChild.id !== childIdFromUrl) {
      setSearchParams({ childId: activeChild.id }, { replace: true });
    }
  }, [activeChild, childIdFromUrl, setSearchParams]);

  // ── Fetch lessons for active child ──────────────────────────────────────
  const { data: lessonsRes, isLoading: lessonsLoading } = useQuery({
    queryKey: queryKeys.lessons.byChild(activeChild?.id ?? ""),
    queryFn: () => api.getLessons(activeChild!.id, 1),
    enabled: !!activeChild,
    staleTime: 30 * 1000,
  });

  const lessons: LessonWithStatus[] = lessonsRes?.data?.lessons ?? [];
  const stats = computeStats(activeChild, lessons);
  const hasChildren = children.length > 0;

  const handleSelectChild = (childId: string) => setSearchParams({ childId });

  // ── PROGRESSIVE LOADING ─────────────────────────────────────────────────
  // Show full skeleton only when children haven't loaded yet.
  // Once children load, show header + child selector immediately,
  // with a lighter skeleton for the lessons section.
  if (childrenLoading) return <DashboardSkeleton />;

  if (childrenError) {
    return (
      <ErrorState
        message="Couldn't load your explorers. Please check your connection and try again."
        onRetry={() => void refetchChildren()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">

        {/* Header + View Toggle — renders immediately */}
        <motion.div className="mb-6" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold">
                {viewMode === "parent"
                  ? `Welcome back, ${user?.name ?? "Parent"}! 👋`
                  : activeChild
                    ? `${activeChild.avatar} ${activeChild.name}'s Adventure`
                    : "Explorer View"}
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${viewMode === "parent" ? "bg-explorer-blue" : "bg-explorer-coral"}`} />
                <p className="text-xs font-semibold text-muted-foreground">
                  {viewMode === "parent" ? "You are in Parent View" : "You are in Explorer Mode"}
                </p>
              </div>
            </div>
            <div className="inline-flex rounded-2xl bg-muted p-1">
              <button type="button" onClick={() => setViewMode("parent")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold font-display transition-all ${viewMode === "parent" ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"}`}>
                <BarChart3 className="h-4 w-4" /> Parent View
              </button>
              <button type="button" onClick={() => setViewMode("child")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold font-display transition-all ${viewMode === "child" ? "bg-gradient-coral text-primary-foreground shadow-playful" : "text-muted-foreground hover:text-foreground"}`}>
                <Compass className="h-4 w-4" /> Explorer View
              </button>
            </div>
          </div>
        </motion.div>

        {/* Child Selector — renders immediately from cached children */}
        <ChildSelector children={children} activeChild={activeChild} hasChildren={hasChildren} onSelect={handleSelectChild} />

        {/* Content — shows lessons skeleton while lessons load */}
        {!!activeChild && lessonsLoading ? (
          <LessonsSkeleton />
        ) : (
          <>
            {viewMode === "parent" && (
              <>
                {!hasChildren || !activeChild ? (
                  <motion.div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-12 min-h-[300px] text-center" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="mb-2 font-display text-xl font-semibold">Start Your AI Adventure</h3>
                    <p className="mb-6 text-muted-foreground max-w-md">Add your first child profile to track their progress, see achievements, and monitor their AI learning journey.</p>
                    <Link to="/create-child"><Button variant="explorer" size="lg" className="gap-2"><Plus className="h-5 w-5" /> Add First Explorer</Button></Link>
                  </motion.div>
                ) : (
                  <ParentViewContent activeChild={activeChild} stats={stats} lessons={lessons} />
                )}
              </>
            )}

            {viewMode === "child" && (
              <>
                {!hasChildren || !activeChild ? (
                  <EmptyChildrenCard custom={2} />
                ) : (
                  <ExplorerViewContent activeChild={activeChild} stats={stats} lessons={lessons} />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
