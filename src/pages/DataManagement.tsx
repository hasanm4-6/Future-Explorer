import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Eye, FileText, Shield, AlertTriangle, Users } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { auditDataExported, auditDataDeleted } from "@/lib/audit";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const DataManagement = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      // Collect all user data
      const userData = {
        profile: JSON.parse(localStorage.getItem('futurxplore_session') || '{}'),
        progress: JSON.parse(localStorage.getItem('futurxplore_autosave') || '{}'),
        auditLogs: JSON.parse(localStorage.getItem('futurxplore_audit_logs') || '[]'),
        exportedAt: new Date().toISOString(),
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `futurxplore_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Log export for audit
      const userId = JSON.parse(localStorage.getItem('futurxplore_session') || '{}')?.userId || 'unknown';
      auditDataExported(userId, 'full_account_data');

      alert('Your data has been exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      // Log deletion for audit
      const userId = JSON.parse(localStorage.getItem('futurxplore_session') || '{}')?.userId || 'unknown';
      auditDataDeleted(userId, 'full_account_deletion');

      // Clear all local data
      localStorage.removeItem('futurxplore_session');
      localStorage.removeItem('futurxplore_autosave');
      localStorage.removeItem('futurxplore_audit_logs');
      localStorage.removeItem('futurxplore_session_recovery');

      // Redirect to home with deletion confirmation
      alert('Your account and all associated data have been permanently deleted.');
      window.location.href = '/';
    } catch (error) {
      console.error('Deletion failed:', error);
      alert('Deletion failed. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const dataCategories = [
    {
      title: 'Account Information',
      description: 'Your email, name, and account settings',
      icon: Shield,
    },
    {
      title: 'Child Profiles',
      description: 'Names, ages, avatars, and learning levels',
      icon: Users,
    },
    {
      title: 'Learning Progress',
      description: 'Lesson completion, badges earned, and time spent',
      icon: FileText,
    },
    {
      title: 'Activity Logs',
      description: 'Login history and major account actions',
      icon: Eye,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <h1 className="font-display text-3xl font-bold mb-2">Data Management</h1>
          <p className="text-muted-foreground">
            Control your data. Export it anytime or delete your account permanently.
          </p>
        </motion.div>

        <motion.div
          className="mb-8 rounded-2xl bg-card p-6 shadow-card"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
        >
          <h2 className="mb-4 font-display text-lg font-bold">What Data We Store</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {dataCategories.map((category, index) => (
              <motion.div
                key={category.title}
                className="flex items-start gap-3 p-4 rounded-xl border border-border"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={index + 2}
              >
                <category.icon className="h-5 w-5 text-explorer-blue mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mb-8 rounded-2xl bg-card p-6 shadow-card"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={6}
        >
          <h2 className="mb-4 font-display text-lg font-bold">Export Your Data</h2>
          <p className="mb-4 text-muted-foreground">
            Download a complete copy of your data in JSON format. This includes everything we store about your account.
          </p>
          <Button
            onClick={handleExportData}
            disabled={isExporting}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export All Data'}
          </Button>
        </motion.div>

        <motion.div
          className="rounded-2xl bg-card p-6 shadow-card border-2 border-destructive/20"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={7}
        >
          <h2 className="mb-4 font-display text-lg font-bold flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </h2>
          
          {!showDeleteConfirm ? (
            <div>
              <p className="mb-4 text-muted-foreground">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="destructive"
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete My Account
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-destructive/10 p-4 border border-destructive/20">
                <h3 className="font-semibold mb-2 text-destructive">This will permanently delete:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Your parent account</li>
                  <li>• All child profiles</li>
                  <li>• Learning progress and badges</li>
                  <li>• Account settings and preferences</li>
                  <li>• All activity logs</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  variant="destructive"
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          className="mt-8 text-center text-sm text-muted-foreground"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={8}
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
