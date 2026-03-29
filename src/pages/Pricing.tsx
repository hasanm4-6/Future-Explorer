import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Zap, Users, School, GraduationCap, Shield, Award, BookOpen, Target, Clock, Headphones, Download, BarChart3, Crown } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { trackEvent } from "@/lib/tracking";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
} as const;

const familyPlans = [
  {
    name: "Monthly Explorer",
    price: "$9.99",
    period: "/month",
    badge: null,
    description: "Perfect for families starting their AI journey",
    features: [
      { icon: BookOpen, text: "All 8 interactive AI missions" },
      { icon: Users, text: "Up to 3 explorer profiles" },
      { icon: Award, text: "Badges & completion certificates" },
      { icon: Download, text: "Downloadable worksheets & activities" },
      { icon: BarChart3, text: "Parent dashboard & progress tracking" },
      { icon: Headphones, text: "Email support within 24 hours" },
    ],
    cta: "Start Free Trial",
    variant: "explorer-outline" as const,
    highlight: false,
  },
  {
    name: "Yearly Explorer",
    price: "$79.99",
    period: "/year",
    badge: "Save 33% — Best Value",
    description: "Everything families need for comprehensive AI learning",
    features: [
      { icon: BookOpen, text: "All 8 interactive AI missions" },
      { icon: Users, text: "Up to 3 explorer profiles" },
      { icon: Award, text: "Badges & completion certificates" },
      { icon: Download, text: "Downloadable worksheets & activities" },
      { icon: BarChart3, text: "Advanced parent dashboard & analytics" },
      { icon: Crown, text: "Priority access to new lessons & content" },
      { icon: Target, text: "Exclusive printable posters & rewards" },
      { icon: Clock, text: "Early access to Level 2 content" },
      { icon: Headphones, text: "Priority support within 12 hours" },
    ],
    cta: "Start Free Trial",
    variant: "explorer" as const,
    highlight: true,
  },
];

const schoolPlans = [
  {
    name: "Teacher Starter",
    price: "$29",
    period: "/month",
    badge: null,
    description: "Perfect for individual teachers and small classrooms",
    features: [
      { icon: Users, text: "Up to 30 student accounts" },
      { icon: BarChart3, text: "Teacher dashboard & analytics" },
      { icon: Target, text: "Individual student progress tracking" },
      { icon: Award, text: "Class-wide performance insights" },
      { icon: Download, text: "Printable worksheets & lesson plans" },
      { icon: BookOpen, text: "Access to all AI missions" },
      { icon: Headphones, text: "Email support within 24 hours" },
    ],
    cta: "Start Free Trial",
    variant: "explorer-outline" as const,
    highlight: false,
  },
  {
    name: "School License",
    price: "Custom",
    period: "",
    badge: "Contact for Pricing",
    description: "Complete solution for schools and districts",
    features: [
      { icon: Users, text: "Unlimited student accounts" },
      { icon: School, text: "Multiple classroom management" },
      { icon: Shield, text: "Admin dashboard for school oversight" },
      { icon: BarChart3, text: "Advanced analytics & reporting" },
      { icon: Award, text: "Custom certificates & branding" },
      { icon: BookOpen, text: "Full curriculum access" },
      { icon: Clock, text: "LMS integration (coming soon)" },
      { icon: Headphones, text: "Dedicated account manager" },
    ],
    cta: "Book a Demo",
    variant: "explorer" as const,
    highlight: true,
  },
];

type PricingTab = "families" | "schools";

const Pricing = () => {
  const [tab, setTab] = useState<PricingTab>("families");
  const plans = tab === "families" ? familyPlans : schoolPlans;

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div className="mb-10 text-center" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <h1 className="mb-3 font-display text-4xl font-bold md:text-5xl">Choose Your Plan</h1>
            <p className="mx-auto max-w-md text-muted-foreground">Simple pricing for families and schools. Start with a free 7-day trial — cancel anytime.</p>
          </motion.div>

          {/* Tab Switcher */}
          <motion.div className="mb-10 flex justify-center" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <div className="inline-flex rounded-2xl bg-muted p-1">
              <button
                onClick={() => setTab("families")}
                className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold font-display transition-all ${
                  tab === "families" ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="h-4 w-4" /> Families
              </button>
              <button
                onClick={() => setTab("schools")}
                className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold font-display transition-all ${
                  tab === "schools" ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <School className="h-4 w-4" /> Schools & Teachers
              </button>
            </div>
          </motion.div>

          <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`relative rounded-2xl bg-card p-8 shadow-card ${plan.highlight ? "ring-2 ring-primary shadow-playful" : ""}`}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i + 2}
              >
                {plan.badge && (
                  <div className="absolute -top-3 right-6 flex items-center gap-1 rounded-full bg-gradient-coral px-3 py-1 text-xs font-bold text-primary-foreground">
                    <Star className="h-3 w-3" /> {plan.badge}
                  </div>
                )}
                <div className="mb-2 flex items-center gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tab === "families" ? "bg-gradient-coral" : "bg-gradient-blue"}`}>
                    {tab === "families" ? <Users className="h-5 w-5 text-primary-foreground" /> : <GraduationCap className="h-5 w-5 text-primary-foreground" />}
                  </div>
                  <h2 className="font-display text-xl font-semibold">{plan.name}</h2>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>
                <div className="my-4">
                  <span className="font-display text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <feature.icon className="h-4 w-4 shrink-0 text-explorer-green" />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
                <Link to={tab === "schools" && plan.highlight ? "/teacher" : "/login"}>
                  <Button variant={plan.variant} size="lg" className="w-full" onClick={() => {
                    trackEvent("subscription_started", {
                      plan: plan.name,
                      planType: tab,
                      price: plan.price
                    });
                  }}>
                    <Zap className="h-4 w-4" /> {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            All plans include a <strong>7-day free trial</strong>. No credit card required to start.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Pricing;
