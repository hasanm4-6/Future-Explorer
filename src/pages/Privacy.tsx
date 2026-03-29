import { Shield, Eye, Trash2, Users, Lock, Database } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
} as const;

const policies = [
  {
    icon: Database,
    title: "Minimal Data Collection",
    desc: "We only collect what's needed: parent email, child name, age band, and learning progress. No unnecessary personal data.",
  },
  {
    icon: Users,
    title: "Parent Control",
    desc: "Parents have full control over their children's accounts. You can view, edit, or delete any child profile at any time.",
  },
  {
    icon: Trash2,
    title: "Account Deletion",
    desc: "You can delete your account and all associated data at any time from Account Settings. It's permanent and immediate.",
  },
  {
    icon: Eye,
    title: "Role-Based Access",
    desc: "Children can only access their own missions and badges. Parents see progress dashboards. Teachers see classroom-level data only.",
  },
  {
    icon: Lock,
    title: "No Third-Party Sharing",
    desc: "We never sell or share your data with third parties. Your child's learning data stays private.",
  },
  {
    icon: Shield,
    title: "COPPA Compliant",
    desc: "Future Explorer is designed to comply with the Children's Online Privacy Protection Act. We take children's privacy seriously.",
  },
];

const Privacy = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <motion.div className="mb-10 text-center" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-green">
          <Shield className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold">Privacy & Safety</h1>
        <p className="mt-2 text-muted-foreground">
          We believe in transparency. Here's how we protect your family's data, written in plain language.
        </p>
      </motion.div>

      <div className="space-y-6">
        {policies.map((policy, i) => (
          <motion.div
            key={policy.title}
            className="flex items-start gap-4 rounded-2xl bg-card p-6 shadow-card"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i + 1}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-explorer-green/10">
              <policy.icon className="h-5 w-5 text-explorer-green" />
            </div>
            <div>
              <h3 className="font-display font-bold">{policy.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{policy.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-10 rounded-2xl bg-muted p-6 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={8}
      >
        <p className="text-sm text-muted-foreground">
          Have questions about privacy? Contact us at{" "}
          <span className="font-semibold text-foreground">privacy@futureexplorer.app</span>
        </p>
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default Privacy;
