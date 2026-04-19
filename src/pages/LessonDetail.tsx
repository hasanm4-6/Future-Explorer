import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  XCircle,
  Star,
  PartyPopper,
  ArrowRight,
  Lightbulb,
  Save,
  Volume2,
  VolumeX,
  Lock,
  Trophy,
  Zap,
  Loader2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { LessonScene } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const MASTERY_THRESHOLD = 80;
const AUTOSAVE_DEBOUNCE_MS = 2000;

// ── Component ─────────────────────────────────────────────────────────────────
const LessonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const childId = searchParams.get("childId") ?? "";
  const lessonId = parseInt(id ?? "1", 10);

  // ── Fetch lesson + scenes ──────────────────────────────────────────────────
  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.lesson.detail(lessonId, childId),
    queryFn: () => api.getLessonById(lessonId, childId),
    enabled: !!childId && !isNaN(lessonId),
  });

  const lesson = data?.data?.lesson;
  const contentScenes: LessonScene[] =
    lesson?.scenes.filter((s) => s.type === "content") ?? [];
  const quizScene: LessonScene | undefined = lesson?.scenes.find(
    (s) => s.type === "quiz",
  );

  // ── Local state ────────────────────────────────────────────────────────────
  const [completedScenes, setCompletedScenes] = useState<number[]>([]);
  const [currentScene, setCurrentScene] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  // Quiz state — selectedAnswer is NEVER auto-cleared; only reset on explicit retry
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Completion state
  const [isComplete, setIsComplete] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<string | null>(null);
  const [nextLessonId, setNextLessonId] = useState<number | null>(null);

  // Accessibility
  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
  const [isDyslexiaMode, setIsDyslexiaMode] = useState(false);

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Hydrate state from saved progress ─────────────────────────────────────
  useEffect(() => {
    if (!lesson) return;
    if (lesson.completed_scenes.length > 0) {
      setCompletedScenes(lesson.completed_scenes);
      setCurrentScene(
        Math.min(lesson.current_scene_index, contentScenes.length - 1),
      );
    }
  }, [lesson]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Mutations ──────────────────────────────────────────────────────────────
  const saveProgressMutation = useMutation({
    mutationFn: (vars: {
      current_scene_index: number;
      completed_scenes: number[];
      attempts?: number;
    }) => api.saveLessonProgress(childId, lessonId, vars),
  });

  // Stable ref for mutate — prevents autosave timer from resetting on re-render
  const saveMutateRef = useRef(saveProgressMutation.mutate);
  saveMutateRef.current = saveProgressMutation.mutate;

  const completeMutation = useMutation({
    mutationFn: (quizScore: number) =>
      api.completeLesson(childId, lessonId, quizScore),
    onSuccess: (res) => {
      // Store badge + next lesson
      setEarnedBadge(res.data?.badge_name ?? null);
      setNextLessonId(res.data?.next_lesson_id ?? null);

      // Re-fetch both lesson list (progress %) AND children (XP/streak/badges)
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons.byChild(childId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.children.all });
    },
  });

  // ── Debounced autosave (stable — uses ref to avoid dep on mutation) ────────
  const scheduleAutosave = useCallback(
    (sceneIndex: number, done: number[], att: number) => {
      if (!childId) return;
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(() => {
        saveMutateRef.current({
          current_scene_index: sceneIndex,
          completed_scenes: done,
          attempts: att,
        });
      }, AUTOSAVE_DEBOUNCE_MS);
    },
    [childId],
  );

  useEffect(() => {
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, []);

  // ── Text-to-speech ─────────────────────────────────────────────────────────
  const speakText = useCallback(
    (text: string) => {
      if (!isTextToSpeechEnabled || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isTextToSpeechEnabled],
  );

  const toggleTTS = () => {
    setIsTextToSpeechEnabled((prev) => {
      if (prev) window.speechSynthesis?.cancel();
      return !prev;
    });
  };

  // ── Scene actions ──────────────────────────────────────────────────────────
  const completeScene = (sceneOrderIndex: number) => {
    const updated = completedScenes.includes(sceneOrderIndex)
      ? completedScenes
      : [...completedScenes, sceneOrderIndex];

    setCompletedScenes(updated);
    setStreak((prev) => prev + 1);

    const nextIndex = currentScene + 1;
    if (nextIndex < contentScenes.length) {
      setTimeout(() => setCurrentScene(nextIndex), 400);
    }

    scheduleAutosave(
      nextIndex < contentScenes.length ? nextIndex : currentScene,
      updated,
      attempts,
    );
  };

  const isSceneCompleted = (scene: LessonScene) =>
    completedScenes.includes(scene.order_index);

  const isSceneLocked = (index: number) => {
    if (index === 0) return false;
    return !completedScenes.includes(
      contentScenes[index - 1]?.order_index ?? -1,
    );
  };

  const allScenesComplete = contentScenes.every((s) =>
    completedScenes.includes(s.order_index),
  );

  // ── Quiz actions ───────────────────────────────────────────────────────────
  const quizOptions = quizScene?.quiz_options ?? [];
  const isAnswerCorrect =
    selectedAnswer !== null && (quizOptions[selectedAnswer]?.is_correct ?? false);

  /**
   * Pick an answer. The selection is NEVER auto-cleared — the child must
   * explicitly click "Try Again" to reset, which prevents the race condition
   * where the "Complete Mission" button disappears after 1.5 s.
   */
  const handleAnswer = (i: number) => {
    // Don't allow re-selection after a correct answer is locked in
    if (isAnswerCorrect) return;
    // Don't allow re-selection while the wrong-answer feedback is showing
    if (showResult && !isAnswerCorrect) return;

    const newAttempts = attempts + 1;
    setSelectedAnswer(i);
    setShowResult(true);
    setAttempts(newAttempts);
    setShowHint(false);

    if (quizOptions[i]?.is_correct) {
      // Correct — reward XP + streak, keep selection visible
      setXp((prev) => prev + 5);
      setStreak((prev) => prev + 1);
    } else {
      // Wrong — reset streak, show hint after a short delay
      setStreak(0);
      setTimeout(() => setShowHint(true), 600);
    }

    scheduleAutosave(currentScene, completedScenes, newAttempts);
  };

  // Mastery score: 100 if correct, otherwise decays with each wrong attempt
  const masteryScore = isAnswerCorrect
    ? 100
    : Math.max(0, 100 - attempts * 20);

  const handleComplete = () => {
    if (!isAnswerCorrect) return;
    if (masteryScore < MASTERY_THRESHOLD) return;
    completeMutation.mutate(masteryScore, {
      onSuccess: () => setIsComplete(true),
    });
  };

  /** Reset quiz so the child can pick again after a wrong answer. */
  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading || !lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-destructive" />
          <h2 className="font-display text-xl font-bold">Could not load lesson</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {(error as Error)?.message ?? "Please try again later."}
          </p>
          <Link to={`/lessons?childId=${childId}`} className="mt-4 inline-block">
            <Button variant="explorer-outline">Back to Map</Button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Celebration overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="mx-4 w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-lg"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold animate-celebrate">
                <PartyPopper className="h-10 w-10 text-accent-foreground" />
              </div>

              <h2 className="mb-2 font-display text-3xl font-bold text-gradient-coral">
                Mission Complete 🚀
              </h2>
              <p className="mb-4 text-muted-foreground">
                Amazing job, Explorer! You&apos;ve earned a new badge!
              </p>

              {/* Mastery bar */}
              <div className="mb-4 rounded-xl bg-muted p-3">
                <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Mastery</span>
                  <span className="text-explorer-green">100%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full rounded-full bg-gradient-green"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>

              {/* XP summary */}
              <p className="mb-3 text-xs text-muted-foreground">
                Completed in{" "}
                <span className="font-bold text-foreground">{attempts}</span>{" "}
                {attempts === 1 ? "attempt" : "attempts"}
                {" · "}
                <span className="font-bold text-explorer-gold">
                  +{10 + 5 + (attempts === 1 ? 5 : 0)} XP earned
                  {attempts === 1 && " (perfect bonus!)"}
                </span>
              </p>

              {earnedBadge && (
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/30 px-4 py-2">
                  <Star className="h-5 w-5 text-explorer-gold" />
                  <span className="font-display font-bold">{earnedBadge}</span>
                </div>
              )}

              <div className="flex gap-3">
                <Link to={`/lessons?childId=${childId}`} className="flex-1">
                  <Button variant="explorer-outline" className="w-full">
                    <Trophy className="h-4 w-4" /> Back to Map
                  </Button>
                </Link>

                {/* Navigate directly to next lesson if one exists */}
                {nextLessonId ? (
                  <button
                    type="button"
                    className="flex-1"
                    onClick={() =>
                      navigate(`/lesson/${nextLessonId}?childId=${childId}`)
                    }
                  >
                    <Button variant="explorer" className="w-full">
                      Next Mission <ArrowRight className="h-4 w-4" />
                    </Button>
                  </button>
                ) : (
                  <Link to={`/lessons?childId=${childId}`} className="flex-1">
                    <Button variant="explorer" className="w-full">
                      View Map <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Back + autosave indicator */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            to={`/lessons?childId=${childId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Explorer Map
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Save className="h-3.5 w-3.5" />
            <span>
              {saveProgressMutation.isPending ? "Saving…" : "Progress saved"}
            </span>
          </div>
        </div>

        {/* Scene progress bar */}
        <div className="mb-6 flex items-center gap-2">
          {contentScenes.map((scene, i) => {
            const active = i === currentScene && !allScenesComplete;
            const done = isSceneCompleted(scene);
            return (
              <div
                key={scene.id}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className={`h-1.5 w-full rounded-full transition-colors ${
                    done
                      ? "bg-explorer-green"
                      : active
                        ? "bg-gradient-coral"
                        : "bg-muted"
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  {scene.icon}
                </span>
              </div>
            );
          })}
          <span className="ml-2 text-xs text-muted-foreground">~7 min</span>
        </div>

        {/* Lesson title */}
        <div className="mb-4">
          <h1 className="font-display text-2xl font-bold">
            {lesson.icon} {lesson.title}
          </h1>
          <p className="text-sm text-muted-foreground">{lesson.description}</p>
        </div>

        {/* Video embed */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-muted shadow-card">
          {lesson.video_url ? (
            <div className="relative aspect-video w-full">
              <iframe
                src={lesson.video_url}
                title={`${lesson.title} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full rounded-2xl border-0"
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 text-muted-foreground">
              <span className="text-4xl">🎬</span>
              <p className="font-display font-bold">Video Coming Soon</p>
              <p className="text-xs">
                Watch on{" "}
                <a
                  href="https://youtube.com/@futureexplorertv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-explorer-coral underline"
                >
                  @FutureExplorerTV
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Accessibility + XP row */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={toggleTTS}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              isTextToSpeechEnabled
                ? "bg-explorer-blue text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            aria-label={
              isTextToSpeechEnabled
                ? "Disable text to speech"
                : "Enable text to speech"
            }
          >
            {isTextToSpeechEnabled ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
            {isTextToSpeechEnabled ? "TTS On" : "TTS Off"}
          </button>

          <button
            type="button"
            onClick={() => setIsDyslexiaMode((p) => !p)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              isDyslexiaMode
                ? "bg-explorer-gold text-accent-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            aria-label={isDyslexiaMode ? "Disable easy read" : "Enable easy read"}
          >
            <span className="text-base">📖</span>
            {isDyslexiaMode ? "Easy Read On" : "Easy Read Off"}
          </button>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-accent/30 px-3 py-1">
              <Zap className="h-4 w-4 text-explorer-gold" />
              <span className="font-bold text-sm">{xp} XP</span>
            </div>
            {streak > 1 && (
              <div className="flex items-center gap-2 rounded-full bg-explorer-green/20 px-3 py-1">
                <span className="text-sm">🔥</span>
                <span className="font-bold text-sm">{streak} Streak</span>
              </div>
            )}
          </div>
        </div>

        {/* Learning chunks */}
        <div className="mb-8">
          <h2 className="mb-4 font-display text-xl font-bold">
            Learning Adventure
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {contentScenes.map((scene, index) => {
              const done = isSceneCompleted(scene);
              const locked = isSceneLocked(index);

              return (
                <motion.div
                  key={scene.id}
                  className={`rounded-2xl bg-card p-6 shadow-card border-2 transition-all ${
                    done
                      ? "border-explorer-green bg-explorer-green/5"
                      : locked
                        ? "border-muted opacity-60"
                        : "border-border/50 hover:border-explorer-coral hover:shadow-lg cursor-pointer"
                  }`}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={index + 1}
                  onClick={() => !locked && setCurrentScene(index)}
                >
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{scene.icon}</span>
                      <h3
                        className={`font-display text-lg font-semibold text-foreground ${
                          isDyslexiaMode ? "font-dyslexia" : ""
                        }`}
                      >
                        {scene.title}
                      </h3>
                      {done && (
                        <CheckCircle className="h-5 w-5 text-explorer-green ml-auto" />
                      )}
                      {locked && (
                        <Lock className="h-5 w-5 text-muted-foreground ml-auto" />
                      )}
                    </div>
                    <p
                      className={`text-sm text-muted-foreground ${
                        isDyslexiaMode ? "font-dyslexia leading-relaxed" : ""
                      }`}
                    >
                      {scene.content}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!locked && !done) {
                          completeScene(scene.order_index);
                          speakText(`${scene.title}. ${scene.content}`);
                        }
                      }}
                      disabled={locked || done}
                      className={`text-sm font-bold uppercase tracking-wider transition-all rounded-lg px-3 py-2 min-h-[44px] ${
                        done
                          ? "text-explorer-green bg-explorer-green/10"
                          : locked
                            ? "text-muted-foreground bg-muted cursor-not-allowed"
                            : "text-explorer-coral bg-explorer-coral/10 hover:bg-explorer-coral/20"
                      }`}
                      aria-label={`Scene ${index + 1}: ${scene.title}`}
                    >
                      {done ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" /> Done
                        </span>
                      ) : locked ? (
                        <span className="flex items-center gap-2">
                          <Lock className="h-4 w-4" /> Locked
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Play className="h-4 w-4" /> Start
                        </span>
                      )}
                    </button>
                    <span className="text-xs text-muted-foreground">2 min</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Quiz — shown after all content scenes are done ─────────────── */}
          <AnimatePresence>
            {allScenesComplete && quizScene && (
              <motion.div
                className="mt-6"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={1}
              >
                <div className="rounded-2xl bg-card p-6 shadow-card">
                  {/* Quiz header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{quizScene.icon}</span>
                      <h2 className="font-display text-xl font-bold">
                        {quizScene.title}
                      </h2>
                    </div>
                    {/* Attempts counter — always visible once the first attempt is made */}
                    {attempts > 0 && (
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                        Attempt {attempts}
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-base font-bold mb-4 ${isDyslexiaMode ? "font-dyslexia" : ""}`}
                  >
                    {quizScene.quiz_question}
                  </p>

                  {/* Answer options */}
                  <div className="space-y-3">
                    {quizOptions.map((opt, i) => {
                      const isSelected = selectedAnswer === i;
                      const isThisCorrect = opt.is_correct;

                      let optClass =
                        "bg-muted hover:bg-muted/80 cursor-pointer";
                      if (showResult && isSelected) {
                        optClass = isThisCorrect
                          ? "bg-explorer-green/10 ring-2 ring-explorer-green cursor-default"
                          : "bg-destructive/10 ring-2 ring-destructive cursor-default";
                      } else if (isAnswerCorrect) {
                        // Lock all options once correct answer is confirmed
                        optClass = "bg-muted opacity-50 cursor-default";
                      }

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAnswer(i)}
                          disabled={isAnswerCorrect}
                          className={`w-full flex items-center gap-3 rounded-xl p-4 text-left transition-all min-h-[52px] ${optClass}`}
                          aria-label={`Option ${i + 1}: ${opt.text}`}
                        >
                          {showResult && isSelected ? (
                            isThisCorrect ? (
                              <CheckCircle className="h-5 w-5 text-explorer-green shrink-0" />
                            ) : (
                              <XCircle className="h-5 w-5 text-destructive shrink-0" />
                            )
                          ) : (
                            <span className="h-5 w-5 shrink-0 rounded-full border-2 border-border/60" />
                          )}
                          <span
                            className={`font-body font-semibold ${isDyslexiaMode ? "font-dyslexia" : ""}`}
                          >
                            {opt.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback */}
                  <AnimatePresence mode="wait">
                    {showResult && (
                      <motion.div
                        key={String(isAnswerCorrect)}
                        className="mt-4"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {isAnswerCorrect ? (
                          <div className="flex items-center gap-2 rounded-xl bg-explorer-green/10 p-3 text-explorer-green">
                            <CheckCircle className="h-5 w-5 shrink-0" />
                            <span className="font-bold">
                              Great job 🌟 +{attempts === 1 ? "10" : "5"} XP
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-destructive">
                              <XCircle className="h-5 w-5 shrink-0" />
                              <span className="font-bold">
                                Try again 👀
                              </span>
                            </div>
                            {showHint &&
                              selectedAnswer !== null &&
                              quizOptions[selectedAnswer]?.hint && (
                                <motion.div
                                  className="rounded-xl bg-explorer-blue/10 p-3"
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                >
                                  <div className="flex items-start gap-2">
                                    <Lightbulb className="h-4 w-4 text-explorer-blue mt-0.5 shrink-0" />
                                    <p
                                      className={`text-sm text-muted-foreground ${
                                        isDyslexiaMode
                                          ? "font-dyslexia leading-relaxed"
                                          : ""
                                      }`}
                                    >
                                      {quizOptions[selectedAnswer].hint}
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action button */}
                  <div className="mt-4">
                    {/* No answer selected yet */}
                    {selectedAnswer === null && (
                      <Button
                        variant="explorer-outline"
                        size="lg"
                        className="w-full min-h-[52px] opacity-50 cursor-not-allowed"
                        disabled
                      >
                        Pick an answer above
                      </Button>
                    )}

                    {/* Wrong answer selected — allow retry */}
                    {selectedAnswer !== null && !isAnswerCorrect && (
                      <Button
                        variant="explorer-outline"
                        size="lg"
                        className="w-full min-h-[52px]"
                        onClick={handleRetry}
                      >
                        <RotateCcw className="h-4 w-4" /> Try Again
                      </Button>
                    )}

                    {/* Correct answer selected — complete mission */}
                    {isAnswerCorrect && (
                      <Button
                        variant="explorer"
                        size="lg"
                        className="w-full min-h-[52px]"
                        disabled={completeMutation.isPending}
                        onClick={handleComplete}
                      >
                        {completeMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Complete Mission{" "}
                            <PartyPopper className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to map button (visible while still doing scenes) */}
          {!allScenesComplete && (
            <motion.div
              className="mt-8 text-center"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
            >
              <Link to={`/lessons?childId=${childId}`}>
                <Button variant="explorer-outline" size="lg" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Back to Explorer Map
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
