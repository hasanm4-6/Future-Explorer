import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
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
  Unlock,
  Trophy,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { sessionManager } from "@/lib/session";
import { Progress } from "@/components/ui/progress";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const learningChunks = [
  {
    id: 1,
    title: "Meet Robi!",
    text: "Robi is a friendly robot who needs YOUR help to understand the world.",
    shortText: "Help Robi learn!",
    icon: "🤖",
    duration: "2 min",
    completed: false,
    locked: false,
  },
  {
    id: 2,
    title: "What Does Robi See?",
    text: "Robi looks at pictures and tries to guess what's in them.",
    shortText: "Robi sees pictures!",
    icon: "👁️",
    duration: "2 min",
    completed: false,
    locked: true,
  },
  {
    id: 3,
    title: "Patterns are Key",
    text: "Just like you learn letters, Robi learns by finding patterns.",
    shortText: "Patterns help Robi!",
    icon: "🔍",
    duration: "2 min",
    completed: false,
    locked: true,
  },
  {
    id: 4,
    title: "Let's Practice!",
    text: "Time to help Robi practice what we've learned.",
    shortText: "Practice with Robi!",
    icon: "⭐",
    duration: "1 min",
    completed: false,
    locked: true,
  },
];

const quizQuestion = {
  question: "How does an AI learn new things?",
  options: [
    {
      text: "By reading books",
      correct: false,
      hint: "Think about what computers do best — they look at lots of examples!",
    },
    { text: "By finding patterns in examples", correct: true, hint: "" },
    {
      text: "By asking other robots",
      correct: false,
      hint: "AI doesn't talk to other robots. It learns from data and patterns.",
    },
    {
      text: "By magic!",
      correct: false,
      hint: "It might seem like magic, but AI uses math and patterns!",
    },
  ],
};

const MASTERY_THRESHOLD = 80;

// Mock user and child IDs - in production, these would come from auth/context
const mockUserId = "user123";
const mockChildId = "child123";

const LessonDetail = () => {
  const { id } = useParams();
  const [currentChunk, setCurrentChunk] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
  const [isDyslexiaMode, setIsDyslexiaMode] = useState(false);
  const [chunks, setChunks] = useState(learningChunks);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Track lesson activity when component mounts
  useEffect(() => {
    // api.trackLessonActivity(mockUserId, mockChildId, true);

    // Start autosave for this lesson
    const lessonId = id || "unknown";
    sessionManager.startAutosave(lessonId);

    // Check for existing progress to recover
    const recoveredProgress = sessionManager.recoverLessonProgress(lessonId);
    if (recoveredProgress) {
      console.log("[Lesson] Recovered progress:", recoveredProgress);
      // Type assertion to handle extended progress properties
      const extendedProgress = recoveredProgress as any;
      setCurrentChunk(extendedProgress.currentChunk || 0);
      setShowQuiz(recoveredProgress.showQuiz);
      setAttempts(recoveredProgress.attempts);
      setXp(extendedProgress.xp || 0);
      setStreak(extendedProgress.streak || 0);
      if (extendedProgress.selectedAnswer !== null) {
        setSelectedAnswer(extendedProgress.selectedAnswer);
      }
      if (extendedProgress.chunks) {
        setChunks(extendedProgress.chunks);
      }
    }

    return () => {
      // Cleanup autosave when component unmounts
      sessionManager.stopAutosave(lessonId);
    };
  }, [id]);

  // Track lesson completion when mastery is achieved
  useEffect(() => {
    if (isComplete) {
      // api.updateLessonProgress(mockUserId, mockChildId, {
      //   lessonsCompleted: 1,
      //   achievements: ["Smart Helper Badge"],
      //   weeklyMinutes: 5,
      //   currentMission: "What is AI?",
      // });

      // Clear autosave data for completed lesson
      const lessonId = id || "unknown";
      sessionManager.clearAutosave(lessonId);
    }
  }, [isComplete, id]);

  // Text-to-speech functionality
  const speakText = (text: string) => {
    if (!isTextToSpeechEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const toggleTextToSpeech = () => {
    setIsTextToSpeechEnabled(!isTextToSpeechEnabled);
    if (!isTextToSpeechEnabled) {
      window.speechSynthesis.cancel();
    }
  };

  const completeChunk = (chunkId: number) => {
    setChunks((prev) =>
      prev.map((chunk) =>
        chunk.id === chunkId
          ? { ...chunk, completed: true }
          : chunk.id === chunkId + 1
            ? { ...chunk, locked: false }
            : chunk,
      ),
    );
    setXp((prev) => prev + 25);
    setStreak((prev) => prev + 1);

    // Auto-advance to next chunk if available
    const nextChunk = chunks.find((c) => c.id === chunkId + 1);
    if (nextChunk && !nextChunk.locked) {
      setTimeout(() => setCurrentChunk(chunkId), 500);
    }
  };

  const masteryScore =
    selectedAnswer !== null && quizQuestion.options[selectedAnswer]?.correct
      ? 100
      : Math.min(60, attempts * 20);

  const handleAnswer = (i: number) => {
    setSelectedAnswer(i);
    setShowResult(true);
    setAttempts((a) => a + 1);
    setShowHint(false);

    // Instant feedback with XP and streak
    if (quizQuestion.options[i].correct) {
      setXp((prev) => prev + 50);
      setStreak((prev) => prev + 1);
      // Show success feedback immediately
      setTimeout(() => {
        setShowResult(false);
        setSelectedAnswer(null);
      }, 1500);
    } else {
      setStreak(0); // Reset streak on wrong answer
    }
  };

  const handleComplete = () => {
    // Check mastery threshold before completing
    if (masteryScore >= MASTERY_THRESHOLD) {
      setIsComplete(true);
    } else {
      // Show mastery not achieved message and allow retry
      setShowResult(false);
      setSelectedAnswer(null);
      setShowHint(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Celebration overlay */}
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
                Mission Complete! 🎉
              </h2>
              <p className="mb-2 text-muted-foreground">
                Amazing job, Explorer! You've earned a new badge!
              </p>

              {/* Mastery Bar */}
              <div className="mb-4 rounded-xl bg-muted p-3">
                <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Mastery</span>
                  <span className="text-explorer-green">100%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-gradient-green"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/30 px-4 py-2">
                <Star className="h-5 w-5 text-explorer-gold" />
                <span className="font-display font-bold">
                  Smart Helper Badge
                </span>
              </div>
              <div className="flex gap-3">
                <Link to="/lessons" className="flex-1">
                  <Button variant="explorer-outline" className="w-full">
                    Back to Map
                  </Button>
                </Link>
                <Link to="/lessons" className="flex-1">
                  <Button variant="explorer" className="w-full">
                    Next Mission <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/lessons"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Explorer Map
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Save className="h-3.5 w-3.5" />
            <span>Progress saved</span>
          </div>
        </div>

        {/* Segment indicator */}
        <div
          className="mb-6 flex items-center gap-2"
          data-current-chunk={currentChunk}
          data-quiz-active={showQuiz}
          data-attempts={attempts}
        >
          {chunks.map((chunk, i) => {
            const active = i === currentChunk && !showQuiz;
            const completed = chunk.completed;
            return (
              <div
                key={chunk.id}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className={`h-1.5 w-full rounded-full transition-colors ${
                    completed
                      ? "bg-explorer-green"
                      : active
                        ? "bg-gradient-coral"
                        : "bg-muted"
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  {chunk.icon}
                </span>
              </div>
            );
          })}
          <span className="text-xs text-muted-foreground ml-2">~7 min</span>
        </div>

        {/* Accessibility Controls */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={toggleTextToSpeech}
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
            onClick={() => setIsDyslexiaMode(!isDyslexiaMode)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              isDyslexiaMode
                ? "bg-explorer-gold text-accent-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            aria-label={
              isDyslexiaMode
                ? "Disable dyslexia friendly mode"
                : "Enable dyslexia friendly mode"
            }
          >
            <span className="text-base">📖</span>
            {isDyslexiaMode ? "Easy Read On" : "Easy Read Off"}
          </button>

          {/* XP and Streak Display */}
          <div className="flex items-center gap-4 ml-auto">
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

        {/* Video Player */}
        <motion.div className="mb-8 flex aspect-video items-center justify-center rounded-2xl bg-gradient-blue shadow-card">
          {/* Learning Chunks */}
          <div className="mb-8">
            <h2 className="mb-4 font-display text-xl font-bold">
              Learning Adventure
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {chunks.map((chunk, index) => (
                <motion.div
                  key={chunk.id}
                  className={`rounded-2xl bg-card p-6 shadow-card border-2 transition-all ${
                    chunk.completed
                      ? "border-explorer-green bg-explorer-green/5"
                      : chunk.locked
                        ? "border-muted opacity-60"
                        : "border-border/50 hover:border-explorer-coral hover:shadow-lg cursor-pointer"
                  }`}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={index + 1}
                  onClick={() => !chunk.locked && setCurrentChunk(index)}
                >
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{chunk.icon}</span>
                      <h3
                        className={`font-display text-lg font-semibold text-foreground ${
                          isDyslexiaMode ? "font-dyslexia" : ""
                        }`}
                      >
                        {chunk.title}
                      </h3>
                      {chunk.completed && (
                        <CheckCircle className="h-5 w-5 text-explorer-green ml-auto" />
                      )}
                      {chunk.locked && (
                        <Lock className="h-5 w-5 text-muted-foreground ml-auto" />
                      )}
                    </div>
                    <p
                      className={`text-sm text-muted-foreground ${
                        isDyslexiaMode ? "font-dyslexia leading-relaxed" : ""
                      }`}
                    >
                      {chunk.shortText}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!chunk.locked && !chunk.completed) {
                          completeChunk(chunk.id);
                          speakText(chunk.title + ". " + chunk.text);
                        }
                      }}
                      disabled={chunk.locked || chunk.completed}
                      className={`text-sm font-bold uppercase tracking-wider transition-all rounded-lg px-3 py-2 min-h-[44px] ${
                        chunk.completed
                          ? "text-explorer-green bg-explorer-green/10"
                          : chunk.locked
                            ? "text-muted-foreground bg-muted cursor-not-allowed"
                            : "text-explorer-coral bg-explorer-coral/10 hover:bg-explorer-coral/20"
                      }`}
                      aria-label={`Learning chunk ${index + 1}: ${chunk.title}`}
                    >
                      {chunk.completed ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" /> Done
                        </span>
                      ) : chunk.locked ? (
                        <span className="flex items-center gap-2">
                          <Lock className="h-4 w-4" /> Locked
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Play className="h-4 w-4" /> Start
                        </span>
                      )}
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {chunk.duration}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quiz Section */}
            <AnimatePresence>
              {chunks[3]?.completed && (
                <motion.div
                  className="max-w-3xl mx-auto"
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={1}
                >
                  <div className="rounded-2xl bg-card p-6 shadow-card">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">🎯</span>
                      <h2 className="font-display text-xl font-bold">
                        Quick Quiz!
                      </h2>
                    </div>
                    <p
                      className={`text-sm text-muted-foreground mb-4 ${
                        isDyslexiaMode ? "font-dyslexia leading-relaxed" : ""
                      }`}
                    >
                      Let's see what you've learned about Robi!
                    </p>
                    <div className="space-y-4">
                      {quizQuestion.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i)}
                          disabled={showResult}
                          className={`w-full flex items-center gap-3 rounded-xl p-4 text-left transition-all min-h-[52px] ${
                            showResult && selectedAnswer === i
                              ? opt.correct
                                ? "bg-explorer-green/10 ring-2 ring-explorer-green"
                                : "bg-destructive/10 ring-2 ring-destructive"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                          aria-label={`Quiz option ${i + 1}: ${opt.text}`}
                        >
                          <span className="flex items-center gap-3">
                            {showResult && selectedAnswer === i ? (
                              opt.correct ? (
                                <CheckCircle className="h-5 w-5 text-explorer-green" />
                              ) : (
                                <XCircle className="h-5 w-5 text-destructive" />
                              )
                            ) : null}
                            <span
                              className={`font-body font-semibold ${
                                isDyslexiaMode ? "font-dyslexia" : ""
                              }`}
                            >
                              {opt.text}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Feedback */}
                    {showResult && (
                      <motion.div
                        className="mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {selectedAnswer !== null &&
                        quizQuestion.options[selectedAnswer]?.correct ? (
                          <motion.div
                            className="flex items-center gap-2 text-explorer-green"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            <CheckCircle className="h-5 w-5 text-explorer-green" />
                            <span className="font-bold">
                              Awesome! That's correct! +50 XP
                            </span>
                          </motion.div>
                        ) : (
                          <div className="space-y-3">
                            <motion.div
                              className="flex items-center gap-2 text-destructive"
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                            >
                              <XCircle className="h-5 w-5 text-destructive" />
                              <span className="font-bold">
                                Not quite right! Try again!
                              </span>
                            </motion.div>
                            {showHint && (
                              <motion.div
                                className="rounded-xl bg-explorer-blue/10 p-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                <p className="text-sm text-muted-foreground mb-2">
                                  Here's a hint:
                                </p>
                                <div className="flex items-start gap-2">
                                  <Lightbulb className="h-4 w-4 text-explorer-blue mt-0.5 shrink-0" />
                                  <p
                                    className={`text-sm text-muted-foreground ${
                                      isDyslexiaMode
                                        ? "font-dyslexia leading-relaxed"
                                        : ""
                                    }`}
                                  >
                                    {selectedAnswer !== null
                                      ? quizQuestion.options[selectedAnswer]
                                          ?.hint
                                      : ""}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Action Button */}
                    <Button
                      variant={
                        selectedAnswer !== null &&
                        quizQuestion.options[selectedAnswer]?.correct
                          ? "explorer"
                          : "explorer-outline"
                      }
                      size="lg"
                      className="mt-4 w-full min-h-[52px]"
                      onClick={() => {
                        if (
                          selectedAnswer !== null &&
                          quizQuestion.options[selectedAnswer]?.correct
                        ) {
                          handleComplete();
                        } else {
                          handleRetry();
                        }
                      }}
                      aria-label={
                        selectedAnswer !== null &&
                        quizQuestion.options[selectedAnswer]?.correct
                          ? "Complete mission"
                          : "Try again"
                      }
                    >
                      {selectedAnswer !== null &&
                      quizQuestion.options[selectedAnswer]?.correct ? (
                        <>
                          Complete Mission <PartyPopper className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Try Again <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue Button */}
            <motion.div
              className="mt-8 text-center"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
            >
              <Link to="/lessons">
                <Button variant="explorer-outline" size="lg" className="gap-2">
                  <Play className="h-4 w-4" />
                  Continue to Next Mission
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LessonDetail;
