import { Button } from "@/components/ui/button";
import { Download, FileText, Image, Award } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
} as const;

const worksheets = [
  { title: "What is AI? Activity Sheet", type: "PDF", icon: FileText },
  { title: "Pattern Matching Game", type: "PDF", icon: FileText },
  { title: "Train Your Own Robot!", type: "PDF", icon: FileText },
  { title: "AI in Everyday Life", type: "PDF", icon: FileText },
];

const posters = [
  { title: "How AI Learns Poster", type: "PNG", icon: Image },
  { title: "AI Explorer Badge Wall", type: "PNG", icon: Image },
];

const certificates = [
  { title: "Mia's Level 1 Certificate", child: "🦊 Mia", icon: Award, ready: false },
  { title: "Leo's Level 1 Certificate", child: "🐯 Leo", icon: Award, ready: false },
];

const Downloads = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <h1 className="font-display text-3xl font-bold">Downloads & Certificates</h1>
        <p className="text-muted-foreground">Printable resources and achievements for your explorers.</p>
      </motion.div>

      {/* Worksheets */}
      <motion.h2 className="mb-4 font-display text-xl font-bold" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
        📄 Worksheets
      </motion.h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {worksheets.map((item, i) => (
          <motion.div key={item.title} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-card" initial="hidden" animate="visible" variants={fadeUp} custom={i + 2}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-blue">
              <item.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.type}</p>
            </div>
            <Button variant="explorer-outline" size="sm"><Download className="h-4 w-4" /></Button>
          </motion.div>
        ))}
      </div>

      {/* Posters */}
      <motion.h2 className="mb-4 font-display text-xl font-bold" initial="hidden" animate="visible" variants={fadeUp} custom={7}>
        🖼️ Posters
      </motion.h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {posters.map((item, i) => (
          <motion.div key={item.title} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-card" initial="hidden" animate="visible" variants={fadeUp} custom={i + 8}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-gold">
              <item.icon className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.type}</p>
            </div>
            <Button variant="explorer-outline" size="sm"><Download className="h-4 w-4" /></Button>
          </motion.div>
        ))}
      </div>

      {/* Certificates */}
      <motion.h2 className="mb-4 font-display text-xl font-bold" initial="hidden" animate="visible" variants={fadeUp} custom={10}>
        🏆 Certificates
      </motion.h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {certificates.map((cert, i) => (
          <motion.div key={cert.title} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-card" initial="hidden" animate="visible" variants={fadeUp} custom={i + 11}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-coral">
              <cert.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold">{cert.title}</p>
              <p className="text-xs text-muted-foreground">{cert.child}</p>
            </div>
            <Button variant="ghost" size="sm" disabled>
              Complete Level 1 first
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default Downloads;
