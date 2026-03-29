import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
  Plus,
  Search,
  BarChart3,
  Clock,
  Star,
  ChevronRight,
  GraduationCap,
  School,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const classrooms = [
  { id: 1, name: "Class 2A – AI Explorers", grade: "2nd Grade", studentCount: 24, avgProgress: 62 },
  { id: 2, name: "Class 3B – Tech Pioneers", grade: "3rd Grade", studentCount: 18, avgProgress: 45 },
];

const students = [
  { id: 1, name: "Mia Chen", avatar: "🦊", age: 7, classroomId: 1, lessonsCompleted: 6, totalLessons: 8, badges: 5, lastActive: "Today", streak: 4 },
  { id: 2, name: "Leo Park", avatar: "🐯", age: 8, classroomId: 1, lessonsCompleted: 4, totalLessons: 8, badges: 3, lastActive: "Today", streak: 2 },
  { id: 3, name: "Zara Ali", avatar: "🦋", age: 7, classroomId: 1, lessonsCompleted: 8, totalLessons: 8, badges: 8, lastActive: "Yesterday", streak: 7 },
  { id: 4, name: "Noah Kim", avatar: "🐼", age: 7, classroomId: 1, lessonsCompleted: 3, totalLessons: 8, badges: 2, lastActive: "2 days ago", streak: 0 },
  { id: 5, name: "Ava Singh", avatar: "🦄", age: 8, classroomId: 1, lessonsCompleted: 5, totalLessons: 8, badges: 4, lastActive: "Today", streak: 3 },
  { id: 6, name: "Ethan Russo", avatar: "🐉", age: 7, classroomId: 1, lessonsCompleted: 7, totalLessons: 8, badges: 6, lastActive: "Today", streak: 5 },
  { id: 7, name: "Lily Tanaka", avatar: "🌸", age: 8, classroomId: 2, lessonsCompleted: 4, totalLessons: 8, badges: 3, lastActive: "Today", streak: 2 },
  { id: 8, name: "Omar Hassan", avatar: "🦁", age: 7, classroomId: 2, lessonsCompleted: 2, totalLessons: 8, badges: 1, lastActive: "3 days ago", streak: 0 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

const TeacherDashboard = () => {
  const [selectedClassroom, setSelectedClassroom] = useState<number>(1);
  const [search, setSearch] = useState("");

  const filteredStudents = students
    .filter((s) => s.classroomId === selectedClassroom)
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const currentClass = classrooms.find((c) => c.id === selectedClassroom)!;
  const classStudents = students.filter((s) => s.classroomId === selectedClassroom);
  const totalBadges = classStudents.reduce((sum, s) => sum + s.badges, 0);
  const avgCompletion = Math.round(classStudents.reduce((sum, s) => sum + (s.lessonsCompleted / s.totalLessons) * 100, 0) / classStudents.length);
  const activeToday = classStudents.filter((s) => s.lastActive === "Today").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-blue">
                <School className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold">Teacher Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Track your classrooms and student progress.</p>
          </div>
          <Button variant="explorer" size="sm">
            <Plus className="h-4 w-4" /> New Classroom
          </Button>
        </motion.div>

        {/* Classroom Selector */}
        <motion.div className="mb-6 flex gap-3 overflow-x-auto pb-2" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          {classrooms.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClassroom(c.id)}
              className={`flex min-w-[220px] items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                selectedClassroom === c.id
                  ? "border-secondary bg-secondary/10 shadow-card"
                  : "border-border bg-card hover:border-secondary/40"
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-blue">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="font-display font-bold text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.studentCount} students · {c.grade}</p>
              </div>
            </button>
          ))}
          <button className="flex min-w-[180px] items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-4 text-muted-foreground transition-colors hover:border-secondary/40 hover:text-foreground">
            <Plus className="h-5 w-5" />
            <span className="font-display font-semibold text-sm">Add Classroom</span>
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div className="mb-8 grid gap-4 sm:grid-cols-4" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
          {[
            { icon: Users, label: "Students", value: currentClass.studentCount, gradient: "bg-gradient-blue" },
            { icon: TrendingUp, label: "Avg. Completion", value: `${avgCompletion}%`, gradient: "bg-gradient-green" },
            { icon: Trophy, label: "Badges Earned", value: totalBadges, gradient: "bg-gradient-gold" },
            { icon: Clock, label: "Active Today", value: activeToday, gradient: "bg-gradient-coral" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.gradient}`}>
                <stat.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tabs: Students / Analytics */}
        <Tabs defaultValue="students" className="w-full">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <TabsList className="mb-6 bg-muted/60">
              <TabsTrigger value="students" className="font-display font-semibold">
                <Users className="mr-1.5 h-4 w-4" /> Students
              </TabsTrigger>
              <TabsTrigger value="analytics" className="font-display font-semibold">
                <BarChart3 className="mr-1.5 h-4 w-4" /> Class Analytics
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Students Tab */}
          <TabsContent value="students">
            <motion.div className="mb-4 flex items-center gap-3" initial="hidden" animate="visible" variants={fadeUp} custom={4}>
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students…"
                  className="rounded-xl pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStudents.map((student, i) => {
                const pct = Math.round((student.lessonsCompleted / student.totalLessons) * 100);
                const isComplete = pct === 100;
                return (
                  <motion.div
                    key={student.id}
                    className="group rounded-2xl bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={i + 5}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl">
                          {student.avatar}
                        </div>
                        <div>
                          <h3 className="font-display font-bold">{student.name}</h3>
                          <p className="text-xs text-muted-foreground">Age {student.age} · {student.lastActive}</p>
                        </div>
                      </div>
                      {student.streak > 0 && (
                        <div className="flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-1">
                          <span className="text-sm">🔥</span>
                          <span className="text-xs font-bold text-accent-foreground">{student.streak}d</span>
                        </div>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Missions</span>
                      <span className="font-bold">{student.lessonsCompleted}/{student.totalLessons}</span>
                    </div>
                    <div className="mb-3 h-3 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isComplete ? "bg-gradient-green" : "bg-gradient-coral"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="h-4 w-4 text-explorer-gold" />
                        <span className="text-xs font-semibold">{student.badges} badges</span>
                      </div>
                      {isComplete && (
                        <span className="flex items-center gap-1 text-xs font-bold text-explorer-green">
                          <Star className="h-3.5 w-3.5" /> Complete!
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredStudents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="font-display font-semibold text-muted-foreground">No students found</p>
                <p className="text-sm text-muted-foreground">Try a different search term.</p>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Lesson Breakdown */}
              <motion.div className="rounded-2xl bg-card p-6 shadow-card" initial="hidden" animate="visible" variants={fadeUp} custom={4}>
                <h3 className="mb-4 font-display text-lg font-bold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-secondary" /> Lesson Completion
                </h3>
                <div className="space-y-3">
                  {Array.from({ length: 8 }, (_, i) => {
                    const lessonNum = i + 1;
                    const completed = classStudents.filter((s) => s.lessonsCompleted >= lessonNum).length;
                    const pct = Math.round((completed / classStudents.length) * 100);
                    return (
                      <div key={lessonNum}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-semibold font-body">Mission {lessonNum}</span>
                          <span className="text-xs text-muted-foreground">{completed}/{classStudents.length} students</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-gradient-blue transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Leaderboard */}
              <motion.div className="rounded-2xl bg-card p-6 shadow-card" initial="hidden" animate="visible" variants={fadeUp} custom={5}>
                <h3 className="mb-4 font-display text-lg font-bold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-explorer-gold" /> Top Explorers
                </h3>
                <div className="space-y-3">
                  {[...classStudents]
                    .sort((a, b) => b.badges - a.badges)
                    .slice(0, 5)
                    .map((student, i) => (
                      <div key={student.id} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-gold text-xs font-bold text-primary-foreground font-display">
                          {i + 1}
                        </span>
                        <span className="text-xl">{student.avatar}</span>
                        <div className="flex-1">
                          <p className="font-display font-bold text-sm">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.badges} badges · {student.lessonsCompleted} missions</p>
                        </div>
                        {i === 0 && <span className="text-lg">👑</span>}
                      </div>
                    ))}
                </div>
              </motion.div>

              {/* At-Risk Students */}
              <motion.div className="rounded-2xl bg-card p-6 shadow-card md:col-span-2" initial="hidden" animate="visible" variants={fadeUp} custom={6}>
                <h3 className="mb-4 font-display text-lg font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-destructive" /> Needs Attention
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">Students who haven't been active recently or have low progress.</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {classStudents
                    .filter((s) => s.streak === 0 || s.lessonsCompleted < 3)
                    .map((student) => (
                      <div key={student.id} className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                        <span className="text-xl">{student.avatar}</span>
                        <div className="flex-1">
                          <p className="font-display font-bold text-sm">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.lessonsCompleted}/{student.totalLessons} missions · Last active: {student.lastActive}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  {classStudents.filter((s) => s.streak === 0 || s.lessonsCompleted < 3).length === 0 && (
                    <p className="text-sm text-muted-foreground col-span-full">All students are on track! 🎉</p>
                  )}
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default TeacherDashboard;
