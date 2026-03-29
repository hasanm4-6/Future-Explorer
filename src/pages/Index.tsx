import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Rocket, Brain, Shield, Trophy, Star, Sparkles, Zap, Users, CheckCircle,
  UserPlus, Smile, Award, Lock, Eye, Clock, MessageCircleOff, ShieldCheck,
  BookOpen, Target, Play, Quote, School, ArrowRight, GraduationCap, BarChart3, TrendingUp, Lock as LockIcon, Eye as EyeIcon, Database, MessageSquareOff, Timer, BookCheck, LineChart, Map, FolderOpen, FileText, HelpCircle, Medal, ChevronRight, PlayCircle, Video, Sparkles as SparklesIcon
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OptimizedImage from "@/components/OptimizedImage";
import heroImg from "@/assets/hero-illustration.png";
import { trackEvent } from "@/lib/tracking";
import { useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  { icon: Brain, title: "AI Made Simple", desc: "Fun stories & activities explain AI concepts kids can actually understand.", color: "bg-gradient-coral" },
  { icon: Trophy, title: "Earn Badges", desc: "Complete missions to unlock shiny badges and level up your explorer rank.", color: "bg-gradient-gold" },
  { icon: Shield, title: "Parent Approved", desc: "Safe, ad-free, COPPA-compliant learning with full parent controls.", color: "bg-gradient-blue" },
  { icon: Rocket, title: "Adventure Learning", desc: "Each lesson is a mission in an exciting explorer journey through AI.", color: "bg-gradient-green" },
];

const howItWorks = [
  { icon: UserPlus, title: "Create Parent Account", desc: "Sign up in 30 seconds. You control everything.", color: "bg-gradient-blue" },
  { icon: Smile, title: "Add Explorer Profile", desc: "Pick an avatar, enter a name. Fun and quick!", color: "bg-gradient-coral" },
  { icon: Award, title: "Complete Missions & Earn Badges", desc: "Kids learn AI through bite-sized adventures.", color: "bg-gradient-gold" },
];

const trustPoints = [
  { icon: Database, title: "Privacy-first data handling", desc: "Your child's data is encrypted and never shared with third parties." },
  { icon: MessageSquareOff, title: "No open chat with strangers", desc: "No social features or external messaging. Focused solo learning." },
  { icon: Timer, title: "Screen-time aware lesson design", desc: "Short 3–7 minute missions designed to respect attention spans." },
  { icon: BookCheck, title: "Age-appropriate curriculum", desc: "Expert-reviewed content tailored for ages 6–9 and 10–13." },
  { icon: LineChart, title: "Full parent progress visibility", desc: "Real-time dashboard showing exactly what your child learns." },
];

const curriculum = [
  { id: 1, title: "What is AI?", duration: "5 min", skill: "Can explain what AI is" },
  { id: 2, title: "How Computers Learn", duration: "6 min", skill: "Understands data & learning" },
  { id: 3, title: "Patterns Everywhere", duration: "5 min", skill: "Can identify patterns" },
  { id: 4, title: "Teaching a Robot", duration: "7 min", skill: "Understands training" },
  { id: 5, title: "Smart Helpers", duration: "5 min", skill: "Knows AI applications" },
  { id: 6, title: "AI in Your World", duration: "6 min", skill: "Spots AI in daily life" },
  { id: 7, title: "Create with AI", duration: "7 min", skill: "Uses AI creatively" },
  { id: 8, title: "Future of AI", duration: "5 min", skill: "Thinks about AI's future" },
];

const testimonials = [
  { name: "Sarah M.", role: "Parent of two", text: "My kids look forward to their missions every day. It's the only screen time I feel good about.", avatar: "👩" },
  { name: "Mr. Thompson", role: "3rd Grade Teacher", text: "Finally, an AI curriculum that's actually age-appropriate. My students love earning badges.", avatar: "👨‍🏫" },
  { name: "Priya K.", role: "Parent", text: "The parent dashboard gives me peace of mind. I can see exactly what they're learning.", avatar: "👩‍💻" },
];

// Mock data for preview section - no real user data
const sampleLesson = {
  id: 1,
  title: "What is AI?",
  duration: "5 min",
  description: "Join Robi the robot on an adventure to discover what Artificial Intelligence really means!",
  skill: "Can explain what AI is",
  ageBand: "6–9",
  storyCards: [
    { title: "Meet Robi!", text: "Robi is a friendly robot who needs YOUR help to understand the world." },
    { title: "What Does Robi See?", text: "Robi looks at pictures and tries to guess what's in them." },
  ],
};

const sampleDashboardData = {
  childName: "Alex (Sample)",
  progress: 65,
  completedMissions: 5,
  totalMissions: 8,
  badgesEarned: 3,
  timeSpent: "2.5 hours",
  recentActivity: [
    { mission: "What is AI?", date: "2 days ago", score: 95 },
    { mission: "How Computers Learn", date: "1 week ago", score: 88 },
  ],
};

const ageBands = [
  { range: "6–9", label: "Young Explorers", color: "bg-gradient-coral", description: "Fun stories, simple concepts, and playful activities" },
  { range: "10–13", label: "Junior Coders", color: "bg-gradient-blue", description: "Deeper concepts, coding basics, and creative projects" },
];

// Curriculum Transparency Data - Track → Module → Lesson → Quiz → Badge
const curriculumTrack = {
  trackName: "AI Explorer Track",
  description: "Complete journey from AI basics to creative applications",
  modules: [
    {
      moduleName: "Module 1: Understanding AI",
      lessons: [
        {
          lessonName: "What is AI?",
          duration: "5 min",
          skillOutcome: "Can explain what AI is",
          hasQuiz: true,
          badgeName: "AI Curious",
        },
        {
          lessonName: "How Computers Learn",
          duration: "6 min",
          skillOutcome: "Understands data & learning",
          hasQuiz: true,
          badgeName: "Data Detective",
        },
        {
          lessonName: "Patterns Everywhere",
          duration: "5 min",
          skillOutcome: "Can identify patterns",
          hasQuiz: true,
          badgeName: "Pattern Pro",
        },
      ],
    },
    {
      moduleName: "Module 2: AI in Action",
      lessons: [
        {
          lessonName: "Teaching a Robot",
          duration: "7 min",
          skillOutcome: "Understands training",
          hasQuiz: true,
          badgeName: "Robot Trainer",
        },
        {
          lessonName: "Smart Helpers",
          duration: "5 min",
          skillOutcome: "Knows AI applications",
          hasQuiz: true,
          badgeName: "Helper Hero",
        },
        {
          lessonName: "AI in Your World",
          duration: "6 min",
          skillOutcome: "Spots AI in daily life",
          hasQuiz: true,
          badgeName: "Spotter Star",
        },
      ],
    },
  ],
};

const Index = () => {
  useEffect(() => {
    trackEvent("view_home");
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-hero relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/30 px-4 py-1.5">
                <Sparkles className="h-4 w-4 text-explorer-gold" />
                <span className="text-sm font-bold text-accent-foreground">For Ages 6–9</span>
              </div>
              <h1 className="mb-4 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                AI Learning Missions for Kids — With <span className="text-gradient-coral">Parent Visibility</span> Built In.
              </h1>
              <p className="mb-8 max-w-lg text-lg text-muted-foreground">
                A guided web app where children learn AI safely through bite-sized lessons, quizzes, and achievement badges — while parents track real progress.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login">
                  <Button variant="explorer" size="xl" onClick={() => trackEvent("click_start_free")}>
                    <Rocket className="h-5 w-5" />
                    Start Free
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="explorer-outline" size="xl">
                    <School className="h-5 w-5" />
                    Book School Demo
                  </Button>
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-explorer-green" /> Free trial</span>
                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-explorer-blue" /> Ad-free</span>
                <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-explorer-gold" /> COPPA safe</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <OptimizedImage 
                src={heroImg} 
                alt="Kids exploring AI on an adventure" 
                className="w-full rounded-2xl shadow-card"
                priority={true}
              />
            </motion.div>
          </div>
        </div>
        <div className="absolute -top-8 right-10 h-16 w-16 animate-float rounded-full bg-explorer-gold/20" />
        <div className="absolute bottom-10 left-10 h-12 w-12 animate-float animation-delay-400 rounded-full bg-explorer-blue/20" />
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div className="mb-12 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="text-muted-foreground">Three simple steps to start your explorer journey.</p>
          </motion.div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {howItWorks.map((step, i) => (
              <motion.div key={step.title} className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}>
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${step.color}`}>
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted font-display text-sm font-bold text-muted-foreground">
                  {i + 1}
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Before You Sign Up */}
      <section id="preview" className="bg-gradient-to-br from-explorer-coral/5 via-background to-explorer-blue/5 py-20">
        <div className="container mx-auto px-4">
          <motion.div className="mb-12 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-explorer-gold/20 px-4 py-1.5">
              <Eye className="h-4 w-4 text-explorer-gold" />
              <span className="text-sm font-bold text-foreground">Preview</span>
            </div>
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">Explore Before You Sign Up</h2>
            <p className="mx-auto max-w-lg text-muted-foreground">
              Take a peek at what your child will experience. No account required.
            </p>
          </motion.div>

          {/* Age Bands */}
          <div className="mx-auto mb-12 grid max-w-2xl gap-4 md:grid-cols-2">
            {ageBands.map((band, i) => (
              <motion.div
                key={band.range}
                className="rounded-2xl bg-card p-6 shadow-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
              >
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${band.color}`}>
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-display text-2xl font-bold">Ages {band.range}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">{band.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">{band.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Preview Cards Grid */}
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {/* Sample Lesson Preview */}
            <motion.div
              className="rounded-2xl bg-card p-6 shadow-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-coral">
                    <Play className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-display font-semibold">Sample Lesson Preview</span>
                </div>
                <span className="rounded-full bg-explorer-gold/20 px-2 py-0.5 text-xs font-bold text-explorer-gold">Demo</span>
              </div>

              <div className="mb-4 overflow-hidden rounded-xl bg-muted">
                <div className="bg-gradient-coral p-4 text-primary-foreground">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">Mission {sampleLesson.id}</span>
                    <span className="text-xs opacity-80">{sampleLesson.duration}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold">{sampleLesson.title}</h3>
                </div>
                <div className="p-4">
                  <p className="mb-3 text-sm text-muted-foreground">{sampleLesson.description}</p>
                  <div className="space-y-2">
                    {sampleLesson.storyCards.map((card, idx) => (
                      <div key={idx} className="rounded-lg bg-background p-3">
                        <p className="mb-1 text-xs font-bold text-explorer-coral">{card.title}</p>
                        <p className="text-xs text-muted-foreground">{card.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Target className="h-3.5 w-3.5 text-explorer-green" />
                    <span>Outcome: {sampleLesson.skill}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <LockIcon className="h-3.5 w-3.5" />
                <span>Full lesson available after signup</span>
              </div>
            </motion.div>

            {/* Sample Parent Dashboard Preview */}
            <motion.div
              className="rounded-2xl bg-card p-6 shadow-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-blue">
                    <BarChart3 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-display font-semibold">Parent Dashboard Preview</span>
                </div>
                <span className="rounded-full bg-explorer-blue/20 px-2 py-0.5 text-xs font-bold text-explorer-blue">Sample</span>
              </div>

              <div className="mb-4 overflow-hidden rounded-xl bg-muted">
                <div className="border-b border-border bg-card p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-coral text-xs font-bold text-primary-foreground">
                      A
                    </div>
                    <span className="font-display text-sm font-bold">{sampleDashboardData.childName}</span>
                  </div>
                </div>
                <div className="p-4">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Overall Progress</span>
                      <span className="font-bold text-explorer-green">{sampleDashboardData.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[65%] rounded-full bg-gradient-green" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-background p-2 text-center">
                      <div className="font-display text-lg font-bold text-explorer-coral">{sampleDashboardData.completedMissions}/{sampleDashboardData.totalMissions}</div>
                      <div className="text-[10px] text-muted-foreground">Missions</div>
                    </div>
                    <div className="rounded-lg bg-background p-2 text-center">
                      <div className="font-display text-lg font-bold text-explorer-gold">{sampleDashboardData.badgesEarned}</div>
                      <div className="text-[10px] text-muted-foreground">Badges</div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Recent Activity</p>
                    {sampleDashboardData.recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg bg-background p-2 text-xs">
                        <span className="text-muted-foreground">{activity.mission}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">{activity.date}</span>
                          <span className="rounded bg-explorer-green/10 px-1.5 py-0.5 font-bold text-explorer-green">{activity.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <EyeIcon className="h-3.5 w-3.5" />
                <span>Track real progress after signup</span>
              </div>
            </motion.div>
          </div>

          {/* Create Free Account CTA */}
          <motion.div
            className="mt-10 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
          >
            <Link to="/login">
              <Button variant="explorer" size="xl" className="gap-2" onClick={() => trackEvent("click_start_free")}>
                <UserPlus className="h-5 w-5" />
                Create Free Account
              </Button>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">No credit card required. Start exploring in seconds.</p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div className="mb-12 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">Why Kids Love It</h2>
            <p className="text-muted-foreground">Learning AI has never been this fun!</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div key={f.title} className="group rounded-2xl bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}>
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}>
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety - Built for Safe, Structured Learning */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div className="mb-12 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-green">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">Built for Safe, Structured Learning</h2>
            <p className="mx-auto max-w-md text-muted-foreground">
              We designed every detail with your child's safety in mind.
            </p>
          </motion.div>
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap justify-center gap-4">
              {trustPoints.map((point, i) => (
                <motion.div
                  key={point.title}
                  className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] rounded-2xl bg-card p-6 shadow-card border border-border/50"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i + 1}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-explorer-green/10">
                    <point.icon className="h-6 w-6 text-explorer-green" />
                  </div>
                  <h3 className="mb-2 font-display text-base font-semibold text-foreground">{point.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Transparency - Track → Module → Lesson → Quiz → Badge */}
      <section className="py-20 bg-gradient-to-br from-explorer-blue/5 via-background to-explorer-coral/5">
        <div className="container mx-auto px-4">
          <motion.div className="mb-12 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-explorer-blue/20 px-4 py-1.5">
              <Map className="h-4 w-4 text-explorer-blue" />
              <span className="text-sm font-bold text-foreground">Curriculum Structure</span>
            </div>
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">Curriculum Transparency</h2>
            <p className="mx-auto max-w-lg text-muted-foreground">
              Clear learning path from start to finish. Know exactly what your child will learn.
            </p>
          </motion.div>

          {/* Track Level */}
          <motion.div
            className="mx-auto max-w-4xl mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <div className="rounded-2xl bg-card p-6 shadow-card border border-explorer-blue/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-blue">
                  <Map className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">{curriculumTrack.trackName}</h3>
                  <p className="text-sm text-muted-foreground">{curriculumTrack.description}</p>
                </div>
              </div>

              {/* Module Flow Indicator */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 overflow-x-auto">
                <span className="flex items-center gap-1 whitespace-nowrap"><Map className="h-3 w-3" /> Track</span>
                <ChevronRight className="h-3 w-3" />
                <span className="flex items-center gap-1 whitespace-nowrap"><FolderOpen className="h-3 w-3" /> Module</span>
                <ChevronRight className="h-3 w-3" />
                <span className="flex items-center gap-1 whitespace-nowrap"><FileText className="h-3 w-3" /> Lesson</span>
                <ChevronRight className="h-3 w-3" />
                <span className="flex items-center gap-1 whitespace-nowrap"><HelpCircle className="h-3 w-3" /> Quiz</span>
                <ChevronRight className="h-3 w-3" />
                <span className="flex items-center gap-1 whitespace-nowrap"><Medal className="h-3 w-3" /> Badge</span>
              </div>

              {/* Modules */}
              <div className="space-y-6">
                {curriculumTrack.modules.map((module, moduleIdx) => (
                  <div key={moduleIdx} className="border border-border/50 rounded-xl overflow-hidden">
                    {/* Module Header */}
                    <div className="bg-muted/50 px-4 py-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-explorer-blue/10">
                        <FolderOpen className="h-4 w-4 text-explorer-blue" />
                      </div>
                      <h4 className="font-display font-semibold text-foreground">{module.moduleName}</h4>
                    </div>

                    {/* Lessons */}
                    <div className="p-4">
                      <div className="space-y-3">
                        {module.lessons.map((lesson, lessonIdx) => (
                          <motion.div
                            key={lessonIdx}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-background border border-border/30"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            custom={lessonIdx + 2}
                          >
                            {/* Lesson Info */}
                            <div className="flex-1 flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-coral shrink-0">
                                <FileText className="h-5 w-5 text-primary-foreground" />
                              </div>
                              <div>
                                <p className="font-display font-semibold text-foreground">{lesson.lessonName}</p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {lesson.duration}</span>
                                  <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {lesson.skillOutcome}</span>
                                </div>
                                {/* Learning Flow Icons */}
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">
                                    <BookOpen className="h-3 w-3 text-explorer-coral" /> Story
                                  </span>
                                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">
                                    <Video className="h-3 w-3 text-explorer-blue" /> Video
                                  </span>
                                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">
                                    <HelpCircle className="h-3 w-3 text-explorer-green" /> Quiz
                                  </span>
                                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">
                                    <Medal className="h-3 w-3 text-explorer-gold" /> Badge
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Quiz & Badge */}
                            <div className="flex items-center gap-2 sm:border-l sm:border-border/30 sm:pl-4">
                              {lesson.hasQuiz && (
                                <div className="flex items-center gap-1 rounded-full bg-explorer-blue/10 px-2 py-1 text-xs">
                                  <HelpCircle className="h-3 w-3 text-explorer-blue" />
                                  <span className="text-explorer-blue font-medium">Quiz</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 rounded-full bg-explorer-gold/10 px-2 py-1 text-xs">
                                <Medal className="h-3 w-3 text-explorer-gold" />
                                <span className="text-explorer-gold font-medium">{lesson.badgeName}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div className="mb-12 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">Level 1 Curriculum</h2>
            <p className="mx-auto max-w-lg text-muted-foreground">
              8 structured missions. Each includes a video lesson, interactive story, quiz, and badge reward.
            </p>
          </motion.div>
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-wider px-4">
              <span className="w-10">#</span>
              <span className="flex-1">Mission</span>
              <span className="w-16 text-center">Time</span>
              <span className="hidden sm:block flex-1 text-right">Skill Outcome</span>
            </div>
            <div className="space-y-3">
              {curriculum.map((lesson, i) => (
                <motion.div
                  key={lesson.id}
                  className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i + 1}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-coral font-display text-sm font-bold text-primary-foreground">
                    {lesson.id}
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-semibold">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">{lesson.skill}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground w-16 justify-center">
                    <Clock className="h-3 w-3" /> {lesson.duration}
                  </div>
                  <div className="hidden sm:flex items-center gap-2 flex-1 justify-end">
                    <Target className="h-3.5 w-3.5 text-explorer-green" />
                    <span className="text-xs text-muted-foreground">{lesson.skill}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link to="/login?preview=true">
                <Button variant="explorer-outline" size="lg">
                  <Play className="h-4 w-4" /> Preview a Sample Mission
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div className="mb-12 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">Trusted by Families & Educators</h2>
            <p className="text-muted-foreground">What parents and teachers are saying.</p>
          </motion.div>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="rounded-2xl bg-card p-6 shadow-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
              >
                <Quote className="mb-3 h-6 w-6 text-explorer-coral/40" />
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xl">{t.avatar}</div>
                  <div>
                    <p className="font-display font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* School logos placeholder */}
          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground/30"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={4}
          >
            {["Lincoln Elementary", "Sunrise Academy", "Greenfield School", "Brightstar Learning"].map((name) => (
              <div key={name} className="flex items-center gap-2 rounded-xl border border-border px-6 py-3">
                <School className="h-5 w-5" />
                <span className="font-display font-semibold text-sm">{name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div className="mb-12 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">Simple, Honest Pricing</h2>
            <p className="text-muted-foreground">No hidden fees. Cancel anytime.</p>
          </motion.div>
          <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-2">
            <motion.div className="rounded-2xl bg-card p-8 shadow-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <h3 className="font-display text-xl font-semibold">Monthly</h3>
              <div className="my-4"><span className="font-display text-4xl font-bold">$9.99</span><span className="text-muted-foreground">/mo</span></div>
              <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-explorer-green" /> All 8 missions</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-explorer-green" /> Up to 3 explorers</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-explorer-green" /> Badges & certificates</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-explorer-green" /> Downloadable worksheets</li>
              </ul>
              <Link to="/pricing"><Button variant="explorer-outline" className="w-full">Choose Monthly</Button></Link>
            </motion.div>
            <motion.div className="relative rounded-2xl bg-card p-8 shadow-playful ring-2 ring-primary" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
              <div className="absolute -top-3 right-6 rounded-full bg-gradient-coral px-3 py-1 text-xs font-bold text-primary-foreground">Save 33%</div>
              <h3 className="font-display text-xl font-semibold">Yearly</h3>
              <div className="my-4"><span className="font-display text-4xl font-bold">$79.99</span><span className="text-muted-foreground">/yr</span></div>
              <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-explorer-green" /> Everything in Monthly</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-explorer-green" /> Priority new content</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-explorer-green" /> Exclusive posters</li>
                <li className="flex items-center gap-2"><Star className="h-4 w-4 text-explorer-gold" /> Best value!</li>
              </ul>
              <Link to="/pricing"><Button variant="explorer" className="w-full">Choose Yearly</Button></Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div className="mb-12 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="mb-3 font-display text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything parents need to know about AI learning.</p>
          </motion.div>
          
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Pricing Questions */}
            <motion.div className="rounded-2xl bg-card p-6 shadow-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <h3 className="mb-4 font-display text-lg font-semibold text-explorer-coral">Pricing & Plans</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-explorer-coral/30 pl-4">
                  <h4 className="mb-2 font-semibold">What's included in the free trial?</h4>
                  <p className="text-sm text-muted-foreground">7 days of full access to all missions, parent dashboard, and progress tracking. No credit card required.</p>
                </div>
                <div className="border-l-4 border-explorer-coral/30 pl-4">
                  <h4 className="mb-2 font-semibold">Can I switch plans anytime?</h4>
                  <p className="text-sm text-muted-foreground">Yes! Upgrade, downgrade, or cancel anytime. Changes take effect at next billing cycle.</p>
                </div>
                <div className="border-l-4 border-explorer-coral/30 pl-4">
                  <h4 className="mb-2 font-semibold">Do you offer school discounts?</h4>
                  <p className="text-sm text-muted-foreground">Yes! We offer custom pricing for schools and districts. Contact us for a quote.</p>
                </div>
              </div>
            </motion.div>

            {/* Safety Questions */}
            <motion.div className="rounded-2xl bg-card p-6 shadow-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
              <h3 className="mb-4 font-display text-lg font-semibold text-explorer-green">Safety & Privacy</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-explorer-green/30 pl-4">
                  <h4 className="mb-2 font-semibold">Is my child's data safe?</h4>
                  <p className="text-sm text-muted-foreground">Absolutely. All data is encrypted, COPPA-compliant, and never shared with third parties. Parents have full control.</p>
                </div>
                <div className="border-l-4 border-explorer-green/30 pl-4">
                  <h4 className="mb-2 font-semibold">Are there ads or social features?</h4>
                  <p className="text-sm text-muted-foreground">No ads, no social media integration, no chat with strangers. Focused, safe learning environment.</p>
                </div>
                <div className="border-l-4 border-explorer-green/30 pl-4">
                  <h4 className="mb-2 font-semibold">Can I monitor my child's progress?</h4>
                  <p className="text-sm text-muted-foreground">Yes! Real-time parent dashboard shows exactly what your child is learning, their progress, and time spent.</p>
                </div>
              </div>
            </motion.div>

            {/* Device & Learning Questions */}
            <motion.div className="rounded-2xl bg-card p-6 shadow-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}>
              <h3 className="mb-4 font-display text-lg font-semibold text-explorer-blue">Devices & Learning</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-explorer-blue/30 pl-4">
                  <h4 className="mb-2 font-semibold">What devices work with FuturExplore?</h4>
                  <p className="text-sm text-muted-foreground">Works on any modern web browser on desktop, tablet, or mobile. No downloads required.</p>
                </div>
                <div className="border-l-4 border-explorer-blue/30 pl-4">
                  <h4 className="mb-2 font-semibold">How much screen time per lesson?</h4>
                  <p className="text-sm text-muted-foreground">Each mission is 5-7 minutes, designed for children's attention spans. Parents set daily limits.</p>
                </div>
                <div className="border-l-4 border-explorer-blue/30 pl-4">
                  <h4 className="mb-2 font-semibold">Can multiple children use one account?</h4>
                  <p className="text-sm text-muted-foreground">Yes! Family plans support up to 3 explorer profiles with individual progress tracking.</p>
                </div>
              </div>
            </motion.div>

            {/* Learning Outcomes Questions */}
            <motion.div className="rounded-2xl bg-card p-6 shadow-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}>
              <h3 className="mb-4 font-display text-lg font-semibold text-explorer-gold">Learning Outcomes</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-explorer-gold/30 pl-4">
                  <h4 className="mb-2 font-semibold">What will my child learn?</h4>
                  <p className="text-sm text-muted-foreground">Core AI concepts: what AI is, how it learns, pattern recognition, and real-world applications. Perfect for ages 6-13.</p>
                </div>
                <div className="border-l-4 border-explorer-gold/30 pl-4">
                  <h4 className="mb-2 font-semibold">How is progress measured?</h4>
                  <p className="text-sm text-muted-foreground">Through interactive quizzes, skill badges, and mission completion. Parents see detailed progress reports.</p>
                </div>
                <div className="border-l-4 border-explorer-gold/30 pl-4">
                  <h4 className="mb-2 font-semibold">Are the certificates real?</h4>
                  <p className="text-sm text-muted-foreground">Yes! Completion certificates and badges can be downloaded and shared. Perfect for portfolios and motivation.</p>
                </div>
              </div>
            </motion.div>

            {/* Contact CTA */}
            <motion.div className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={5}>
              <p className="mb-4 text-muted-foreground">Still have questions? We're here to help!</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button variant="explorer-outline" size="lg">
                    <MessageCircleOff className="h-4 w-4" /> Contact Support
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="explorer" size="lg">
                    <School className="h-4 w-4" /> View All Plans
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-coral py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <Users className="mx-auto mb-4 h-10 w-10 text-primary-foreground/80" />
            <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl">Ready to Start the Adventure?</h2>
            <p className="mx-auto mb-8 max-w-md text-primary-foreground/80">Give your child the gift of understanding AI — through play, discovery, and adventure.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login">
                <Button variant="outline" size="xl" className="border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground/10" onClick={() => trackEvent("click_start_free")}>
                  <Zap className="h-5 w-5" />
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="xl" className="border-2 border-primary-foreground/50 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                  <School className="h-5 w-5" />
                  School Plans
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
