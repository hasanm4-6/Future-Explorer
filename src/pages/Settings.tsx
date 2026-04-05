import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CreditCard,
  Database,
  Download,
  Eye,
  Loader2,
  LogOut,
  Mail,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/contexts/AuthProvider";
import { clearLocalAccountData } from "@/lib/account";
import { api, type ApiClientError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type ProfileErrors = Partial<
  Record<"name" | "email" | "currentPassword", string>
>;
type PasswordErrors = Partial<
  Record<"currentPassword" | "newPassword" | "confirmPassword", string>
>;
type DeleteErrors = Partial<Record<"currentPassword" | "confirmation", string>>;

const PASSWORD_HINT =
  "Use at least 8 characters, including 1 uppercase letter and 1 number.";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-destructive">{message}</p> : null;

const getFieldErrors = (error: unknown) => {
  const apiError = error as ApiClientError;

  if (!Array.isArray(apiError?.errors)) {
    return {} as Record<string, string>;
  }

  return apiError.errors.reduce<Record<string, string>>((acc, entry) => {
    acc[entry.field] = entry.message;
    return acc;
  }, {});
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as ApiClientError;
  return apiError?.message || fallback;
};

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout, refresh } = useAuthContext();

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
  });
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteForm, setDeleteForm] = useState({
    currentPassword: "",
    confirmation: "",
  });
  const [deleteErrors, setDeleteErrors] = useState<DeleteErrors>({});
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (!user) return;

    setProfileForm({
      name: user.name ?? "",
      email: user.email ?? "",
      currentPassword: "",
    });
  }, [user?.email, user?.id, user?.name]);

  if (!user) {
    return null;
  }

  const currentEmail = (user.email ?? "").trim().toLowerCase();
  const nextEmail = profileForm.email.trim().toLowerCase();
  const emailChanged = nextEmail !== currentEmail;
  const profileChanged =
    profileForm.name.trim() !== (user.name ?? "").trim() || emailChanged;

  const validateProfile = () => {
    const errors: ProfileErrors = {};

    if (!profileForm.name.trim()) {
      errors.name = "Full name is required.";
    } else if (profileForm.name.trim().length < 2) {
      errors.name = "Full name must be at least 2 characters.";
    }

    if (!profileForm.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(profileForm.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (emailChanged && !profileForm.currentPassword) {
      errors.currentPassword =
        "Current password is required to change your email address.";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors: PasswordErrors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required.";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required.";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(passwordForm.newPassword)) {
      errors.newPassword = "Include at least 1 uppercase letter.";
    } else if (!/[0-9]/.test(passwordForm.newPassword)) {
      errors.newPassword = "Include at least 1 number.";
    } else if (passwordForm.newPassword === passwordForm.currentPassword) {
      errors.newPassword =
        "New password must be different from your current password.";
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password.";
    } else if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateDelete = () => {
    const errors: DeleteErrors = {};

    if (!deleteForm.currentPassword) {
      errors.currentPassword = "Current password is required.";
    }

    if (deleteForm.confirmation.trim() !== "DELETE") {
      errors.confirmation = 'Type "DELETE" to confirm account deletion.';
    }

    setDeleteErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateProfile()) return;

    if (!profileChanged) {
      toast({
        title: "No changes to save",
        description: "Update your name or email before saving.",
      });
      return;
    }

    setIsSavingProfile(true);

    try {
      await api.updateProfile({
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        ...(emailChanged
          ? { currentPassword: profileForm.currentPassword }
          : {}),
      });

      await refresh();

      setProfileErrors({});
      setProfileForm((current) => ({
        ...current,
        name: current.name.trim(),
        email: current.email.trim(),
        currentPassword: "",
      }));

      toast({
        title: "Profile updated",
        description: emailChanged
          ? "Your account details and active session were updated."
          : "Your parent profile has been saved.",
      });
    } catch (error) {
      setProfileErrors((current) => ({
        ...current,
        ...(getFieldErrors(error) as ProfileErrors),
      }));

      toast({
        variant: "destructive",
        title: "Could not update profile",
        description: getErrorMessage(
          error,
          "Please review your details and try again.",
        ),
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validatePassword()) return;

    setIsUpdatingPassword(true);

    try {
      await api.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      await refresh();

      setPasswordErrors({});
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast({
        title: "Password updated",
        description: "Your security settings have been saved.",
      });
    } catch (error) {
      setPasswordErrors((current) => ({
        ...current,
        ...(getFieldErrors(error) as PasswordErrors),
      }));

      toast({
        variant: "destructive",
        title: "Could not update password",
        description: getErrorMessage(
          error,
          "Please double-check your current password and try again.",
        ),
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!validateDelete()) return;

    setIsDeletingAccount(true);

    try {
      await api.deleteAccount({
        currentPassword: deleteForm.currentPassword,
        confirmation: "DELETE",
      });

      clearLocalAccountData();
      await refresh();
      setDeleteDialogOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      setDeleteErrors((current) => ({
        ...current,
        ...(getFieldErrors(error) as DeleteErrors),
      }));

      toast({
        variant: "destructive",
        title: "Could not delete account",
        description: getErrorMessage(
          error,
          "Please confirm your password and try again.",
        ),
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-2xl px-4 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, security, and account access.
          </p>
        </motion.div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-card p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-bold">
              Parent Profile
            </h2>

            <form className="space-y-4" onSubmit={handleProfileSubmit}>
              <div className="space-y-2">
                <Label
                  className="flex items-center gap-2 font-body font-semibold"
                  htmlFor="settings-name"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </Label>
                <Input
                  id="settings-name"
                  value={profileForm.name}
                  onChange={(event) => {
                    setProfileForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }));
                    setProfileErrors((current) => ({
                      ...current,
                      name: undefined,
                    }));
                  }}
                  className="rounded-xl"
                  autoComplete="name"
                  disabled={isSavingProfile}
                />
                <FieldError message={profileErrors.name} />
              </div>

              <div className="space-y-2">
                <Label
                  className="flex items-center gap-2 font-body font-semibold"
                  htmlFor="settings-email"
                >
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="settings-email"
                  value={profileForm.email}
                  onChange={(event) => {
                    setProfileForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }));
                    setProfileErrors((current) => ({
                      ...current,
                      email: undefined,
                      currentPassword: undefined,
                    }));
                  }}
                  className="rounded-xl"
                  autoComplete="email"
                  type="email"
                  disabled={isSavingProfile}
                />
                <FieldError message={profileErrors.email} />
              </div>

              {emailChanged ? (
                <div className="space-y-2 rounded-xl border border-border bg-muted/40 p-4">
                  <Label
                    className="font-body font-semibold"
                    htmlFor="profile-current-password"
                  >
                    Current Password
                  </Label>
                  <Input
                    id="profile-current-password"
                    type="password"
                    value={profileForm.currentPassword}
                    onChange={(event) => {
                      setProfileForm((current) => ({
                        ...current,
                        currentPassword: event.target.value,
                      }));
                      setProfileErrors((current) => ({
                        ...current,
                        currentPassword: undefined,
                      }));
                    }}
                    placeholder="Required to confirm your email change"
                    className="rounded-xl"
                    autoComplete="current-password"
                    disabled={isSavingProfile}
                  />
                  <p className="text-sm text-muted-foreground">
                    We ask for your current password before updating the sign-in
                    email on your account.
                  </p>
                  <FieldError message={profileErrors.currentPassword} />
                </div>
              ) : null}

              <Button
                variant="explorer"
                size="sm"
                type="submit"
                disabled={isSavingProfile}
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow-card">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
              <CreditCard className="h-5 w-5 text-explorer-blue" />
              Subscription
            </h2>
            <div className="mb-4 flex items-center justify-between rounded-xl bg-muted p-4">
              <div>
                <p className="font-display font-bold">Yearly Explorer</p>
                <p className="text-sm text-muted-foreground">
                  $79.99/year · Renews Jan 15, 2027
                </p>
              </div>
              <span className="rounded-full bg-explorer-green/10 px-3 py-1 text-xs font-bold text-explorer-green">
                Active
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/pricing">
                <Button variant="explorer-outline" size="sm">
                  Change Plan
                </Button>
              </Link>
              <Button variant="ghost" size="sm" disabled>
                Billing portal coming soon
              </Button>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow-card">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
              <Shield className="h-5 w-5 text-explorer-green" />
              Security
            </h2>

            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              <div className="space-y-2">
                <Label
                  className="font-body font-semibold"
                  htmlFor="current-password"
                >
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) => {
                    setPasswordForm((current) => ({
                      ...current,
                      currentPassword: event.target.value,
                    }));
                    setPasswordErrors((current) => ({
                      ...current,
                      currentPassword: undefined,
                    }));
                  }}
                  placeholder="Enter your current password"
                  className="rounded-xl"
                  autoComplete="current-password"
                  disabled={isUpdatingPassword}
                />
                <FieldError message={passwordErrors.currentPassword} />
              </div>

              <div className="space-y-2">
                <Label
                  className="font-body font-semibold"
                  htmlFor="new-password"
                >
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) => {
                    setPasswordForm((current) => ({
                      ...current,
                      newPassword: event.target.value,
                    }));
                    setPasswordErrors((current) => ({
                      ...current,
                      newPassword: undefined,
                    }));
                  }}
                  placeholder="Create a stronger password"
                  className="rounded-xl"
                  autoComplete="new-password"
                  disabled={isUpdatingPassword}
                />
                <p className="text-sm text-muted-foreground">{PASSWORD_HINT}</p>
                <FieldError message={passwordErrors.newPassword} />
              </div>

              <div className="space-y-2">
                <Label
                  className="font-body font-semibold"
                  htmlFor="confirm-password"
                >
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) => {
                    setPasswordForm((current) => ({
                      ...current,
                      confirmPassword: event.target.value,
                    }));
                    setPasswordErrors((current) => ({
                      ...current,
                      confirmPassword: undefined,
                    }));
                  }}
                  placeholder="Re-enter your new password"
                  className="rounded-xl"
                  autoComplete="new-password"
                  disabled={isUpdatingPassword}
                />
                <FieldError message={passwordErrors.confirmPassword} />
              </div>

              <Button
                variant="explorer"
                size="sm"
                type="submit"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow-card">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
              <Database className="h-5 w-5 text-explorer-green" />
              Data Management
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-explorer-blue" />
                  <div>
                    <h3 className="font-semibold">Export Your Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Download a copy of your account data
                    </p>
                  </div>
                </div>
                <Link to="/data-management">
                  <Button variant="outline" size="sm" className="gap-2">
                    Manage Data
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-explorer-coral" />
                  <div>
                    <h3 className="font-semibold">Privacy Summary</h3>
                    <p className="text-sm text-muted-foreground">
                      See a simple explanation of our privacy practices
                    </p>
                  </div>
                </div>
                <Link to="/privacy-summary">
                  <Button variant="outline" size="sm" className="gap-2">
                    View Summary
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setDeleteErrors({});
            setDeleteForm({ currentPassword: "", confirmation: "" });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Account Permanently
            </DialogTitle>
            <DialogDescription>
              This will permanently remove your parent account, child profiles,
              and progress data from Future Explorer. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4">
              <p className="mb-2 text-sm font-semibold text-destructive">
                This will permanently delete:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Your parent account</li>
                <li>All child profiles and lesson progress</li>
                <li>Settings, preferences, and linked access</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delete-confirmation" className="font-body font-semibold">
                Type DELETE to confirm
              </Label>
              <Input
                id="delete-confirmation"
                value={deleteForm.confirmation}
                onChange={(event) => {
                  setDeleteForm((current) => ({
                    ...current,
                    confirmation: event.target.value,
                  }));
                  setDeleteErrors((current) => ({
                    ...current,
                    confirmation: undefined,
                  }));
                }}
                placeholder="DELETE"
                className="rounded-xl"
                disabled={isDeletingAccount}
              />
              <FieldError message={deleteErrors.confirmation} />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="delete-current-password"
                className="font-body font-semibold"
              >
                Current Password
              </Label>
              <Input
                id="delete-current-password"
                type="password"
                value={deleteForm.currentPassword}
                onChange={(event) => {
                  setDeleteForm((current) => ({
                    ...current,
                    currentPassword: event.target.value,
                  }));
                  setDeleteErrors((current) => ({
                    ...current,
                    currentPassword: undefined,
                  }));
                }}
                placeholder="Enter your current password"
                className="rounded-xl"
                autoComplete="current-password"
                disabled={isDeletingAccount}
              />
              <FieldError message={deleteErrors.currentPassword} />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeletingAccount}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Everything
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
