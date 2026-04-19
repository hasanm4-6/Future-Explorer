import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Download, Trash2, Eye, FileText, Shield, AlertTriangle,
  Users, Loader2, CheckCircle, Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { clearLocalAccountData } from "@/lib/account";
import { auditDataExported, auditDataDeleted } from "@/lib/audit";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

// ── Export helper ─────────────────────────────────────────────────────────────

async function buildAndDownloadExport(userId: string, userName: string): Promise<void> {
  // 1. Fetch parent profile
  const profileRes = await api.profile() as { user: Record<string, unknown> };
  const profile = profileRes?.user ?? {};

  // 2. Fetch children
  const childrenRes = await api.getChildren();
  const children = childrenRes?.data ?? [];

  // 3. Fetch lesson progress for each child
  const childrenWithProgress = await Promise.all(
    children.map(async (child) => {
      const lessonsRes = await api.getLessons(child.id, 1);
      return {
        id: child.id,
        name: child.name,
        age: child.age,
        age_band: child.age_band,
        avatar: child.avatar,
        learning_level: child.learning_level,
        created_at: child.created_at,
        gamification: {
          total_xp: child.progress?.total_xp ?? 0,
          streak_days: child.progress?.streak_days ?? 0,
          lessons_completed: child.progress?.lessons_completed ?? 0,
          badges: child.progress?.badges ?? [],
          topics_covered: child.progress?.topics_covered ?? [],
        },
        lessons: (lessonsRes?.data?.lessons ?? []).map((l) => ({
          id: l.id,
          title: l.title,
          status: l.status,
          quiz_score: l.quiz_score,
          completed_at: l.completed_at,
          scenes_completed: l.completed_scenes.length,
        })),
      };
    }),
  );

  // 4. Compile full export object
  const exportData = {
    export_info: {
      exported_at: new Date().toISOString(),
      exported_by: userName,
      format_version: "1.0",
    },
    account: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      created_at: profile.created_at,
    },
    children: childrenWithProgress,
  };

  // 5. Trigger download
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `future-explorer-data-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // 6. Audit log
  auditDataExported(userId, "full_account_data");
}

// ── DataManagement ────────────────────────────────────────────────────────────

const DataManagement = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isExporting, setIsExporting] = useState(false);
  const [deleteStep, setDeleteStep] = useState<"idle" | "confirm" | "password">("idle");
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  // Prefetch children count for the data preview
  const { data: childrenRes } = useQuery({
    queryKey: queryKeys.children.all,
    queryFn: () => api.getChildren(),
    staleTime: 5 * 60 * 1000,
  });
  const children = childrenRes?.data ?? [];
  const totalBadges = children.reduce((acc, c) => acc + (c.progress?.badges?.length ?? 0), 0);
  const totalLessonsCompleted = children.reduce((acc, c) => acc + (c.progress?.lessons_completed ?? 0), 0);

  // ── Export ──────────────────────────────────────────────────────────────────
  const handleExportData = async () => {
    if (!user) return;
    setIsExporting(true);
    setExportDone(false);
    try {
      await buildAndDownloadExport(user.id, user.name ?? "Parent");
      setExportDone(true);
      toast({
        title: "Data exported!",
        description: "Your complete data has been downloaded as a JSON file.",
      });
    } catch (err) {
      console.error("Export failed:", err);
      toast({
        title: "Export failed",
        description: "Could not fetch your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (!user || !password) return;
    setIsDeleting(true);
    try {
      await api.deleteAccount({ currentPassword: password, confirmation: "DELETE" });
      auditDataDeleted(user.id, "full_account_deletion");

      // Clear local state + query cache, then redirect
      clearLocalAccountData();
      await logout();
      queryClient.clear();

      toast({ title: "Account deleted", description: "Your account and all data have been permanently removed." });
      navigate("/", { replace: true });
    } catch (err) {
      const msg = (err as Error)?.message ?? "Incorrect password or server error.";
      toast({ title: "Deletion failed", description: msg, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Data category cards ─────────────────────────────────────────────────────
  const dataCategories = [
    {
      icon: Shield,
      title: "Account Information",
      description: `Email, name, account settings${user?.email ? ` (${user.email})` : ""}`,
    },
    {
      icon: Users,
      title: "Child Profiles",
      description: `${children.length} profile${children.length !== 1 ? "s" : ""} — names, ages, avatars`,
    },
    {
      icon: FileText,
      title: "Learning Progress",
      description: `${totalLessonsCompleted} lessons completed · ${totalBadges} badges earned`,
    },
    {
      icon: Eye,
      title: "Activity Logs",
      description: "Login history and major account actions (local only)",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-2xl px-4 py-8">

        {/* Header */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <h1 className="mb-2 font-display text-3xl font-bold">Data Management</h1>
          <p className="text-muted-foreground">
            Control your data. Export everything anytime or permanently delete your account.
          </p>
        </motion.div>

        {/* What we store */}
        <motion.div className="mb-8 rounded-2xl bg-card p-6 shadow-card" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          <h2 className="mb-4 font-display text-lg font-bold">What Data We Store</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {dataCategories.map((category, i) => (
              <motion.div
                key={category.title}
                className="flex items-start gap-3 rounded-xl border border-border p-4"
                initial="hidden" animate="visible" variants={fadeUp} custom={i + 2}
              >
                <category.icon className="mt-0.5 h-5 w-5 shrink-0 text-explorer-blue" />
                <div>
                  <h3 className="mb-0.5 font-semibold">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Export */}
        <motion.div className="mb-8 rounded-2xl bg-card p-6 shadow-card" initial="hidden" animate="visible" variants={fadeUp} custom={6}>
          <h2 className="mb-1 font-display text-lg font-bold">Export Your Data</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Downloads a complete JSON file with your account details, all child profiles, and full lesson progress — fetched live from our servers, not from cache.
          </p>

          {/* What's included */}
          <div className="mb-5 rounded-xl bg-muted/60 p-4 text-sm">
            <p className="mb-2 font-semibold">Included in export:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-explorer-green shrink-0" /> Account profile (name, email, created date)</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-explorer-green shrink-0" /> All child profiles with ages and avatars</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-explorer-green shrink-0" /> Lesson progress, quiz scores &amp; completion dates</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-explorer-green shrink-0" /> XP totals, badges earned, streaks</li>
            </ul>
          </div>

          <Button
            onClick={handleExportData}
            disabled={isExporting}
            variant={exportDone ? "explorer-outline" : "explorer"}
            className="gap-2"
          >
            {isExporting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Fetching your data…</>
            ) : exportDone ? (
              <><CheckCircle className="h-4 w-4 text-explorer-green" /> Exported — Download Again</>
            ) : (
              <><Download className="h-4 w-4" /> Export All Data</>
            )}
          </Button>
        </motion.div>

        {/* Delete Account */}
        <motion.div
          className="rounded-2xl bg-card p-6 shadow-card border-2 border-destructive/20"
          initial="hidden" animate="visible" variants={fadeUp} custom={7}
        >
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-destructive">
            <AlertTriangle className="h-5 w-5" /> Delete Account
          </h2>

          <AnimatePresence mode="wait">
            {/* Step 1: Initial prompt */}
            {deleteStep === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="mb-4 text-sm text-muted-foreground">
                  Permanently deletes your account, all child profiles, lesson progress, badges, and XP from our servers. This cannot be undone.
                </p>
                <Button onClick={() => setDeleteStep("confirm")} variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" /> Delete My Account
                </Button>
              </motion.div>
            )}

            {/* Step 2: What will be deleted */}
            {deleteStep === "confirm" && (
              <motion.div key="confirm" className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <p className="mb-2 font-semibold text-destructive">This will permanently delete:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Your parent account and login credentials</li>
                    <li>• {children.length} child profile{children.length !== 1 ? "s" : ""} and all their data</li>
                    <li>• {totalLessonsCompleted} lessons of progress and {totalBadges} badges</li>
                    <li>• All XP, streaks, and learning history</li>
                    <li>• Account settings and activity logs</li>
                  </ul>
                </div>
                <p className="text-sm font-semibold">We recommend exporting your data before deleting.</p>
                <div className="flex gap-3">
                  <Button onClick={() => setDeleteStep("password")} variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" /> Continue to Delete
                  </Button>
                  <Button onClick={() => setDeleteStep("idle")} variant="outline">Cancel</Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Password confirmation */}
            {deleteStep === "password" && (
              <motion.div key="password" className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                  <p className="text-sm font-semibold text-destructive">
                    Final confirmation — enter your password to permanently delete everything.
                  </p>
                </div>
                <div>
                  <label htmlFor="delete-password" className="mb-1.5 block text-sm font-semibold">
                    Your password
                  </label>
                  <div className="relative max-w-sm">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="delete-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm focus:border-destructive focus:outline-none focus:ring-2 focus:ring-destructive/20"
                      onKeyDown={(e) => e.key === "Enter" && password && handleDeleteAccount()}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || !password}
                    variant="destructive"
                    className="gap-2"
                  >
                    {isDeleting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Deleting…</>
                    ) : (
                      <><Trash2 className="h-4 w-4" /> Yes, Delete Everything</>
                    )}
                  </Button>
                  <Button
                    onClick={() => { setDeleteStep("idle"); setPassword(""); }}
                    variant="outline"
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        <motion.div
          className="mt-8 text-center text-sm text-muted-foreground"
          initial="hidden" animate="visible" variants={fadeUp} custom={8}
        >
          <p>
            Questions about your data? Contact us at{" "}
            <a href="mailto:privacy@futurexplore.app" className="text-foreground underline">
              privacy@futurexplore.app
            </a>
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default DataManagement;
