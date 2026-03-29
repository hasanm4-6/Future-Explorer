// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Plus,
//   Star,
//   Trophy,
//   BookOpen,
//   Settings,
//   ArrowRight,
//   Eye,
//   BarChart3,
//   Clock,
//   Target,
//   TrendingUp,
//   Flame,
//   Zap,
//   Compass,
//   Users,
//   TrendingDown,
//   Calendar,
//   ApertureIcon,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import Navbar from "@/components/layout/Navbar";
// import { api } from "@/lib/api";
// import { emailScheduler } from "@/lib/scheduler";
// import { useEffect } from "react";
// import { Progress } from "@/components/ui/progress";

// const children = [
//   {
//     name: "Mia",
//     avatar: "🦊",
//     age: 7,
//     level: 1,
//     lessonsCompleted: 4,
//     totalLessons: 8,
//     badges: 3,
//     recentBadge: "Pattern Finder",
//     weeklyMinutes: 42,
//     quizAccuracy: 85,
//     streak: 4,
//     currentMission: "Smart Helpers",
//     missionProgress: 50,
//     skillsMastered: ["What is AI", "Computer Learning", "Patterns"],
//     skillsInProgress: ["Training AI", "AI Helpers"],
//     lastPracticeDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
//     quizTrend: "improving" as "improving" | "declining" | "neutral",
//     nextLesson: {
//       title: "AI in Your World",
//       reason: "Builds on fractions basics",
//       lessonId: 6,
//     },
//   },
//   {
//     name: "Leo",
//     avatar: "🐯",
//     age: 8,
//     level: 1,
//     lessonsCompleted: 2,
//     totalLessons: 8,
//     badges: 1,
//     recentBadge: "AI Curious",
//     weeklyMinutes: 18,
//     quizAccuracy: 70,
//     streak: 1,
//     currentMission: "Patterns Everywhere",
//     missionProgress: 25,
//     skillsMastered: ["What is AI"],
//     skillsInProgress: ["Computer Learning", "Patterns"],
//     lastPracticeDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
//     quizTrend: "neutral" as "improving" | "declining" | "neutral",
//     nextLesson: {
//       title: "Teaching a Robot",
//       reason: "Strengthens pattern recognition",
//       lessonId: 4,
//     },
//   },
// ];

// const fadeUp = {
//   hidden: { opacity: 0, y: 20 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.08, duration: 0.4 },
//   }),
// } as const;

// type ViewMode = "parent" | "child";

// const Dashboard = () => {
//   const [viewMode, setViewMode] = useState<ViewMode>("parent");
//   const [children, setChildren] = useState([]);
//   // const [selectedChild, setSelectedChild] = useState(0);
//   // const child = children[selectedChild];

//   // Mock user and child IDs - in real app, this would come from auth context
//   // const mockUserId = "user-123";
//   // const mockChildId = `child-${selectedChild}`;

//   // useEffect(() => {
//   //   // Check if first mission reminder should be sent
//   //   // api.checkFirstMissionReminder(mockUserId);
//   //   // Update child progress data for weekly summaries
//   //   // api.updateLessonProgress(mockUserId, mockChildId, {
//   //   //   lessonsCompleted: child.lessonsCompleted,
//   //   //   achievements: child.badges > 0 ? [child.recentBadge] : [],
//   //   //   weeklyMinutes: child.weeklyMinutes,
//   //   //   currentMission: child.currentMission,
//   //   // });
//   // }, [selectedChild]);

//   useEffect(() => {
//     const res = api.getChildren();

//     setChildren(res.children);
//   }, []);

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <div className="container mx-auto px-4 py-8">
//         {/* View Toggle */}
//         <motion.div
//           className="mb-6"
//           initial="hidden"
//           animate="visible"
//           variants={fadeUp}
//           custom={0}
//         >
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h1 className="font-display text-3xl font-bold">
//                 {viewMode === "parent"
//                   ? "Welcome back, Parent! 👋"
//                   : `${child.avatar} ${child.name}'s Adventure`}
//               </h1>
//               <div className="mt-1 flex items-center gap-2">
//                 <div
//                   className={`h-2 w-2 rounded-full ${viewMode === "parent" ? "bg-explorer-blue" : "bg-explorer-coral"}`}
//                 />
//                 <p className="text-xs font-semibold text-muted-foreground">
//                   {viewMode === "parent"
//                     ? "You are in Parent View"
//                     : "You are in Child Mode"}
//                 </p>
//               </div>
//             </div>
//             <div className="inline-flex rounded-2xl bg-muted p-1">
//               <button
//                 onClick={() => setViewMode("parent")}
//                 className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold font-display transition-all ${
//                   viewMode === "parent"
//                     ? "bg-card text-foreground shadow-card"
//                     : "text-muted-foreground hover:text-foreground"
//                 }`}
//               >
//                 <BarChart3 className="h-4 w-4" /> Parent View
//               </button>
//               <button
//                 onClick={() => setViewMode("child")}
//                 className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold font-display transition-all ${
//                   viewMode === "child"
//                     ? "bg-gradient-coral text-primary-foreground shadow-playful"
//                     : "text-muted-foreground hover:text-foreground"
//                 }`}
//               >
//                 <Compass className="h-4 w-4" /> Explorer View
//               </button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Child Selector (always visible) */}
//         <motion.div
//           className="mb-6 flex gap-3 overflow-x-auto pb-2"
//           initial="hidden"
//           animate="visible"
//           variants={fadeUp}
//           custom={1}
//         >
//           {children.length === 0 ? (
//             <motion.div
//               className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 min-h-[200px] text-center w-full"
//               initial="hidden"
//               animate="visible"
//               variants={fadeUp}
//               custom={1}
//             >
//               <div className="mb-4">
//                 <Users className="h-12 w-12 text-muted-foreground mx-auto" />
//               </div>
//               <h3 className="mb-2 font-display text-lg font-semibold">
//                 No Explorers Yet
//               </h3>
//               <p className="mb-4 text-sm text-muted-foreground max-w-xs">
//                 Add your first child profile to start their AI learning
//                 adventure!
//               </p>
//               <Link to="/create-child">
//                 <Button variant="explorer" className="gap-2">
//                   <Plus className="h-4 w-4" />
//                   Add First Explorer
//                 </Button>
//               </Link>
//             </motion.div>
//           ) : (
//             <>
//               {children.map((child, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedChild(index)}
//                   className={`flex items-center gap-3 rounded-2xl border-2 p-3 min-w-[140px] transition-all ${
//                     selectedChild === index
//                       ? "border-primary bg-primary/5 shadow-card"
//                       : "border-border bg-card hover:border-primary/30"
//                   }`}
//                 >
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xl">
//                     {child.avatar}
//                   </div>
//                   <div className="text-left">
//                     <p className="font-display font-bold text-sm">
//                       {child.name}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       Age {child.age}
//                     </p>
//                   </div>
//                 </button>
//               ))}
//               {children.length < 3 && (
//                 <Link
//                   to="/create-child"
//                   className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-border p-3 min-w-[140px] text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
//                 >
//                   <Plus className="h-5 w-5" />
//                   <span className="font-display font-semibold text-sm">
//                     Add
//                   </span>
//                 </Link>
//               )}
//             </>
//           )}
//         </motion.div>

//         {/* PARENT VIEW - ENHANCED DASHBOARD WIDGETS */}
//         {viewMode === "parent" && (
//           <>
//             {children.length === 0 ? (
//               <motion.div
//                 className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 min-h-[300px] text-center"
//                 initial="hidden"
//                 animate="visible"
//                 variants={fadeUp}
//                 custom={2}
//               >
//                 <div className="mb-4">
//                   <Users className="h-16 w-16 text-muted-foreground mx-auto" />
//                 </div>
//                 <h3 className="mb-2 font-display text-xl font-semibold">
//                   Start Your AI Adventure
//                 </h3>
//                 <p className="mb-6 text-muted-foreground max-w-md">
//                   Add your first child profile to track their progress, see
//                   achievements, and monitor their AI learning journey.
//                 </p>
//                 <Link to="/create-child">
//                   <Button variant="explorer" size="lg" className="gap-2">
//                     <Plus className="h-5 w-5" />
//                     Add First Explorer
//                   </Button>
//                 </Link>
//               </motion.div>
//             ) : (
//               <>
//                 {/* 1️⃣ CURRENT MISSION WIDGET */}
//                 <motion.div
//                   className="mb-8 grid gap-6 lg:grid-cols-2"
//                   initial="hidden"
//                   animate="visible"
//                   variants={fadeUp}
//                   custom={2}
//                 >
//                   <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-coral">
//                     <div className="mb-4 flex items-center gap-3">
//                       <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-coral">
//                         <Target className="h-6 w-6 text-primary-foreground" />
//                       </div>
//                       <div>
//                         <h3 className="font-display text-lg font-bold">
//                           Current Mission
//                         </h3>
//                         <p className="text-xs text-muted-foreground">
//                           {child.name}'s Progress
//                         </p>
//                       </div>
//                     </div>
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <span className="font-display text-xl font-bold">
//                           {child.currentMission}
//                         </span>
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-bold ${
//                             child.missionProgress === 100
//                               ? "bg-explorer-green/10 text-explorer-green"
//                               : "bg-explorer-coral/10 text-explorer-coral"
//                           }`}
//                         >
//                           {child.missionProgress === 100
//                             ? "Completed"
//                             : "In Progress"}
//                         </span>
//                       </div>
//                       <Progress value={child.missionProgress} className="h-3" />
//                       <p className="text-xs text-muted-foreground">
//                         Mission {child.lessonsCompleted + 1} of{" "}
//                         {child.totalLessons}
//                       </p>
//                     </div>
//                   </div>

//                   {/* 2️⃣ WEEKLY LEARNING MINUTES WIDGET */}
//                   <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-blue">
//                     <div className="mb-4 flex items-center gap-3">
//                       <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-blue">
//                         <Clock className="h-6 w-6 text-primary-foreground" />
//                       </div>
//                       <div>
//                         <h3 className="font-display text-lg font-bold">
//                           Weekly Learning Minutes
//                         </h3>
//                         <p className="text-xs text-muted-foreground">
//                           This week's progress
//                         </p>
//                       </div>
//                     </div>
//                     <div className="space-y-3">
//                       <div className="flex items-center gap-4">
//                         <span className="font-display text-3xl font-bold text-explorer-blue">
//                           {child.weeklyMinutes}
//                         </span>
//                         <span className="text-sm text-muted-foreground">
//                           minutes
//                         </span>
//                       </div>
//                       {/* Weekly mini bar visualization */}
//                       <div className="flex gap-1">
//                         {[...Array(7)].map((_, i) => (
//                           <div
//                             key={i}
//                             className={`h-8 flex-1 rounded ${
//                               i < Math.floor(child.weeklyMinutes / 10)
//                                 ? "bg-explorer-blue"
//                                 : "bg-muted"
//                             }`}
//                             title={`Day ${i + 1}: ${i < Math.floor(child.weeklyMinutes / 10) ? "Active" : "No activity"}`}
//                           />
//                         ))}
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         Daily activity this week
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* 3️⃣ QUIZ ACCURACY TREND WIDGET */}
//                 <motion.div
//                   className="mb-8 grid gap-6 lg:grid-cols-2"
//                   initial="hidden"
//                   animate="visible"
//                   variants={fadeUp}
//                   custom={3}
//                 >
//                   <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-green">
//                     <div className="mb-4 flex items-center gap-3">
//                       <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-green">
//                         {child.quizTrend === "improving" ? (
//                           <TrendingUp className="h-6 w-6 text-primary-foreground" />
//                         ) : child.quizTrend === "declining" ? (
//                           <TrendingDown className="h-6 w-6 text-primary-foreground" />
//                         ) : (
//                           <Target className="h-6 w-6 text-primary-foreground" />
//                         )}
//                       </div>
//                       <div>
//                         <h3 className="font-display text-lg font-bold">
//                           Quiz Accuracy Trend
//                         </h3>
//                         <p className="text-xs text-muted-foreground">
//                           Recent performance
//                         </p>
//                       </div>
//                     </div>
//                     <div className="space-y-3">
//                       <div className="flex items-center gap-4">
//                         <span className="font-display text-3xl font-bold">
//                           {child.quizAccuracy}%
//                         </span>
//                         <div
//                           className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
//                             child.quizTrend === "improving"
//                               ? "bg-explorer-green/10 text-explorer-green"
//                               : child.quizTrend === "declining"
//                                 ? "bg-explorer-coral/10 text-explorer-coral"
//                                 : "bg-muted text-muted-foreground"
//                           }`}
//                         >
//                           {child.quizTrend === "improving" ? (
//                             <>
//                               <TrendingUp className="h-3 w-3" /> Improving
//                             </>
//                           ) : child.quizTrend === "declining" ? (
//                             <>
//                               <TrendingDown className="h-3 w-3" /> Needs
//                               Attention
//                             </>
//                           ) : (
//                             <>
//                               <Target className="h-3 w-3" /> Stable
//                             </>
//                           )}
//                         </div>
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         {child.quizTrend === "improving"
//                           ? "Great progress! Keep up the excellent work."
//                           : child.quizTrend === "declining"
//                             ? "Consider reviewing recent lessons for support."
//                             : "Consistent performance. Good job!"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* 4️⃣ SKILLS: MASTERED VS IN PROGRESS WIDGET */}
//                   <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-gold">
//                     <div className="mb-4 flex items-center gap-3">
//                       <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold">
//                         <Trophy className="h-6 w-6 text-primary-foreground" />
//                       </div>
//                       <div>
//                         <h3 className="font-display text-lg font-bold">
//                           Skills Overview
//                         </h3>
//                         <p className="text-xs text-muted-foreground">
//                           Learning progress
//                         </p>
//                       </div>
//                     </div>
//                     <div className="space-y-4">
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="text-center p-3 rounded-xl bg-explorer-green/5">
//                           <div className="flex items-center justify-center gap-2 mb-2">
//                             <Star className="h-5 w-5 text-explorer-green" />
//                             <span className="text-2xl font-bold text-explorer-green">
//                               {child.skillsMastered.length}
//                             </span>
//                           </div>
//                           <p className="text-xs font-semibold text-explorer-green">
//                             Mastered
//                           </p>
//                         </div>
//                         <div className="text-center p-3 rounded-xl bg-muted">
//                           <div className="flex items-center justify-center gap-2 mb-2">
//                             <Zap className="h-5 w-5 text-muted-foreground" />
//                             <span className="text-2xl font-bold text-muted-foreground">
//                               {child.skillsInProgress.length}
//                             </span>
//                           </div>
//                           <p className="text-xs font-semibold text-muted-foreground">
//                             In Progress
//                           </p>
//                         </div>
//                       </div>
//                       <div className="space-y-2">
//                         <p className="text-xs font-semibold text-muted-foreground">
//                           Recent Skills:
//                         </p>
//                         <div className="flex flex-wrap gap-1">
//                           {child.skillsMastered.slice(0, 2).map((skill, i) => (
//                             <span
//                               key={i}
//                               className="px-2 py-1 bg-explorer-green/10 text-explorer-green text-xs rounded-full font-medium"
//                             >
//                               {skill}
//                             </span>
//                           ))}
//                           {child.skillsInProgress
//                             .slice(0, 1)
//                             .map((skill, i) => (
//                               <span
//                                 key={i}
//                                 className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium"
//                               >
//                                 {skill}
//                               </span>
//                             ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* 5️⃣ SUGGESTED NEXT LESSON WIDGET & 6️⃣ GENTLE NUDGE REMINDERS WIDGET */}
//                 <motion.div
//                   className="mb-8 grid gap-6 lg:grid-cols-2"
//                   initial="hidden"
//                   animate="visible"
//                   variants={fadeUp}
//                   custom={4}
//                 >
//                   {/* 5️⃣ SUGGESTED NEXT LESSON WIDGET */}
//                   <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-purple">
//                     <div className="mb-4 flex items-center gap-3">
//                       <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-purple">
//                         <BookOpen className="h-6 w-6 text-primary-foreground" />
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="font-display text-lg font-bold">
//                           Suggested Next Lesson
//                         </h3>
//                         <p className="text-xs text-muted-foreground">
//                           Recommended based on progress
//                         </p>
//                       </div>
//                     </div>
//                     <div className="space-y-4">
//                       <div>
//                         <h4 className="font-display text-lg font-semibold mb-1">
//                           {child.nextLesson.title}
//                         </h4>
//                         <p className="text-sm text-muted-foreground mb-3">
//                           {child.nextLesson.reason}
//                         </p>
//                         <Link to={`/lesson/${child.nextLesson.lessonId}`}>
//                           <Button
//                             variant="explorer"
//                             size="sm"
//                             className="gap-2"
//                           >
//                             <ArrowRight className="h-4 w-4" />
//                             Start Next Lesson
//                           </Button>
//                         </Link>
//                       </div>
//                     </div>
//                   </div>

//                   {/* 6️⃣ GENTLE NUDGE REMINDERS WIDGET */}
//                   <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-pink">
//                     <div className="mb-4 flex items-center gap-3">
//                       <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-pink">
//                         <Calendar className="h-6 w-6 text-primary-foreground" />
//                       </div>
//                       <div>
//                         <h3 className="font-display text-lg font-bold">
//                           Gentle Reminders
//                         </h3>
//                         <p className="text-xs text-muted-foreground">
//                           Encouragement & consistency
//                         </p>
//                       </div>
//                     </div>
//                     <div className="space-y-3">
//                       {child.streak >= 3 ? (
//                         <div className="flex items-center gap-3 p-3 bg-explorer-green/5 rounded-lg">
//                           <Flame className="h-5 w-5 text-explorer-green" />
//                           <p className="text-sm text-muted-foreground">
//                             <span className="font-semibold text-explorer-green">
//                               Great consistency!
//                             </span>{" "}
//                             {child.streak} day streak going strong! 🔥
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
//                           <Calendar className="h-5 w-5 text-muted-foreground" />
//                           <p className="text-sm text-muted-foreground">
//                             <span className="font-semibold">Keep it up!</span>{" "}
//                             Regular practice helps build confidence.
//                           </p>
//                         </div>
//                       )}

//                       {child.weeklyMinutes >= 30 ? (
//                         <div className="flex items-center gap-3 p-3 bg-explorer-blue/5 rounded-lg">
//                           <Clock className="h-5 w-5 text-explorer-blue" />
//                           <p className="text-sm text-muted-foreground">
//                             <span className="font-semibold text-explorer-blue">
//                               Excellent effort!
//                             </span>{" "}
//                             {child.weeklyMinutes} minutes this week.
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
//                           <Clock className="h-5 w-5 text-muted-foreground" />
//                           <p className="text-sm text-muted-foreground">
//                             <span className="font-semibold">
//                               Small steps count!
//                             </span>{" "}
//                             Every minute of learning adds up.
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>
//               </>
//             )}
//           </>
//         )}

//         {/* CHILD VIEW */}
//         {viewMode === "child" && (
//           <>
//             {/* Child Stats Bar */}
//             <motion.div
//               className="mb-8 grid gap-4 sm:grid-cols-3"
//               initial="hidden"
//               animate="visible"
//               variants={fadeUp}
//               custom={2}
//             >
//               <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold text-2xl">
//                   <Trophy className="h-6 w-6 text-primary-foreground" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold font-display">
//                     {child.badges}
//                   </p>
//                   <p className="text-xs text-muted-foreground">Badges Earned</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-coral text-2xl">
//                   <Flame className="h-6 w-6 text-primary-foreground" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold font-display">
//                     {child.streak} day{child.streak !== 1 ? "s" : ""}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Learning Streak 🔥
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-green text-2xl">
//                   <Star className="h-6 w-6 text-primary-foreground" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold font-display">
//                     Level {child.level}
//                   </p>
//                   <p className="text-xs text-muted-foreground">Explorer Rank</p>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Current Mission CTA */}
//             <motion.div
//               className="mb-8 overflow-hidden rounded-2xl bg-gradient-coral p-8 text-primary-foreground shadow-playful"
//               initial="hidden"
//               animate="visible"
//               variants={fadeUp}
//               custom={3}
//             >
//               <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
//                 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm">
//                   <Zap className="h-8 w-8" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-bold opacity-80">
//                     Your Current Mission
//                   </p>
//                   <h2 className="font-display text-2xl font-bold">
//                     Mission {child.lessonsCompleted + 1}: {child.currentMission}
//                   </h2>
//                   <p className="text-sm opacity-80">
//                     Continue your adventure and earn a new badge!
//                   </p>
//                 </div>
//                 <Link to={`/lesson/${child.lessonsCompleted + 1}`}>
//                   <Button
//                     size="xl"
//                     className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 font-display font-bold"
//                   >
//                     Start Mission <ArrowRight className="h-5 w-5" />
//                   </Button>
//                 </Link>
//               </div>
//             </motion.div>

//             {/* View full map link */}
//             <motion.div
//               initial="hidden"
//               animate="visible"
//               variants={fadeUp}
//               custom={6}
//             >
//               <Link to="/lessons">
//                 <Button
//                   variant="explorer-outline"
//                   size="lg"
//                   className="w-full sm:w-auto"
//                 >
//                   <Compass className="h-5 w-5" /> View Explorer Map{" "}
//                   <ArrowRight className="h-4 w-4" />
//                 </Button>
//               </Link>
//             </motion.div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Star,
  Trophy,
  BookOpen,
  ArrowRight,
  BarChart3,
  Clock,
  Target,
  TrendingUp,
  Flame,
  Zap,
  Compass,
  Users,
  TrendingDown,
  Calendar,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import LoadingState from "@/components/Loading";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NextLesson {
  title: string;
  reason: string;
  lessonId: number;
}

export interface Child {
  name: string;
  avatar: string;
  age: number;
  level: number;
  lessonsCompleted: number;
  totalLessons: number;
  badges: number;
  recentBadge: string;
  weeklyMinutes: number;
  quizAccuracy: number;
  streak: number;
  currentMission: string;
  missionProgress: number;
  skillsMastered: string[];
  skillsInProgress: string[];
  lastPracticeDate: string | Date;
  quizTrend: "improving" | "declining" | "neutral";
  nextLesson: NextLesson;
}

type ViewMode = "parent" | "child";

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-destructive font-medium">{message}</p>
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyChildrenCard({ custom }: { custom: number }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 min-h-[200px] text-center w-full"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={custom}
    >
      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="mb-2 font-display text-lg font-semibold">
        No Explorers Yet
      </h3>
      <p className="mb-4 text-sm text-muted-foreground max-w-xs">
        Add your first child profile to start their AI learning adventure!
      </p>
      <Link to="/create-child">
        <Button variant="explorer" className="gap-2">
          <Plus className="h-4 w-4" />
          Add First Explorer
        </Button>
      </Link>
    </motion.div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("parent");
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safely derive the active child — never undefined
  const child: Child | null = children[selectedChild] ?? null;

  const fetchChildren = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.getChildren();
      setChildren(res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch children:", err);
      setError(
        "Couldn't load your explorers. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  // Guard: reset selectedChild if it goes out of bounds after a refetch
  useEffect(() => {
    if (children.length > 0 && selectedChild >= children.length) {
      setSelectedChild(0);
    }
  }, [children.length, selectedChild]);

  // ── Early returns ──────────────────────────────────────────────────────────

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchChildren} />;

  const hasChildren = children.length > 0;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* View Toggle */}
        <motion.div
          className="mb-6"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold">
                {viewMode === "parent"
                  ? `Welcome back, ${user?.name}! 👋`
                  : child
                    ? `${child.avatar} ${child.name}'s Adventure`
                    : "Explorer View"}
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    viewMode === "parent"
                      ? "bg-explorer-blue"
                      : "bg-explorer-coral"
                  }`}
                />
                <p className="text-xs font-semibold text-muted-foreground">
                  {viewMode === "parent"
                    ? "You are in Parent View"
                    : "You are in Child Mode"}
                </p>
              </div>
            </div>

            <div className="inline-flex rounded-2xl bg-muted p-1">
              <button
                onClick={() => setViewMode("parent")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold font-display transition-all ${
                  viewMode === "parent"
                    ? "bg-card text-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BarChart3 className="h-4 w-4" /> Parent View
              </button>
              <button
                onClick={() => setViewMode("child")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold font-display transition-all ${
                  viewMode === "child"
                    ? "bg-gradient-coral text-primary-foreground shadow-playful"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Compass className="h-4 w-4" /> Explorer View
              </button>
            </div>
          </div>
        </motion.div>

        {/* Child Selector */}
        <motion.div
          className="mb-6 flex gap-3 overflow-x-auto pb-2"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
        >
          {!hasChildren ? (
            <EmptyChildrenCard custom={1} />
          ) : (
            <>
              {children.map((c, index) => (
                <button
                  key={`child-tab-${index}`}
                  onClick={() => setSelectedChild(index)}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-3 min-w-[140px] transition-all ${
                    selectedChild === index
                      ? "border-primary bg-primary/5 shadow-card"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xl">
                    {c.avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-display font-bold text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">Age {c.age}</p>
                  </div>
                </button>
              ))}
              {children.length < 3 && (
                <Link
                  to="/create-child"
                  className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-border p-3 min-w-[140px] text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-display font-semibold text-sm">
                    Add
                  </span>
                </Link>
              )}
            </>
          )}
        </motion.div>

        {/* ── PARENT VIEW ────────────────────────────────────────────────────── */}
        {viewMode === "parent" && (
          <>
            {!hasChildren || !child ? (
              <motion.div
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 min-h-[300px] text-center"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={2}
              >
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2 font-display text-xl font-semibold">
                  Start Your AI Adventure
                </h3>
                <p className="mb-6 text-muted-foreground max-w-md">
                  Add your first child profile to track their progress, see
                  achievements, and monitor their AI learning journey.
                </p>
                <Link to="/create-child">
                  <Button variant="explorer" size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Add First Explorer
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <>
                {/* 1️⃣ Current Mission + Weekly Minutes */}
                <motion.div
                  className="mb-8 grid gap-6 lg:grid-cols-2"
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={2}
                >
                  {/* Current Mission */}
                  <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-coral">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-coral">
                        <Target className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold">
                          Current Mission
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {child.name}'s Progress
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xl font-bold">
                          {child.currentMission}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            child.missionProgress === 100
                              ? "bg-explorer-green/10 text-explorer-green"
                              : "bg-explorer-coral/10 text-explorer-coral"
                          }`}
                        >
                          {child.missionProgress === 100
                            ? "Completed"
                            : "In Progress"}
                        </span>
                      </div>
                      <Progress value={child.missionProgress} className="h-3" />
                      <p className="text-xs text-muted-foreground">
                        Mission {child.lessonsCompleted + 1} of{" "}
                        {child.totalLessons}
                      </p>
                    </div>
                  </div>

                  {/* Weekly Learning Minutes */}
                  <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-blue">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-blue">
                        <Clock className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold">
                          Weekly Learning Minutes
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          This week's progress
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <span className="font-display text-3xl font-bold text-explorer-blue">
                          {child.weeklyMinutes}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          minutes
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 7 }, (_, i) => (
                          <div
                            key={i}
                            className={`h-8 flex-1 rounded ${
                              i < Math.floor(child.weeklyMinutes / 10)
                                ? "bg-explorer-blue"
                                : "bg-muted"
                            }`}
                            title={`Day ${i + 1}: ${
                              i < Math.floor(child.weeklyMinutes / 10)
                                ? "Active"
                                : "No activity"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Daily activity this week
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* 3️⃣ Quiz Accuracy Trend + Skills Overview */}
                <motion.div
                  className="mb-8 grid gap-6 lg:grid-cols-2"
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={3}
                >
                  {/* Quiz Accuracy */}
                  <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-green">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-green">
                        {child.quizTrend === "improving" ? (
                          <TrendingUp className="h-6 w-6 text-primary-foreground" />
                        ) : child.quizTrend === "declining" ? (
                          <TrendingDown className="h-6 w-6 text-primary-foreground" />
                        ) : (
                          <Target className="h-6 w-6 text-primary-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold">
                          Quiz Accuracy Trend
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Recent performance
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <span className="font-display text-3xl font-bold">
                          {child.quizAccuracy}%
                        </span>
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                            child.quizTrend === "improving"
                              ? "bg-explorer-green/10 text-explorer-green"
                              : child.quizTrend === "declining"
                                ? "bg-explorer-coral/10 text-explorer-coral"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {child.quizTrend === "improving" ? (
                            <>
                              <TrendingUp className="h-3 w-3" /> Improving
                            </>
                          ) : child.quizTrend === "declining" ? (
                            <>
                              <TrendingDown className="h-3 w-3" /> Needs
                              Attention
                            </>
                          ) : (
                            <>
                              <Target className="h-3 w-3" /> Stable
                            </>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {child.quizTrend === "improving"
                          ? "Great progress! Keep up the excellent work."
                          : child.quizTrend === "declining"
                            ? "Consider reviewing recent lessons for support."
                            : "Consistent performance. Good job!"}
                      </p>
                    </div>
                  </div>

                  {/* Skills Overview */}
                  <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-gold">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold">
                        <Trophy className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold">
                          Skills Overview
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Learning progress
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-xl bg-explorer-green/5">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Star className="h-5 w-5 text-explorer-green" />
                            <span className="text-2xl font-bold text-explorer-green">
                              {child?.skillsMastered?.length}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-explorer-green">
                            Mastered
                          </p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-muted">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Zap className="h-5 w-5 text-muted-foreground" />
                            <span className="text-2xl font-bold text-muted-foreground">
                              {child?.skillsInProgress?.length}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-muted-foreground">
                            In Progress
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">
                          Recent Skills:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {child?.skillsMastered
                            ?.slice(0, 2)
                            .map((skill, i) => (
                              <span
                                key={`mastered-${i}`}
                                className="px-2 py-1 bg-explorer-green/10 text-explorer-green text-xs rounded-full font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          {child?.skillsInProgress
                            ?.slice(0, 1)
                            .map((skill, i) => (
                              <span
                                key={`progress-${i}`}
                                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* 5️⃣ Suggested Next Lesson + 6️⃣ Gentle Reminders */}
                <motion.div
                  className="mb-8 grid gap-6 lg:grid-cols-2"
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={4}
                >
                  {/* Suggested Next Lesson */}
                  <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-purple">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-purple">
                        <BookOpen className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-lg font-bold">
                          Suggested Next Lesson
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Recommended based on progress
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-display text-lg font-semibold mb-1">
                          {child?.nextLesson?.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {child?.nextLesson?.reason}
                        </p>
                        <Link to={`/lesson/${child?.nextLesson?.lessonId}`}>
                          <Button
                            variant="explorer"
                            size="sm"
                            className="gap-2"
                          >
                            <ArrowRight className="h-4 w-4" />
                            Start Next Lesson
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Gentle Reminders */}
                  <div className="rounded-2xl bg-card p-6 shadow-card border-l-4 border-l-explorer-pink">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-pink">
                        <Calendar className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold">
                          Gentle Reminders
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Encouragement &amp; consistency
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {child.streak >= 3 ? (
                        <div className="flex items-center gap-3 p-3 bg-explorer-green/5 rounded-lg">
                          <Flame className="h-5 w-5 text-explorer-green flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-explorer-green">
                              Great consistency!
                            </span>{" "}
                            {child.streak} day streak going strong! 🔥
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">Keep it up!</span>{" "}
                            Regular practice helps build confidence.
                          </p>
                        </div>
                      )}

                      {child.weeklyMinutes >= 30 ? (
                        <div className="flex items-center gap-3 p-3 bg-explorer-blue/5 rounded-lg">
                          <Clock className="h-5 w-5 text-explorer-blue flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-explorer-blue">
                              Excellent effort!
                            </span>{" "}
                            {child.weeklyMinutes} minutes this week.
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">
                              Small steps count!
                            </span>{" "}
                            Every minute of learning adds up.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </>
        )}

        {/* ── CHILD VIEW ─────────────────────────────────────────────────────── */}
        {viewMode === "child" && (
          <>
            {!child ? (
              <EmptyChildrenCard custom={2} />
            ) : (
              <>
                {/* Stats Bar */}
                <motion.div
                  className="mb-8 grid gap-4 sm:grid-cols-3"
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={2}
                >
                  <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold">
                      <Trophy className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold font-display">
                        {child.badges}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Badges Earned
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-coral">
                      <Flame className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold font-display">
                        {child.streak} day{child.streak !== 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Learning Streak 🔥
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-green">
                      <Star className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold font-display">
                        Level {child.level}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Explorer Rank
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Current Mission CTA */}
                <motion.div
                  className="mb-8 overflow-hidden rounded-2xl bg-gradient-coral p-8 text-primary-foreground shadow-playful"
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={3}
                >
                  <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex-shrink-0">
                      <Zap className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold opacity-80">
                        Your Current Mission
                      </p>
                      <h2 className="font-display text-2xl font-bold">
                        Mission {child.lessonsCompleted + 1}:{" "}
                        {child.currentMission}
                      </h2>
                      <p className="text-sm opacity-80">
                        Continue your adventure and earn a new badge!
                      </p>
                    </div>
                    <Link to={`/lesson/${child.lessonsCompleted + 1}`}>
                      <Button
                        size="xl"
                        className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 font-display font-bold"
                      >
                        Start Mission <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>

                {/* View Full Map */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={6}
                >
                  <Link to="/lessons">
                    <Button
                      variant="explorer-outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <Compass className="h-5 w-5" /> View Explorer Map{" "}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
