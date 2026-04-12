import { useState, useId } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Users,
  Calendar,
  Target,
  HelpCircle,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { trackEvent } from "@/lib/tracking";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth"; // replace with your actual auth hook

// ─── Constants ─────────────────────────────────────────────────────────────────

const AVATARS = [
  "🦊",
  "🐯",
  "🦁",
  "🐼",
  "🐸",
  "🐵",
  "🦄",
  "🦅",
  "🦆",
  "🦇",
  "🦈",
  "🦉",
  "🦋",
  "🦌",
  "🦍",
  "🦎",
  "🦏",
  "🦐",
  "🦑",
  "🦒",
  "🦓",
  "🦔",
  "🦕",
  "🦖",
] as const;

const AGE_MIN = 6;
const AGE_MAX = 13;
const NAME_MAX = 40;

const LEARNING_LEVELS = [
  { value: "beginner", label: "Beginner (Ages 6–7)" },
  { value: "intermediate", label: "Intermediate (Ages 8–10)" },
  { value: "advanced", label: "Advanced (Ages 11–13)" },
] as const;

type LearningLevel = (typeof LEARNING_LEVELS)[number]["value"];

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FormFields {
  name: string;
  age: string;
  avatar: string;
  learningLevel: LearningLevel | "";
}

interface FieldErrors {
  name?: string;
  age?: string;
  learningLevel?: string;
  form?: string; // API-level error
}

// ─── Validation ────────────────────────────────────────────────────────────────

function validate(fields: FormFields): FieldErrors {
  const errors: FieldErrors = {};

  const name = fields.name.trim();
  if (!name) {
    errors.name = "Explorer name is required.";
  } else if (name.length > NAME_MAX) {
    errors.name = `Name must be ${NAME_MAX} characters or fewer.`;
  } else if (!/^[\p{L}\p{N}\s'-]+$/u.test(name)) {
    errors.name = "Name contains invalid characters.";
  }

  const age = parseInt(fields.age, 10);
  if (!fields.age.trim()) {
    errors.age = "Age is required.";
  } else if (isNaN(age) || !Number.isInteger(age)) {
    errors.age = "Please enter a valid whole number.";
  } else if (age < AGE_MIN || age > AGE_MAX) {
    errors.age = `Age must be between ${AGE_MIN} and ${AGE_MAX}.`;
  }

  if (!fields.learningLevel) {
    errors.learningLevel = "Please select a learning level.";
  }

  return errors;
}

function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

// ─── Animation ─────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const errorVariants = {
  hidden: { opacity: 0, y: -4, height: 0 },
  visible: { opacity: 1, y: 0, height: "auto", transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, height: 0, transition: { duration: 0.15 } },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p
          key={message}
          className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive"
          variants={errorVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-3 w-3 shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const CreateChild = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // provides user.id

  const nameId = useId();
  const ageId = useId();
  const levelId = useId();

  const [fields, setFields] = useState<FormFields>({
    name: "",
    age: "",
    avatar: "",
    learningLevel: "",
  });

  // Tracks which fields the user has interacted with (touch-based validation)
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormFields, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const errors = validate(fields);

  // Only show errors for touched fields (except on submit attempt)
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const visibleErrors: FieldErrors = {};
  (["name", "age", "learningLevel"] as const).forEach((key) => {
    if (submitAttempted || touched[key]) {
      visibleErrors[key] = errors[key];
    }
  });

  const update = (field: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const markTouched = (field: keyof FormFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);

    if (hasErrors(errors)) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      await api.createChild({
        name: fields.name.trim(),
        age: parseInt(fields.age, 10),
        avatar: fields.avatar || AVATARS[0], // default to first avatar if none picked
        learning_level: fields.learningLevel as LearningLevel,
      });

      trackEvent("child_profile_created", {
        learningLevel: fields.learningLevel,
        hasAvatar: !!fields.avatar,
      });

      navigate("/dashboard");
    } catch (err: unknown) {
      console.error("Failed to create child profile:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormReady = !hasErrors(errors) && !isSubmitting;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Step 2 of 3
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[66%] rounded-full bg-gradient-coral transition-all duration-700" />
          </div>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Set up child profiles
          </p>
        </div>

        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="font-display text-2xl font-bold text-center sm:text-left">
              Add Your Explorers
            </h1>
          </div>

          {/* Form Card */}
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <motion.div
              className="rounded-2xl bg-card p-6 shadow-card border border-border/50"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
            >
              {/* API-level error banner */}
              <AnimatePresence>
                {formError && (
                  <motion.div
                    className="mb-5 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    role="alert"
                  >
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{formError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Name ──────────────────────────────────────────────── */}
              <div className="mb-5">
                <Label
                  htmlFor={nameId}
                  className="text-sm font-semibold mb-1.5 block"
                >
                  Explorer Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Users className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id={nameId}
                    value={fields.name}
                    onChange={(e) => update("name", e.target.value)}
                    onBlur={() => markTouched("name")}
                    placeholder="Enter explorer name"
                    maxLength={NAME_MAX + 1} // +1 so the validation message fires
                    aria-invalid={!!visibleErrors.name}
                    aria-describedby={
                      visibleErrors.name ? `${nameId}-error` : undefined
                    }
                    className={`rounded-xl pl-10 ${
                      visibleErrors.name
                        ? "border-destructive focus-visible:ring-destructive/30"
                        : ""
                    }`}
                  />
                </div>
                <FieldError message={visibleErrors.name} />
                {!visibleErrors.name && fields.name.trim() && (
                  <p className="text-xs text-muted-foreground mt-1">
                    This name will appear on their profile and certificates.
                  </p>
                )}
              </div>

              {/* ── Age ───────────────────────────────────────────────── */}
              <div className="mb-5">
                <Label
                  htmlFor={ageId}
                  className="text-sm font-semibold mb-1.5 block"
                >
                  Age <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id={ageId}
                    type="number"
                    value={fields.age}
                    onChange={(e) => update("age", e.target.value)}
                    onBlur={() => markTouched("age")}
                    placeholder={`Age (${AGE_MIN}–${AGE_MAX})`}
                    min={AGE_MIN}
                    max={AGE_MAX}
                    step={1}
                    aria-invalid={!!visibleErrors.age}
                    aria-describedby={
                      visibleErrors.age ? `${ageId}-error` : undefined
                    }
                    className={`rounded-xl pl-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      visibleErrors.age
                        ? "border-destructive focus-visible:ring-destructive/30"
                        : ""
                    }`}
                  />
                </div>
                <FieldError message={visibleErrors.age} />
                {!visibleErrors.age && fields.age.trim() && (
                  <div className="mt-2 rounded-lg bg-explorer-blue/10 p-3">
                    <div className="flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 text-explorer-blue mt-0.5 shrink-0" />
                      <div className="text-xs text-muted-foreground">
                        <p className="font-semibold">Why we ask:</p>
                        <p>
                          Age helps us provide age-appropriate content and
                          ensure safety compliance.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Learning Level ────────────────────────────────────── */}
              <div className="mb-5">
                <Label
                  htmlFor={levelId}
                  className="text-sm font-semibold mb-1.5 block"
                >
                  Learning Level <span className="text-destructive">*</span>
                </Label>
                {/*
                  No absolute icon here — Radix SelectTrigger manages its own
                  internal padding and the icon would overlap the value text.
                  Using left padding + a leading icon in SelectTrigger instead.
                */}
                <Select
                  value={fields.learningLevel}
                  onValueChange={(value) => {
                    update("learningLevel", value);
                    markTouched("learningLevel");
                  }}
                >
                  <SelectTrigger
                    id={levelId}
                    aria-invalid={!!visibleErrors.learningLevel}
                    className={`flex items-center justify-start gap-3 rounded-xl ${
                      visibleErrors.learningLevel
                        ? "border-destructive focus-visible:ring-destructive/30"
                        : ""
                    }`}
                  >
                    {/* <span className="flex items-center justify-center gap-2"> */}
                      <Target className="h-4 w-4 text-muted-foreground shrink-0" />
                      <SelectValue placeholder="Select learning level" />
                    {/* </span> */}
                  </SelectTrigger>
                  <SelectContent>
                    {LEARNING_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={visibleErrors.learningLevel} />
                {!visibleErrors.learningLevel && fields.learningLevel && (
                  <div className="mt-2 rounded-lg bg-explorer-green/10 p-3">
                    <div className="flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 text-explorer-green mt-0.5 shrink-0" />
                      <div className="text-xs text-muted-foreground">
                        <p className="font-semibold">Why we ask:</p>
                        <p>
                          Learning level ensures content matches your child's
                          current abilities and provides appropriate challenges.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Avatar ────────────────────────────────────────────── */}
              <div className="mb-2">
                <Label className="text-sm font-semibold mb-1.5 block">
                  Choose Avatar{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (optional — defaults to 🦊)
                  </span>
                </Label>
                <div
                  className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2"
                  role="radiogroup"
                  aria-label="Choose an avatar"
                >
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      role="radio"
                      aria-checked={fields.avatar === avatar}
                      onClick={() => update("avatar", avatar)}
                      className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                        fields.avatar === avatar
                          ? "border-explorer-coral bg-explorer-coral/10 scale-110"
                          : "border-border bg-card hover:border-muted-foreground/50"
                      }`}
                    >
                      <span
                        className="text-lg sm:text-2xl"
                        role="img"
                        aria-label={avatar}
                      >
                        {avatar}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Submit */}
          <motion.div
            className="mt-8 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            <Button
              type="button"
              variant="explorer"
              size="xl"
              className="w-full sm:w-auto min-w-[220px]"
              disabled={!isFormReady}
              onClick={handleSubmit}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Profile…
                </>
              ) : (
                <>
                  Create Explorer Profile
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>

            {submitAttempted && hasErrors(errors) && (
              <p className="mt-3 text-xs text-destructive" role="alert">
                Please fix the errors above before continuing.
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateChild;
