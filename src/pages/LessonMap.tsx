import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle, Star, ArrowRight, Trophy, Compass } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

type LessonStatus = "completed" | "unlocked" | "locked";

interface Lesson {
  id: number;
  title: string;
  status: LessonStatus;
  badge?: string;
}

const lessons: Lesson[] = [
  { id: 1, title: "What is AI?", status: "completed", badge: "AI Curious" },
  { id: 2, title: "How Computers Learn", status: "completed", badge: "Pattern Finder" },
  { id: 3, title: "Patterns Everywhere", status: "completed", badge: "Data Detective" },
  { id: 4, title: "Teaching a Robot", status: "completed", badge: "Robot Trainer" },
  { id: 5, title: "Smart Helpers", status: "unlocked" },
  { id: 6, title: "AI in Your World", status: "locked" },
  { id: 7, title: "Create with AI", status: "locked" },
  { id: 8, title: "Future of AI", status: "locked" },
];

// Check if lesson should be unlocked based on previous lesson completion
const isLessonUnlocked = (lessonId: number): boolean => {
  if (lessonId === 1) return true; // First lesson is always unlocked
  const previousLesson = lessons.find(l => l.id === lessonId - 1);
  return previousLesson?.status === "completed";
};

const statusConfig = {
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

const LessonMap = () => {
  const completed = lessons.filter((l) => l.status === "completed").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-3xl">🦊</div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold">Mia's Explorer Map</h1>
            <p className="text-sm text-muted-foreground">Level 1 · {completed}/{lessons.length} missions complete</p>
            <div className="mt-2 h-3 w-full max-w-xs overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-coral transition-all duration-700"
                style={{ width: `${(completed / lessons.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-accent/30 px-4 py-2">
            <Trophy className="h-5 w-5 text-explorer-gold" />
            <span className="font-display font-bold">{completed} Badges</span>
          </div>
        </motion.div>

        {/* Lesson Map */}
        <div className="relative mx-auto max-w-md">
          {/* Path line */}
          <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-border" />

          <div className="relative space-y-8">
            {lessons.map((lesson, i) => {
              const config = statusConfig[lesson.status];
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={lesson.id}
                  className={`relative flex items-center gap-4 ${isEven ? "flex-row" : "flex-row-reverse"}`}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  {/* Card side */}
                  <div className={`flex-1 ${isEven ? "text-right" : "text-left"}`}>
                    <div
                      className={`inline-block rounded-2xl bg-card p-4 shadow-card transition-all ${
                        lesson.status !== "locked" ? "hover:shadow-card-hover hover:-translate-y-0.5" : "opacity-60"
                      }`}
                    >
                      <p className="text-xs text-muted-foreground">Mission {lesson.id}</p>
                      <h3 className="font-display font-bold">{lesson.title}</h3>
                      {lesson.badge && (
                        <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/40 px-2 py-0.5 text-xs font-bold text-accent-foreground">
                          <Star className="h-3 w-3" /> {lesson.badge}
                        </div>
                      )}
                      {lesson.status === "unlocked" && isLessonUnlocked(lesson.id) ? (
                        <Link to={`/lesson/${lesson.id}`}>
                          <Button variant="explorer" size="sm" className="mt-2 w-full min-h-[44px]">
                            Start Mission <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      ) : lesson.status === "locked" ? (
                        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <Lock className="h-3 w-3" />
                          <span>Complete previous mission</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Node */}
                  <div className={`${config.nodeClass} z-10 h-14 w-14 shrink-0`}>
                    {config.icon}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />
                </motion.div>
              );
            })}
          </div>

          {/* Final goal */}
          <motion.div
            className="relative mt-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold shadow-lg">
              <Compass className="h-10 w-10 text-accent-foreground" />
            </div>
          </motion.div>
          <p className="mt-4 text-center font-display font-bold text-muted-foreground">Level 1 Complete!</p>
        </div>
      </div>
    </div>
  );
};

export default LessonMap;
