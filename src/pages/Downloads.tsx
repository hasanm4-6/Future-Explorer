import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Download, FileText, Image, Award, Loader2, Lock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { useToast } from "@/hooks/use-toast";
import type { DbChildProfile } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
} as const;

// ── Static resource lists ─────────────────────────────────────────────────────
// Set `href` to the actual path once files are added to public/downloads/
const worksheets: Array<{ title: string; description: string; href: string | null }> = [
  { title: "What is AI? Activity Sheet",  description: "Lesson 1 companion worksheet",   href: null },
  { title: "Pattern Matching Game",        description: "Spot the pattern — Lesson 3",    href: null },
  { title: "Train Your Own Robot!",        description: "Data & examples — Lesson 4",     href: null },
  { title: "AI in Everyday Life",          description: "Find AI around you — Lesson 2",  href: null },
];

const posters: Array<{ title: string; description: string; href: string | null }> = [
  { title: "How AI Learns Poster",       description: "Full-colour A3 classroom poster", href: null },
  { title: "AI Explorer Badge Wall",     description: "Display all 8 earned badges",     href: null },
];

// ── Certificate canvas generator ─────────────────────────────────────────────
function generateCertificate(child: DbChildProfile): Promise<void> {
  return new Promise((resolve) => {
    const W = 1400;
    const H = 990;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "#FDF6ED";
    ctx.fillRect(0, 0, W, H);

    // Outer coral border
    ctx.strokeStyle = "#F26A42";
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    // Inner gold border
    ctx.strokeStyle = "#F8C43A";
    ctx.lineWidth = 5;
    ctx.strokeRect(50, 50, W - 100, H - 100);

    // Corner stars
    const corners: [number, number][] = [[70, 72], [W - 118, 72], [70, H - 90], [W - 118, H - 90]];
    ctx.font = "44px serif";
    corners.forEach(([x, y]) => ctx.fillText("⭐", x, y));

    // Academy header
    ctx.font = "bold 26px Arial, sans-serif";
    ctx.fillStyle = "#F26A42";
    ctx.textAlign = "center";
    ctx.letterSpacing = "4px";
    ctx.fillText("FUTURE EXPLORER AI ACADEMY", W / 2, 130);
    ctx.letterSpacing = "0px";

    // Separator
    const drawLine = (y: number, color: string, width: number) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(220, y);
      ctx.lineTo(W - 220, y);
      ctx.stroke();
    };
    drawLine(150, "#F8C43A", 3);

    // Main title
    ctx.font = "bold 72px Arial, sans-serif";
    ctx.fillStyle = "#1A1F3A";
    ctx.fillText("Certificate of Achievement", W / 2, 240);

    // Sub-label
    ctx.font = "30px Arial, sans-serif";
    ctx.fillStyle = "#9CA3AF";
    ctx.fillText("This is to certify that", W / 2, 310);

    // Child avatar — large emoji
    ctx.font = "110px serif";
    ctx.fillText(child.avatar, W / 2, 435);

    // Child name
    ctx.font = "bold 84px Arial, sans-serif";
    ctx.fillStyle = "#F26A42";
    ctx.fillText(child.name, W / 2, 540);

    // Name underline
    const nameWidth = ctx.measureText(child.name).width;
    ctx.strokeStyle = "#F26A42";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W / 2 - nameWidth / 2, 558);
    ctx.lineTo(W / 2 + nameWidth / 2, 558);
    ctx.stroke();

    // Completion text
    ctx.font = "30px Arial, sans-serif";
    ctx.fillStyle = "#6B7280";
    ctx.fillText("has successfully completed", W / 2, 620);

    // Course name
    ctx.font = "bold 42px Arial, sans-serif";
    ctx.fillStyle = "#1A1F3A";
    ctx.fillText("Level 1: Introduction to Artificial Intelligence", W / 2, 680);

    // Badges row
    ctx.font = "56px serif";
    ctx.fillText("🤖  🧠  🏆  🚀  ⭐", W / 2, 760);

    // Date
    const date = child.progress?.lessons_completed
      ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
      : "";
    ctx.font = "24px Arial, sans-serif";
    ctx.fillStyle = "#9CA3AF";
    ctx.fillText(`Completed on ${date}`, W / 2, 820);

    drawLine(848, "#F8C43A", 3);

    // Footer
    ctx.font = "20px Arial, sans-serif";
    ctx.fillStyle = "#C4C4C4";
    ctx.fillText("Future Explorer AI Academy  ·  Empowering Young AI Thinkers", W / 2, 890);

    // Trigger download
    canvas.toBlob((blob) => {
      if (!blob) { resolve(); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${child.name.replace(/\s+/g, "-")}-Level1-Certificate.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

const ResourceRow = ({
  icon: Icon,
  iconBg,
  title,
  description,
  type,
  href,
  custom,
  onComingSoonClick,
}: {
  icon: React.ElementType;
  iconBg: string;
  title: string;
  description: string;
  type: string;
  href: string | null;
  custom: number;
  onComingSoonClick: () => void;
}) => (
  <motion.div
    className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-card"
    initial="hidden" animate="visible" variants={fadeUp} custom={custom}
  >
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
      <Icon className="h-5 w-5 text-primary-foreground" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-display font-semibold truncate">{title}</p>
      <p className="text-xs text-muted-foreground">{description} &middot; {type}</p>
    </div>
    {href ? (
      <a href={href} download>
        <Button variant="explorer-outline" size="sm">
          <Download className="h-4 w-4" /> Download
        </Button>
      </a>
    ) : (
      <Button variant="ghost" size="sm" className="text-muted-foreground text-xs" onClick={onComingSoonClick}>
        Coming Soon
      </Button>
    )}
  </motion.div>
);

const CertificateRow = ({
  child,
  custom,
  onDownload,
  isGenerating,
}: {
  child: DbChildProfile;
  custom: number;
  onDownload: (child: DbChildProfile) => void;
  isGenerating: boolean;
}) => {
  const completed = (child.progress?.lessons_completed ?? 0) >= 8;

  return (
    <motion.div
      className={`flex items-center gap-4 rounded-2xl bg-card p-4 shadow-card transition-all ${!completed ? "opacity-70" : ""}`}
      initial="hidden" animate="visible" variants={fadeUp} custom={custom}
    >
      {/* Avatar */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-coral text-2xl">
        {child.avatar}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold">{child.name}&apos;s Level 1 Certificate</p>
        <div className="mt-0.5 flex items-center gap-2">
          {completed ? (
            <span className="flex items-center gap-1 text-xs font-bold text-explorer-green">
              <CheckCircle className="h-3 w-3" /> Level 1 Complete — Ready to download!
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              {child.progress?.lessons_completed ?? 0}/8 missions done — complete all to unlock
            </span>
          )}
        </div>
      </div>

      {/* Progress bar (not completed) */}
      {!completed && (
        <div className="hidden sm:block w-24">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-coral"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(((child.progress?.lessons_completed ?? 0) / 8) * 100)}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <p className="mt-0.5 text-center text-[10px] text-muted-foreground">
            {child.progress?.lessons_completed ?? 0}/8
          </p>
        </div>
      )}

      {/* Action */}
      <Button
        variant={completed ? "explorer" : "ghost"}
        size="sm"
        disabled={!completed || isGenerating}
        onClick={() => completed && onDownload(child)}
        className="shrink-0"
      >
        {isGenerating ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
        ) : completed ? (
          <><Award className="h-4 w-4" /> Download</>
        ) : (
          <Lock className="h-4 w-4" />
        )}
      </Button>
    </motion.div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const Downloads = () => {
  const { toast } = useToast();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const { data: childrenRes, isLoading } = useQuery({
    queryKey: queryKeys.children.all,
    queryFn: () => api.getChildren(),
    staleTime: 5 * 60 * 1000,
  });
  const children: DbChildProfile[] = childrenRes?.data ?? [];

  const handleCertificateDownload = async (child: DbChildProfile) => {
    setGeneratingId(child.id);
    try {
      await generateCertificate(child);
      toast({ title: "Certificate downloaded! 🎉", description: `${child.name}'s Level 1 certificate is in your downloads folder.` });
    } catch {
      toast({ title: "Download failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setGeneratingId(null);
    }
  };

  const handleComingSoon = (title: string) => {
    toast({ title: "Coming soon!", description: `"${title}" will be available in the next update.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-8">

        {/* Header */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <h1 className="font-display text-3xl font-bold">Downloads & Certificates</h1>
          <p className="text-muted-foreground">Printable resources and personalised certificates for your explorers.</p>
        </motion.div>

        {/* Worksheets */}
        <motion.h2 className="mb-3 font-display text-xl font-bold" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          📄 Worksheets
        </motion.h2>
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {worksheets.map((item, i) => (
            <ResourceRow
              key={item.title}
              icon={FileText}
              iconBg="bg-gradient-blue"
              title={item.title}
              description={item.description}
              type="PDF"
              href={item.href}
              custom={i + 2}
              onComingSoonClick={() => handleComingSoon(item.title)}
            />
          ))}
        </div>

        {/* Posters */}
        <motion.h2 className="mb-3 font-display text-xl font-bold" initial="hidden" animate="visible" variants={fadeUp} custom={7}>
          🖼️ Posters
        </motion.h2>
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {posters.map((item, i) => (
            <ResourceRow
              key={item.title}
              icon={Image}
              iconBg="bg-gradient-gold"
              title={item.title}
              description={item.description}
              type="PNG"
              href={item.href}
              custom={i + 8}
              onComingSoonClick={() => handleComingSoon(item.title)}
            />
          ))}
        </div>

        {/* Certificates */}
        <motion.h2 className="mb-3 font-display text-xl font-bold" initial="hidden" animate="visible" variants={fadeUp} custom={10}>
          🏆 Certificates
        </motion.h2>
        <motion.p className="mb-4 text-sm text-muted-foreground" initial="hidden" animate="visible" variants={fadeUp} custom={11}>
          Personalised certificates are generated instantly from your child's real progress data. Available once all 8 Level 1 missions are complete.
        </motion.p>

        {isLoading ? (
          <div className="flex items-center justify-center rounded-2xl bg-card p-12 shadow-card">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : children.length === 0 ? (
          <motion.div
            className="rounded-2xl bg-card p-8 text-center shadow-card"
            initial="hidden" animate="visible" variants={fadeUp} custom={12}
          >
            <Award className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-display font-bold">No explorer profiles yet</p>
            <p className="text-sm text-muted-foreground">Add a child profile from the dashboard to start earning certificates.</p>
          </motion.div>
        ) : (
          <div className="grid gap-3">
            {children.map((child, i) => (
              <CertificateRow
                key={child.id}
                child={child}
                custom={i + 12}
                onDownload={handleCertificateDownload}
                isGenerating={generatingId === child.id}
              />
            ))}
          </div>
        )}

        {/* Certificate preview info */}
        <motion.div
          className="mt-6 rounded-2xl border border-dashed border-border bg-card/50 p-4 text-center"
          initial="hidden" animate="visible" variants={fadeUp} custom={15}
        >
          <p className="text-xs text-muted-foreground">
            Certificates are generated as high-resolution PNG images (1400×990px) and downloaded directly to your device — no server upload, fully private.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Downloads;
