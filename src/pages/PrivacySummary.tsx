import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Shield, 
  Users, 
  Database, 
  Eye, 
  Lock, 
  CheckCircle, 
  Clock,
  Trash2,
  Download,
  Mail
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const PrivacySummary = () => {
  const privacyPrinciples = [
    {
      icon: Shield,
      title: "Safety First",
      description: "Your child's safety is our top priority. No ads, no external links, no social features.",
      color: "text-explorer-green"
    },
    {
      icon: Database,
      title: "Minimal Data",
      description: "We only collect what's essential: email, child names, ages, and learning progress. That's it.",
      color: "text-explorer-blue"
    },
    {
      icon: Lock,
      title: "Privacy by Default",
      description: "All data is encrypted and never shared with third parties. You control everything.",
      color: "text-explorer-coral"
    },
    {
      icon: Users,
      title: "Parent in Control",
      description: "Only parents can manage accounts. Kids can only access their learning activities.",
      color: "text-explorer-gold"
    }
  ];

  const whatWeCollect = [
    {
      title: "Parent Email",
      why: "To create and secure your account",
      usage: "Account management and important updates",
      retention: "Until you delete your account"
    },
    {
      title: "Child Name & Age",
      why: "To personalize learning and ensure age-appropriate content",
      usage: "Learning progress tracking and achievements",
      retention: "Until you delete the child profile"
    },
    {
      title: "Learning Progress",
      why: "To track educational progress and provide reports",
      usage: "Progress reports and lesson recommendations",
      retention: "Until you delete your account"
    }
  ];

  const yourRights = [
    {
      icon: Eye,
      title: "See Your Data",
      description: "View everything we store about your family anytime in Settings."
    },
    {
      icon: Download,
      title: "Export Your Data",
      description: "Download a complete copy of your data in a simple format."
    },
    {
      icon: Trash2,
      title: "Delete Everything",
      description: "Permanently delete your account and all associated data anytime."
    },
    {
      icon: Mail,
      title: "Contact Us",
      description: "Questions about privacy? We're here to help at privacy@futurexplore.app"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <motion.div
          className="mb-12 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-green">
            <Shield className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="mb-4 font-display text-4xl font-bold">Privacy in Simple Terms</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We believe in protecting children's privacy. Here's what we do with your data, explained in plain English.
          </p>
        </motion.div>

        <motion.div
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
        >
          <h2 className="mb-6 font-display text-2xl font-bold text-center">Our Privacy Promises</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {privacyPrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                className="text-center"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={index + 2}
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto">
                  <principle.icon className={`h-8 w-8 ${principle.color}`} />
                </div>
                <h3 className="mb-2 font-display text-lg font-bold">{principle.title}</h3>
                <p className="text-sm text-muted-foreground">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mb-12 rounded-2xl bg-card p-8 shadow-card"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={6}
        >
          <h2 className="mb-6 font-display text-xl font-bold">What We Collect & Why</h2>
          <div className="space-y-6">
            {whatWeCollect.map((item, index) => (
              <motion.div
                key={item.title}
                className="border-l-4 border-explorer-blue pl-6"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={index + 7}
              >
                <h3 className="mb-2 font-bold text-lg">{item.title}</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <h4 className="font-semibold text-sm text-explorer-green mb-1">Why We Need It</h4>
                    <p className="text-sm text-muted-foreground">{item.why}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-explorer-blue mb-1">How We Use It</h4>
                    <p className="text-sm text-muted-foreground">{item.usage}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-explorer-coral mb-1">How Long We Keep It</h4>
                    <p className="text-sm text-muted-foreground">{item.retention}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mb-12 rounded-2xl bg-card p-8 shadow-card"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={10}
        >
          <h2 className="mb-6 font-display text-xl font-bold">Your Rights & Control</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {yourRights.map((right, index) => (
              <motion.div
                key={right.title}
                className="flex items-start gap-4 p-4 rounded-xl border border-border"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={index + 11}
              >
                <right.icon className="h-6 w-6 text-explorer-gold mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="mb-2 font-bold">{right.title}</h3>
                  <p className="text-sm text-muted-foreground">{right.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mb-12 rounded-2xl bg-gradient-green/10 border border-explorer-green/20 p-6"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={15}
        >
          <div className="flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-explorer-green mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="mb-2 font-bold text-explorer-green">COPPA Compliant</h3>
              <p className="text-sm text-muted-foreground">
                We follow the Children's Online Privacy Protection Act (COPPA). This means we don't collect personal information 
                from children under 13 without parental consent, and we never use data for advertising or profiling.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={16}
        >
          <div className="mb-6 rounded-2xl bg-muted p-6">
            <h3 className="mb-3 font-display text-lg font-bold">Have Questions?</h3>
            <p className="mb-4 text-muted-foreground">
              We're here to help with any privacy or data questions.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a 
                href="mailto:privacy@futurexplore.app" 
                className="inline-flex items-center gap-2 rounded-xl bg-explorer-blue px-4 py-2 text-white hover:bg-explorer-blue/90 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Email Privacy Team
              </a>
              <a 
                href="/privacy" 
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 hover:bg-muted transition-colors"
              >
                <Database className="h-4 w-4" />
                Read Full Policy
              </a>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacySummary;
