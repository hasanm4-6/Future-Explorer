// // import { useState, useReducer, useCallback, useEffect, useRef } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Compass,
// //   Mail,
// //   Lock,
// //   ArrowRight,
// //   User,
// //   CheckCircle,
// //   Eye,
// //   EyeOff,
// //   Loader2,
// //   AlertCircle,
// //   ChevronLeft,
// //   Baby,
// //   CalendarDays,
// //   Sparkles,
// //   Shield,
// // } from "lucide-react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { trackEvent } from "@/lib/tracking";
// // import { automationService } from "@/lib/automation";

// // // ─────────────────────────────────────────────
// // // Constants
// // // ─────────────────────────────────────────────

// // const ONBOARDING_STEPS = [
// //   { label: "Account", desc: "Create your login", icon: Shield },
// //   { label: "Profile", desc: "Add your explorer", icon: Baby },
// //   { label: "Start!", desc: "Begin missions", icon: Sparkles },
// // ];

// // const AGE_GROUPS = [
// //   { value: "5-7", label: "5 – 7 yrs", emoji: "🌱" },
// //   { value: "8-10", label: "8 – 10 yrs", emoji: "🚀" },
// //   { value: "11-13", label: "11 – 13 yrs", emoji: "🔬" },
// //   { value: "14+", label: "14+ yrs", emoji: "🌍" },
// // ];

// // const LEARNING_STYLES = [
// //   { value: "visual", label: "Visual", emoji: "🎨" },
// //   { value: "reading", label: "Reading", emoji: "📚" },
// //   { value: "hands-on", label: "Hands-On", emoji: "🛠️" },
// //   { value: "social", label: "Social", emoji: "🤝" },
// // ];

// // // ─────────────────────────────────────────────
// // // Validation Helpers
// // // ─────────────────────────────────────────────

// // const VALIDATORS = {
// //   name: (v) => {
// //     if (!v.trim()) return "Name is required.";
// //     if (v.trim().length < 2) return "Name must be at least 2 characters.";
// //     if (v.trim().length > 60) return "Name is too long.";
// //     return null;
// //   },
// //   email: (v) => {
// //     if (!v.trim()) return "Email is required.";
// //     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
// //       return "Enter a valid email address.";
// //     return null;
// //   },
// //   password: (v) => {
// //     if (!v) return "Password is required.";
// //     if (v.length < 8) return "Password must be at least 8 characters.";
// //     if (!/[A-Z]/.test(v)) return "Include at least one uppercase letter.";
// //     if (!/[0-9]/.test(v)) return "Include at least one number.";
// //     return null;
// //   },
// //   confirmPassword: (v, password) => {
// //     if (!v) return "Please confirm your password.";
// //     if (v !== password) return "Passwords don't match.";
// //     return null;
// //   },
// //   childName: (v) => {
// //     if (!v.trim()) return "Child's name is required.";
// //     if (v.trim().length < 2) return "Name must be at least 2 characters.";
// //     return null;
// //   },
// //   ageGroup: (v) => (!v ? "Please select an age group." : null),
// // };

// // const getPasswordStrength = (password) => {
// //   if (!password) return { score: 0, label: "", color: "" };
// //   let score = 0;
// //   if (password.length >= 8) score++;
// //   if (password.length >= 12) score++;
// //   if (/[A-Z]/.test(password)) score++;
// //   if (/[0-9]/.test(password)) score++;
// //   if (/[^A-Za-z0-9]/.test(password)) score++;
// //   if (score <= 1) return { score, label: "Weak", color: "bg-red-400" };
// //   if (score === 2) return { score, label: "Fair", color: "bg-yellow-400" };
// //   if (score === 3) return { score, label: "Good", color: "bg-blue-400" };
// //   return { score, label: "Strong", color: "bg-emerald-400" };
// // };

// // // ─────────────────────────────────────────────
// // // Form Reducer
// // // ─────────────────────────────────────────────

// // const initialState = {
// //   // Login fields
// //   loginEmail: "",
// //   loginPassword: "",
// //   // Signup Step 1
// //   name: "",
// //   email: "",
// //   password: "",
// //   confirmPassword: "",
// //   // Signup Step 2
// //   childName: "",
// //   ageGroup: "",
// //   // learningStyle: "",
// //   // Meta
// //   errors: {},
// //   touched: {},
// // };

// // function formReducer(state, action) {
// //   switch (action.type) {
// //     case "SET_FIELD":
// //       return { ...state, [action.field]: action.value };
// //     case "SET_ERROR":
// //       return {
// //         ...state,
// //         errors: { ...state.errors, [action.field]: action.error },
// //       };
// //     case "CLEAR_ERROR":
// //       return {
// //         ...state,
// //         errors: { ...state.errors, [action.field]: null },
// //       };
// //     case "SET_TOUCHED":
// //       return { ...state, touched: { ...state.touched, [action.field]: true } };
// //     case "SET_ERRORS_BULK":
// //       return { ...state, errors: { ...state.errors, ...action.errors } };
// //     case "RESET":
// //       return initialState;
// //     default:
// //       return state;
// //   }
// // }

// // // ─────────────────────────────────────────────
// // // Sub-components
// // // ─────────────────────────────────────────────

// // const FieldError = ({ error }) =>
// //   error ? (
// //     <motion.p
// //       className="mt-1 flex items-center gap-1 text-xs text-red-500"
// //       initial={{ opacity: 0, y: -4 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       exit={{ opacity: 0, y: -4 }}
// //     >
// //       <AlertCircle className="h-3 w-3 flex-shrink-0" />
// //       {error}
// //     </motion.p>
// //   ) : null;

// // const PasswordStrengthBar = ({ password }) => {
// //   const strength = getPasswordStrength(password);
// //   if (!password) return null;
// //   return (
// //     <div className="mt-2 space-y-1">
// //       <div className="flex gap-1">
// //         {[1, 2, 3, 4].map((i) => (
// //           <div
// //             key={i}
// //             className={`h-1 flex-1 rounded-full transition-all duration-300 ${
// //               i <= strength.score ? strength.color : "bg-muted"
// //             }`}
// //           />
// //         ))}
// //       </div>
// //       <p
// //         className={`text-xs font-medium ${strength.score <= 1 ? "text-red-400" : strength.score === 2 ? "text-yellow-500" : strength.score === 3 ? "text-blue-500" : "text-emerald-500"}`}
// //       >
// //         {strength.label}
// //       </p>
// //     </div>
// //   );
// // };

// // const OnboardingProgress = ({ currentStep }) => (
// //   <div className="mb-6">
// //     <div className="flex items-center justify-between">
// //       {ONBOARDING_STEPS.map((step, i) => {
// //         const Icon = step.icon;
// //         const isActive = i === currentStep;
// //         const isDone = i < currentStep;
// //         return (
// //           <div key={step.label} className="flex flex-1 flex-col items-center">
// //             <div
// //               className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold font-display transition-all duration-300 ${
// //                 isActive
// //                   ? "bg-gradient-coral text-primary-foreground scale-110 shadow-md"
// //                   : isDone
// //                     ? "bg-emerald-500 text-white"
// //                     : "bg-muted text-muted-foreground"
// //               }`}
// //             >
// //               {isDone ? (
// //                 <CheckCircle className="h-4 w-4" />
// //               ) : isActive ? (
// //                 <Icon className="h-4 w-4" />
// //               ) : (
// //                 i + 1
// //               )}
// //             </div>
// //             <p
// //               className={`mt-1 text-xs font-semibold transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"}`}
// //             >
// //               {step.label}
// //             </p>
// //           </div>
// //         );
// //       })}
// //     </div>
// //     <div className="mt-2 flex gap-1">
// //       {ONBOARDING_STEPS.map((_, i) => (
// //         <div
// //           key={i}
// //           className={`h-1 flex-1 rounded-full transition-all duration-500 ${
// //             i <= currentStep ? "bg-gradient-coral" : "bg-muted"
// //           }`}
// //           style={
// //             i <= currentStep
// //               ? { background: "var(--gradient-coral, #FF6B6B)" }
// //               : {}
// //           }
// //         />
// //       ))}
// //     </div>
// //     <p className="mt-2 text-center text-xs text-muted-foreground">
// //       Step {currentStep + 1} of {ONBOARDING_STEPS.length} —{" "}
// //       {ONBOARDING_STEPS[currentStep].desc}
// //     </p>
// //   </div>
// // );

// // // ─────────────────────────────────────────────
// // // Main Component
// // // ─────────────────────────────────────────────

// // const Login = () => {
// //   const navigate = useNavigate();
// //   const [isSignup, setIsSignup] = useState(false);
// //   const [signupStep, setSignupStep] = useState(0); // 0, 1, 2
// //   const [state, dispatch] = useReducer(formReducer, initialState);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [globalError, setGlobalError] = useState(null);
// //   const [successMessage, setSuccessMessage] = useState(null);
// //   const firstInputRef = useRef(null);

// //   // Auto-focus first input on mode/step change
// //   useEffect(() => {
// //     const timeout = setTimeout(() => firstInputRef.current?.focus(), 350);
// //     return () => clearTimeout(timeout);
// //   }, [isSignup, signupStep]);

// //   useEffect(() => {
// //     if (isSignup) trackEvent("onboarding_started");
// //   }, [isSignup]);

// //   // Clear global error on any interaction
// //   useEffect(() => {
// //     if (globalError) setGlobalError(null);
// //   }, [state]);

// //   const setField = useCallback(
// //     (field) => (e) => {
// //       const value = e.target?.value ?? e;
// //       dispatch({ type: "SET_FIELD", field, value });
// //       dispatch({ type: "SET_TOUCHED", field });
// //       // Live validation after first touch
// //       if (state.touched[field] || state.errors[field]) {
// //         const error =
// //           field === "confirmPassword"
// //             ? VALIDATORS.confirmPassword?.(value, state.password)
// //             : VALIDATORS[field]?.(value);
// //         dispatch({ type: "SET_ERROR", field, error: error || null });
// //       }
// //     },
// //     [state.touched, state.errors, state.password],
// //   );

// //   const validateFields = useCallback(
// //     (fields) => {
// //       const errors = {};
// //       let hasError = false;
// //       fields.forEach((field) => {
// //         const validator =
// //           field === "confirmPassword"
// //             ? (v) => VALIDATORS.confirmPassword(v, state.password)
// //             : VALIDATORS[field];
// //         const error = validator?.(state[field]);
// //         if (error) {
// //           errors[field] = error;
// //           hasError = true;
// //         }
// //         dispatch({ type: "SET_TOUCHED", field });
// //       });
// //       if (hasError) dispatch({ type: "SET_ERRORS_BULK", errors });
// //       return !hasError;
// //     },
// //     [state],
// //   );

// //   // ── Login Submit ──
// //   const handleLoginSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!validateFields(["loginEmail", "loginPassword"])) return;
// //     setIsLoading(true);
// //     setGlobalError(null);
// //     try {
// //       // TODO: replace with your actual auth call
// //       await new Promise((r) => setTimeout(r, 1200));
// //       trackEvent("login_success");
// //       navigate("/dashboard");
// //     } catch (err) {
// //       setGlobalError("Invalid email or password. Please try again.");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // ── Signup Step Navigation ──
// //   const handleStep1Continue = async (e) => {
// //     e.preventDefault();
// //     if (!validateFields(["name", "email", "password", "confirmPassword"]))
// //       return;
// //     setIsLoading(true);
// //     try {
// //       // Check email uniqueness (mock — replace with API call)
// //       await new Promise((r) => setTimeout(r, 800));
// //       trackEvent("signup_step1_complete");
// //       setSignupStep(1);
// //     } catch {
// //       setGlobalError("Something went wrong. Please try again.");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleStep2Continue = async (e) => {
// //     e.preventDefault();
// //     if (!validateFields(["childName", "ageGroup"])) return;
// //     setIsLoading(true);
// //     try {
// //       await new Promise((r) => setTimeout(r, 600));
// //       trackEvent("signup_step2_complete");
// //       setSignupStep(2);
// //     } catch {
// //       setGlobalError("Something went wrong. Please try again.");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleFinalSignup = async () => {
// //     setIsLoading(true);
// //     setGlobalError(null);
// //     try {
// //       await automationService.registerUser({
// //         email: state.email,
// //         parentName: state.name,
// //         childProfiles: [
// //           {
// //             name: state.childName,
// //             ageGroup: state.ageGroup,
// //             // learningStyle: state.learningStyle,
// //           },
// //         ],
// //       });
// //       trackEvent("signup_complete");
// //       setSuccessMessage("Account created! Redirecting you...");
// //       await new Promise((r) => setTimeout(r, 1500));
// //       navigate("/create-child");
// //     } catch {
// //       setGlobalError("Failed to create your account. Please try again.");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleModeSwitch = () => {
// //     setIsSignup((v) => !v);
// //     setSignupStep(0);
// //     setGlobalError(null);
// //     setSuccessMessage(null);
// //     dispatch({ type: "RESET" });
// //   };

// //   // ─────────────────────────────────────────────
// //   // Render Helpers
// //   // ─────────────────────────────────────────────

// //   const renderLoginForm = () => (
// //     <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
// //       {/* Email */}
// //       <div className="space-y-1">
// //         <Label htmlFor="loginEmail" className="font-body font-semibold">
// //           Email
// //         </Label>
// //         <div className="relative">
// //           <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
// //           <Input
// //             ref={firstInputRef}
// //             id="loginEmail"
// //             type="email"
// //             autoComplete="email"
// //             placeholder="parent@email.com"
// //             className={`rounded-xl pl-10 ${state.errors.loginEmail ? "border-red-400 focus-visible:ring-red-300" : ""}`}
// //             value={state.loginEmail}
// //             onChange={setField("loginEmail")}
// //             onBlur={() => {
// //               dispatch({ type: "SET_TOUCHED", field: "loginEmail" });
// //               const error = VALIDATORS.email(state.loginEmail);
// //               dispatch({
// //                 type: "SET_ERROR",
// //                 field: "loginEmail",
// //                 error: error || null,
// //               });
// //             }}
// //             disabled={isLoading}
// //             aria-invalid={!!state.errors.loginEmail}
// //             aria-describedby={
// //               state.errors.loginEmail ? "loginEmail-error" : undefined
// //             }
// //           />
// //         </div>
// //         <AnimatePresence mode="wait">
// //           <FieldError error={state.errors.loginEmail} />
// //         </AnimatePresence>
// //       </div>

// //       {/* Password */}
// //       <div className="space-y-1">
// //         <div className="flex items-center justify-between">
// //           <Label htmlFor="loginPassword" className="font-body font-semibold">
// //             Password
// //           </Label>
// //           <Link
// //             to="/forgot-password"
// //             className="text-xs text-primary hover:underline"
// //             tabIndex={-1}
// //           >
// //             Forgot password?
// //           </Link>
// //         </div>
// //         <div className="relative">
// //           <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
// //           <Input
// //             id="loginPassword"
// //             type={showPassword ? "text" : "password"}
// //             autoComplete="current-password"
// //             placeholder="••••••••"
// //             className={`rounded-xl pl-10 pr-10 ${state.errors.loginPassword ? "border-red-400 focus-visible:ring-red-300" : ""}`}
// //             value={state.loginPassword}
// //             onChange={setField("loginPassword")}
// //             onBlur={() => {
// //               dispatch({ type: "SET_TOUCHED", field: "loginPassword" });
// //               const error = VALIDATORS.password(state.loginPassword);
// //               dispatch({
// //                 type: "SET_ERROR",
// //                 field: "loginPassword",
// //                 error: error || null,
// //               });
// //             }}
// //             disabled={isLoading}
// //           />
// //           <button
// //             type="button"
// //             tabIndex={-1}
// //             className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
// //             onClick={() => setShowPassword((v) => !v)}
// //           >
// //             {showPassword ? (
// //               <EyeOff className="h-4 w-4" />
// //             ) : (
// //               <Eye className="h-4 w-4" />
// //             )}
// //           </button>
// //         </div>
// //         <AnimatePresence mode="wait">
// //           <FieldError error={state.errors.loginPassword} />
// //         </AnimatePresence>
// //       </div>

// //       <Button
// //         variant="explorer"
// //         size="lg"
// //         className="w-full mt-2"
// //         type="submit"
// //         disabled={isLoading}
// //       >
// //         {isLoading ? (
// //           <Loader2 className="h-4 w-4 animate-spin" />
// //         ) : (
// //           <>
// //             Sign In
// //             <ArrowRight className="h-4 w-4" />
// //           </>
// //         )}
// //       </Button>

// //       <div className="text-center">
// //         <Link
// //           to="/lesson/1"
// //           className="text-sm font-semibold text-primary hover:underline"
// //         >
// //           🎮 Preview a Sample Mission first
// //         </Link>
// //       </div>
// //     </form>
// //   );

// //   const renderSignupStep1 = () => (
// //     <form onSubmit={handleStep1Continue} noValidate className="space-y-4">
// //       {/* Full Name */}
// //       <div className="space-y-1">
// //         <Label htmlFor="name" className="font-body font-semibold">
// //           Full Name
// //         </Label>
// //         <div className="relative">
// //           <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
// //           <Input
// //             ref={firstInputRef}
// //             id="name"
// //             autoComplete="name"
// //             placeholder="Your full name"
// //             className={`rounded-xl pl-10 ${state.errors.name ? "border-red-400 focus-visible:ring-red-300" : ""}`}
// //             value={state.name}
// //             onChange={setField("name")}
// //             onBlur={() => {
// //               dispatch({ type: "SET_TOUCHED", field: "name" });
// //               dispatch({
// //                 type: "SET_ERROR",
// //                 field: "name",
// //                 error: VALIDATORS.name(state.name) || null,
// //               });
// //             }}
// //             disabled={isLoading}
// //           />
// //         </div>
// //         <AnimatePresence mode="wait">
// //           <FieldError error={state.errors.name} />
// //         </AnimatePresence>
// //       </div>

// //       {/* Email */}
// //       <div className="space-y-1">
// //         <Label htmlFor="email" className="font-body font-semibold">
// //           Email
// //         </Label>
// //         <div className="relative">
// //           <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
// //           <Input
// //             id="email"
// //             type="email"
// //             autoComplete="email"
// //             placeholder="parent@email.com"
// //             className={`rounded-xl pl-10 ${state.errors.email ? "border-red-400 focus-visible:ring-red-300" : ""}`}
// //             value={state.email}
// //             onChange={setField("email")}
// //             onBlur={() => {
// //               dispatch({ type: "SET_TOUCHED", field: "email" });
// //               dispatch({
// //                 type: "SET_ERROR",
// //                 field: "email",
// //                 error: VALIDATORS.email(state.email) || null,
// //               });
// //             }}
// //             disabled={isLoading}
// //           />
// //         </div>
// //         <AnimatePresence mode="wait">
// //           <FieldError error={state.errors.email} />
// //         </AnimatePresence>
// //       </div>

// //       {/* Password */}
// //       <div className="space-y-1">
// //         <Label htmlFor="password" className="font-body font-semibold">
// //           Password
// //         </Label>
// //         <div className="relative">
// //           <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
// //           <Input
// //             id="password"
// //             type={showPassword ? "text" : "password"}
// //             autoComplete="new-password"
// //             placeholder="Min. 8 characters"
// //             className={`rounded-xl pl-10 pr-10 ${state.errors.password ? "border-red-400 focus-visible:ring-red-300" : ""}`}
// //             value={state.password}
// //             onChange={setField("password")}
// //             onBlur={() => {
// //               dispatch({ type: "SET_TOUCHED", field: "password" });
// //               dispatch({
// //                 type: "SET_ERROR",
// //                 field: "password",
// //                 error: VALIDATORS.password(state.password) || null,
// //               });
// //             }}
// //             disabled={isLoading}
// //           />
// //           <button
// //             type="button"
// //             tabIndex={-1}
// //             className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
// //             onClick={() => setShowPassword((v) => !v)}
// //           >
// //             {showPassword ? (
// //               <EyeOff className="h-4 w-4" />
// //             ) : (
// //               <Eye className="h-4 w-4" />
// //             )}
// //           </button>
// //         </div>
// //         <PasswordStrengthBar password={state.password} />
// //         <AnimatePresence mode="wait">
// //           <FieldError error={state.errors.password} />
// //         </AnimatePresence>
// //       </div>

// //       {/* Confirm Password */}
// //       <div className="space-y-1">
// //         <Label htmlFor="confirmPassword" className="font-body font-semibold">
// //           Confirm Password
// //         </Label>
// //         <div className="relative">
// //           <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
// //           <Input
// //             id="confirmPassword"
// //             type={showConfirmPassword ? "text" : "password"}
// //             autoComplete="new-password"
// //             placeholder="Repeat your password"
// //             className={`rounded-xl pl-10 pr-10 ${state.errors.confirmPassword ? "border-red-400 focus-visible:ring-red-300" : ""}`}
// //             value={state.confirmPassword}
// //             onChange={setField("confirmPassword")}
// //             onBlur={() => {
// //               dispatch({ type: "SET_TOUCHED", field: "confirmPassword" });
// //               dispatch({
// //                 type: "SET_ERROR",
// //                 field: "confirmPassword",
// //                 error:
// //                   VALIDATORS.confirmPassword(
// //                     state.confirmPassword,
// //                     state.password,
// //                   ) || null,
// //               });
// //             }}
// //             disabled={isLoading}
// //           />
// //           <button
// //             type="button"
// //             tabIndex={-1}
// //             className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
// //             onClick={() => setShowConfirmPassword((v) => !v)}
// //           >
// //             {showConfirmPassword ? (
// //               <EyeOff className="h-4 w-4" />
// //             ) : (
// //               <Eye className="h-4 w-4" />
// //             )}
// //           </button>
// //         </div>
// //         <AnimatePresence mode="wait">
// //           <FieldError error={state.errors.confirmPassword} />
// //         </AnimatePresence>
// //       </div>

// //       <Button
// //         variant="explorer"
// //         size="lg"
// //         className="w-full mt-2"
// //         type="submit"
// //         disabled={isLoading}
// //       >
// //         {isLoading ? (
// //           <Loader2 className="h-4 w-4 animate-spin" />
// //         ) : (
// //           <>
// //             Continue to Step 2
// //             <ArrowRight className="h-4 w-4" />
// //           </>
// //         )}
// //       </Button>

// //       {/* Benefits */}
// //       <div className="rounded-xl bg-muted p-3 space-y-2">
// //         <p className="text-xs font-semibold text-muted-foreground">
// //           What you'll get:
// //         </p>
// //         <div className="space-y-1">
// //           {[
// //             "7-day free trial",
// //             "Up to 3 explorer profiles",
// //             "Full parent dashboard",
// //           ].map((item) => (
// //             <p
// //               key={item}
// //               className="flex items-center gap-2 text-xs text-muted-foreground"
// //             >
// //               <CheckCircle className="h-3 w-3 text-explorer-green flex-shrink-0" />{" "}
// //               {item}
// //             </p>
// //           ))}
// //         </div>
// //       </div>
// //     </form>
// //   );

// //   const renderSignupStep2 = () => (
// //     <form onSubmit={handleStep2Continue} noValidate className="space-y-5">
// //       {/* Child Name */}
// //       <div className="space-y-1">
// //         <Label htmlFor="childName" className="font-body font-semibold">
// //           Explorer's Name
// //         </Label>
// //         <div className="relative">
// //           <Baby className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
// //           <Input
// //             ref={firstInputRef}
// //             id="childName"
// //             autoComplete="off"
// //             placeholder="Your child's first name"
// //             className={`rounded-xl pl-10 ${state.errors.childName ? "border-red-400 focus-visible:ring-red-300" : ""}`}
// //             value={state.childName}
// //             onChange={setField("childName")}
// //             onBlur={() => {
// //               dispatch({ type: "SET_TOUCHED", field: "childName" });
// //               dispatch({
// //                 type: "SET_ERROR",
// //                 field: "childName",
// //                 error: VALIDATORS.childName(state.childName) || null,
// //               });
// //             }}
// //             disabled={isLoading}
// //           />
// //         </div>
// //         <AnimatePresence mode="wait">
// //           <FieldError error={state.errors.childName} />
// //         </AnimatePresence>
// //       </div>

// //       {/* Age Group */}
// //       <div className="space-y-2">
// //         <div className="flex items-center gap-1">
// //           <CalendarDays className="h-4 w-4 text-muted-foreground" />
// //           <Label className="font-body font-semibold">Age Group</Label>
// //         </div>
// //         <div className="grid grid-cols-2 gap-2">
// //           {AGE_GROUPS.map((group) => (
// //             <button
// //               key={group.value}
// //               type="button"
// //               onClick={() => {
// //                 dispatch({
// //                   type: "SET_FIELD",
// //                   field: "ageGroup",
// //                   value: group.value,
// //                 });
// //                 dispatch({ type: "SET_TOUCHED", field: "ageGroup" });
// //                 dispatch({ type: "SET_ERROR", field: "ageGroup", error: null });
// //               }}
// //               className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm font-semibold transition-all ${
// //                 state.ageGroup === group.value
// //                   ? "border-primary bg-primary/10 text-primary"
// //                   : "border-border bg-card hover:border-primary/40 text-muted-foreground"
// //               }`}
// //             >
// //               <span className="text-base">{group.emoji}</span>
// //               {group.label}
// //             </button>
// //           ))}
// //         </div>
// //         <AnimatePresence mode="wait">
// //           <FieldError error={state.errors.ageGroup} />
// //         </AnimatePresence>
// //       </div>

// //       {/* Learning Style (optional) */}
// //       {/* <div className="space-y-2">
// //         <Label className="font-body font-semibold text-muted-foreground">
// //           Learning Style{" "}
// //           <span className="text-xs font-normal">(optional)</span>
// //         </Label>
// //         <div className="grid grid-cols-2 gap-2">
// //           {LEARNING_STYLES.map((style) => (
// //             <button
// //               key={style.value}
// //               type="button"
// //               onClick={() =>
// //                 dispatch({
// //                   type: "SET_FIELD",
// //                   field: "learningStyle",
// //                   value: state.learningStyle === style.value ? "" : style.value,
// //                 })
// //               }
// //               className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm font-semibold transition-all ${
// //                 state.learningStyle === style.value
// //                   ? "border-primary bg-primary/10 text-primary"
// //                   : "border-border bg-card hover:border-primary/40 text-muted-foreground"
// //               }`}
// //             >
// //               <span className="text-base">{style.emoji}</span>
// //               {style.label}
// //             </button>
// //           ))}
// //         </div>
// //       </div> */}

// //       <div className="flex gap-2">
// //         <Button
// //           type="button"
// //           variant="outline"
// //           size="lg"
// //           className="rounded-xl"
// //           onClick={() => setSignupStep(0)}
// //           disabled={isLoading}
// //         >
// //           <ChevronLeft className="h-4 w-4" />
// //         </Button>
// //         <Button
// //           variant="explorer"
// //           size="lg"
// //           className="flex-1"
// //           type="submit"
// //           disabled={isLoading}
// //         >
// //           {isLoading ? (
// //             <Loader2 className="h-4 w-4 animate-spin" />
// //           ) : (
// //             <>
// //               Continue to Step 3
// //               <ArrowRight className="h-4 w-4" />
// //             </>
// //           )}
// //         </Button>
// //       </div>
// //     </form>
// //   );

// //   const renderSignupStep3 = () => (
// //     <div className="space-y-5">
// //       {/* Summary Card */}
// //       <div className="rounded-2xl border border-border bg-muted/50 p-5 space-y-3">
// //         <p className="text-sm font-bold text-foreground">Review your setup</p>

// //         <div className="space-y-2">
// //           <div className="flex items-center justify-between text-sm">
// //             <span className="text-muted-foreground flex items-center gap-1">
// //               <User className="h-3 w-3" /> Parent
// //             </span>
// //             <span className="font-semibold truncate max-w-[55%]">
// //               {state.name}
// //             </span>
// //           </div>
// //           <div className="flex items-center justify-between text-sm">
// //             <span className="text-muted-foreground flex items-center gap-1">
// //               <Mail className="h-3 w-3" /> Email
// //             </span>
// //             <span className="font-semibold truncate max-w-[55%]">
// //               {state.email}
// //             </span>
// //           </div>
// //           <div className="h-px bg-border" />
// //           <div className="flex items-center justify-between text-sm">
// //             <span className="text-muted-foreground flex items-center gap-1">
// //               <Baby className="h-3 w-3" /> Explorer
// //             </span>
// //             <span className="font-semibold">{state.childName}</span>
// //           </div>
// //           <div className="flex items-center justify-between text-sm">
// //             <span className="text-muted-foreground flex items-center gap-1">
// //               <CalendarDays className="h-3 w-3" /> Age Group
// //             </span>
// //             <span className="font-semibold">
// //               {AGE_GROUPS.find((g) => g.value === state.ageGroup)?.label}
// //             </span>
// //           </div>
// //           {/* {state.learningStyle && (
// //             <div className="flex items-center justify-between text-sm">
// //               <span className="text-muted-foreground flex items-center gap-1">
// //                 <Sparkles className="h-3 w-3" /> Learning Style
// //               </span>
// //               <span className="font-semibold capitalize">
// //                 {state.learningStyle}
// //               </span>
// //             </div>
// //           )} */}
// //         </div>
// //       </div>

// //       <p className="text-xs text-muted-foreground text-center">
// //         By creating an account you agree to our{" "}
// //         <Link to="/terms" className="text-primary hover:underline font-medium">
// //           Terms of Service
// //         </Link>{" "}
// //         and{" "}
// //         <Link
// //           to="/privacy"
// //           className="text-primary hover:underline font-medium"
// //         >
// //           Privacy Policy
// //         </Link>
// //         .
// //       </p>

// //       <div className="flex gap-2">
// //         <Button
// //           type="button"
// //           variant="outline"
// //           size="lg"
// //           className="rounded-xl"
// //           onClick={() => setSignupStep(1)}
// //           disabled={isLoading}
// //         >
// //           <ChevronLeft className="h-4 w-4" />
// //         </Button>
// //         <Button
// //           variant="explorer"
// //           size="lg"
// //           className="flex-1"
// //           onClick={handleFinalSignup}
// //           disabled={isLoading}
// //         >
// //           {isLoading ? (
// //             <Loader2 className="h-4 w-4 animate-spin" />
// //           ) : (
// //             <>🚀 Launch My Adventure!</>
// //           )}
// //         </Button>
// //       </div>
// //     </div>
// //   );

// //   // ─────────────────────────────────────────────
// //   // Layout
// //   // ─────────────────────────────────────────────

// //   const headings = {
// //     login: {
// //       title: "Welcome Back, Explorer!",
// //       sub: "Sign in to continue your journey.",
// //     },
// //     signup0: {
// //       title: "Create Parent Account",
// //       sub: "Set up your account to start your child's AI adventure.",
// //     },
// //     signup1: {
// //       title: "Add Your Explorer",
// //       sub: "Tell us a bit about your child.",
// //     },
// //     signup2: {
// //       title: "Almost There!",
// //       sub: "Confirm your setup and launch the adventure.",
// //     },
// //   };

// //   const headingKey = !isSignup ? "login" : `signup${signupStep}`;
// //   const { title, sub } = headings[headingKey];

// //   return (
// //     <div className="flex min-h-screen items-center justify-center bg-gradient-hero p-4">
// //       <motion.div
// //         key={isSignup ? `signup-${signupStep}` : "login"}
// //         className="w-full max-w-md rounded-2xl bg-card p-8 shadow-card"
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.4, ease: "easeOut" }}
// //       >
// //         {/* Logo */}
// //         <Link to="/" className="mb-6 flex items-center justify-center gap-2">
// //           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-coral">
// //             <Compass className="h-5 w-5 text-primary-foreground" />
// //           </div>
// //           <span className="font-display text-2xl font-bold">
// //             Future Explorer
// //           </span>
// //         </Link>

// //         {/* Onboarding stepper */}
// //         {isSignup && <OnboardingProgress currentStep={signupStep} />}

// //         {/* Heading */}
// //         <AnimatePresence mode="wait">
// //           <motion.div
// //             key={headingKey + "-heading"}
// //             initial={{ opacity: 0, x: 10 }}
// //             animate={{ opacity: 1, x: 0 }}
// //             exit={{ opacity: 0, x: -10 }}
// //             transition={{ duration: 0.2 }}
// //           >
// //             <h1 className="mb-1 text-center font-display text-2xl font-bold">
// //               {title}
// //             </h1>
// //             <p className="mb-6 text-center text-sm text-muted-foreground">
// //               {sub}
// //             </p>
// //           </motion.div>
// //         </AnimatePresence>

// //         {/* Global Error Banner */}
// //         <AnimatePresence>
// //           {globalError && (
// //             <motion.div
// //               className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
// //               initial={{ opacity: 0, scale: 0.97 }}
// //               animate={{ opacity: 1, scale: 1 }}
// //               exit={{ opacity: 0, scale: 0.97 }}
// //               role="alert"
// //             >
// //               <AlertCircle className="h-4 w-4 flex-shrink-0" />
// //               {globalError}
// //             </motion.div>
// //           )}
// //         </AnimatePresence>

// //         {/* Success Banner */}
// //         <AnimatePresence>
// //           {successMessage && (
// //             <motion.div
// //               className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
// //               initial={{ opacity: 0, scale: 0.97 }}
// //               animate={{ opacity: 1, scale: 1 }}
// //               role="status"
// //             >
// //               <CheckCircle className="h-4 w-4 flex-shrink-0" />
// //               {successMessage}
// //             </motion.div>
// //           )}
// //         </AnimatePresence>

// //         {/* Form Body */}
// //         <AnimatePresence mode="wait">
// //           <motion.div
// //             key={headingKey}
// //             initial={{ opacity: 0, x: isSignup && signupStep > 0 ? 30 : -30 }}
// //             animate={{ opacity: 1, x: 0 }}
// //             exit={{ opacity: 0, x: isSignup && signupStep > 0 ? -30 : 30 }}
// //             transition={{ duration: 0.25, ease: "easeOut" }}
// //           >
// //             {!isSignup && renderLoginForm()}
// //             {isSignup && signupStep === 0 && renderSignupStep1()}
// //             {isSignup && signupStep === 1 && renderSignupStep2()}
// //             {isSignup && signupStep === 2 && renderSignupStep3()}
// //           </motion.div>
// //         </AnimatePresence>

// //         {/* Mode Switch */}
// //         <div className="mt-6 text-center text-sm text-muted-foreground">
// //           {isSignup ? "Already have an account?" : "New to Future Explorer?"}{" "}
// //           <button
// //             onClick={handleModeSwitch}
// //             className="font-bold text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
// //           >
// //             {isSignup ? "Sign In" : "Sign Up Free"}
// //           </button>
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // };

// // export default Login;

// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Compass,
//   Mail,
//   Lock,
//   ArrowRight,
//   User,
//   CheckCircle,
//   Wand2,
//   Chrome,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { trackEvent } from "@/lib/tracking";
// import { useEffect } from "react";
// import { api } from "@/lib/api";

// const onboardingSteps = [
//   { label: "Account", desc: "Create your login" },
//   { label: "Profile", desc: "Add your explorer" },
//   { label: "Start!", desc: "Begin missions" },
// ];

// const Login = () => {
//   const router = useRouter();
//   const [isSignup, setIsSignup] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (isSignup) {
//       trackEvent("onboarding_started");
//     }
//   }, [isSignup]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await api.login(form.email, form.password);
//       router.push("/admin/dashboard");
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-hero p-4">
//       <motion.div
//         className="w-full max-w-md rounded-2xl bg-card p-8 shadow-card"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Link to="/" className="mb-6 flex items-center justify-center gap-2">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-coral">
//             <Compass className="h-5 w-5 text-primary-foreground" />
//           </div>
//           <span className="font-display text-2xl font-bold">
//             Future Explorer
//           </span>
//         </Link>

//         {/* Onboarding Progress (signup only) */}
//         {isSignup && (
//           <div className="mb-6">
//             <div className="flex items-center justify-between">
//               {onboardingSteps.map((step, i) => (
//                 <div
//                   key={step.label}
//                   className="flex flex-1 flex-col items-center"
//                 >
//                   <div
//                     className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold font-display transition-all ${
//                       i === 0
//                         ? "bg-gradient-coral text-primary-foreground"
//                         : "bg-muted text-muted-foreground"
//                     }`}
//                   >
//                     {i === 0 ? "1" : i + 1}
//                   </div>
//                   <p className="mt-1 text-xs font-semibold text-muted-foreground">
//                     {step.label}
//                   </p>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-2 flex gap-1">
//               <div className="h-1 flex-1 rounded-full bg-gradient-coral" />
//               <div className="h-1 flex-1 rounded-full bg-muted" />
//               <div className="h-1 flex-1 rounded-full bg-muted" />
//             </div>
//             <p className="mt-2 text-center text-xs text-muted-foreground">
//               Step 1 of 3 — Create your parent account
//             </p>
//           </div>
//         )}

//         <h1 className="mb-2 text-center font-display text-2xl font-bold">
//           {isSignup ? "Create Parent Account" : "Welcome Back, Explorer!"}
//         </h1>
//         <p className="mb-6 text-center text-sm text-muted-foreground">
//           {isSignup
//             ? "Set up your account to start your child's AI adventure."
//             : "Sign in to continue your journey."}
//         </p>

//         {/* Sign-in Options */}
//         {!isSignup && (
//           <div className="mb-6 space-y-3">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <div className="text-xs text-muted-foreground/60">OR</div>
//               </div>
//               <form
//                 onSubmit={(e) => e.preventDefault()}
//                 className="relative space-y-4"
//               >
//                 <div className="space-y-2">
//                   <Label htmlFor="name" className="font-body font-semibold">
//                     Full Name
//                   </Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                     <Input
//                       id="name"
//                       placeholder="Your name"
//                       className="rounded-xl pl-10"
//                     />
//                   </div>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     Help us personalize your experience
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="font-body font-semibold">
//                     Email
//                   </Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="parent@email.com"
//                       className="rounded-xl pl-10"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="password" className="font-body font-semibold">
//                     Password
//                   </Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                     <Input
//                       id="password"
//                       type="password"
//                       placeholder="•••••"
//                       className="rounded-xl pl-10"
//                     />
//                   </div>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     Secure password for account protection
//                   </p>
//                 </div>
//                 <Link to={isSignup ? "/create-child" : "/dashboard"}>
//                   <Button
//                     variant="explorer"
//                     size="lg"
//                     className="w-full mt-2"
//                     onClick={() => {
//                       if (isSignup) {
//                         trackEvent("onboarding_started");
//                         // Trigger welcome email for new signups
//                         const email = (
//                           document.getElementById("email") as HTMLInputElement
//                         )?.value;
//                         const name = (
//                           document.getElementById("name") as HTMLInputElement
//                         )?.value;
//                         if (email && name) {
//                           automationService.registerUser({
//                             email,
//                             parentName: name,
//                             childProfiles: [],
//                           });
//                         }
//                       }
//                     }}
//                   >
//                     {isSignup ? "Continue to Step 2" : "Sign In"}
//                     <ArrowRight className="h-4 w-4" />
//                   </Button>
//                 </Link>
//               </form>
//               {/* Child Profile Setup Indication */}
//               {isSignup && (
//                 <div className="mt-4 rounded-xl bg-explorer-blue/10 p-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <User className="h-4 w-4 text-explorer-blue" />
//                     <p className="text-sm font-semibold text-explorer-blue">
//                       Next: Set up child profiles
//                     </p>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     After creating your account, you'll add explorer profiles
//                     for your children with their names, ages, and learning
//                     preferences.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {!isSignup && (
//           <div className="mt-4 text-center">
//             <Link
//               to="/lesson/1"
//               className="text-sm font-semibold text-primary hover:underline"
//             >
//               🎮 Preview a Sample Mission first
//             </Link>
//           </div>
//         )}

//         <div className="mt-6 text-center text-sm text-muted-foreground">
//           {isSignup ? "Already have an account?" : "New to Future Explorer?"}{" "}
//           <button
//             onClick={() => setIsSignup(!isSignup)}
//             className="font-bold text-primary hover:underline"
//           >
//             {isSignup ? "Sign In" : "Sign Up Free"}
//           </button>
//         </div>

//         {isSignup && (
//           <div className="mt-4 space-y-2 rounded-xl bg-muted p-3">
//             <p className="text-xs font-semibold text-muted-foreground">
//               What you'll get:
//             </p>
//             <div className="space-y-1">
//               {[
//                 "7-day free trial",
//                 "Up to 3 explorer profiles",
//                 "Full parent dashboard",
//               ].map((item) => (
//                 <p
//                   key={item}
//                   className="flex items-center gap-2 text-xs text-muted-foreground"
//                 >
//                   <CheckCircle className="h-3 w-3 text-explorer-green" /> {item}
//                 </p>
//               ))}
//             </div>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default Login;

import { useState, useReducer, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Compass,
  Mail,
  Lock,
  ArrowRight,
  User,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ChevronLeft,
  Baby,
  CalendarDays,
  Sparkles,
  Shield,
  Camera,
  ImagePlus,
  Globe,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/tracking";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useAuthContext } from "@/contexts/AuthProvider";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const SIGNUP_STEPS = [
  { label: "Account", desc: "Your credentials", icon: Shield },
  { label: "Profile", desc: "About you", icon: User },
  // { label: "Explorer", desc: "Your child's info",  icon: Baby      },
  { label: "Launch!", desc: "Review & go", icon: Sparkles },
];

const AGE_GROUPS = [
  { value: "5-7", label: "5 – 7 yrs", emoji: "🌱" },
  { value: "8-10", label: "8 – 10 yrs", emoji: "🚀" },
  { value: "11-13", label: "11 – 13 yrs", emoji: "🔬" },
  { value: "14+", label: "14+ yrs", emoji: "🌍" },
];

const AVATAR_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
];

// ─────────────────────────────────────────────
// Validators
// ─────────────────────────────────────────────

const V = {
  name: (v) => {
    if (!v?.trim()) return "Full name is required.";
    if (v.trim().length < 2) return "At least 2 characters.";
    if (v.trim().length > 60) return "Too long.";
    return null;
  },
  email: (v) => {
    if (!v?.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email.";
    return null;
  },
  password: (v) => {
    if (!v) return "Password is required.";
    if (v.length < 8) return "At least 8 characters.";
    if (!/[A-Z]/.test(v)) return "Add an uppercase letter.";
    if (!/[0-9]/.test(v)) return "Add a number.";
    return null;
  },
  confirmPassword: (v, pwd) => {
    if (!v) return "Confirm your password.";
    if (v !== pwd) return "Passwords don't match.";
    return null;
  },
  // displayName: (v) => {
  //   if (!v?.trim()) return "Display name is required.";
  //   if (v.trim().length < 2) return "At least 2 characters.";
  //   return null;
  // },
  // childName: (v) => {
  //   if (!v?.trim()) return "Child's name is required.";
  //   if (v.trim().length < 2) return "At least 2 characters.";
  //   return null;
  // },
  // ageGroup: (v) => (!v ? "Select an age group." : null),
};

const passwordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pwd.length >= 8) s++;
  if (pwd.length >= 12) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  if (s <= 1) return { score: s, label: "Weak", color: "bg-red-400" };
  if (s === 2) return { score: s, label: "Fair", color: "bg-yellow-400" };
  if (s === 3) return { score: s, label: "Good", color: "bg-blue-400" };
  return { score: s, label: "Strong", color: "bg-emerald-400" };
};

// ─────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────

const INIT = {
  // Step 0 — credentials
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  // Step 1 — profile
  // displayName: "",
  bio: "",
  phone: "",
  country: "",
  avatarUrl: "",
  // avatarColor: AVATAR_COLORS[0],
  // Step 2 — child
  // childName: "",
  // ageGroup: "",
  // Meta
  errors: {},
  touched: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "FIELD":
      return { ...state, [action.k]: action.v };
    case "ERROR":
      return { ...state, errors: { ...state.errors, [action.k]: action.v } };
    case "ERRORS":
      return { ...state, errors: { ...state.errors, ...action.v } };
    case "TOUCH":
      return { ...state, touched: { ...state.touched, [action.k]: true } };
    case "RESET":
      return INIT;
    default:
      return state;
  }
}

// ─────────────────────────────────────────────
// Tiny shared components
// ─────────────────────────────────────────────

const Err = ({ msg }) =>
  msg ? (
    <motion.p
      className="mt-1 flex items-center gap-1 text-xs text-red-500"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
    >
      <AlertCircle className="h-3 w-3 shrink-0" /> {msg}
    </motion.p>
  ) : null;

const StrengthBar = ({ pwd }) => {
  const s = passwordStrength(pwd);
  if (!pwd) return null;
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= s.score ? s.color : "bg-muted"}`}
          />
        ))}
      </div>
      <p
        className={`text-xs font-medium ${
          s.score <= 1
            ? "text-red-400"
            : s.score === 2
              ? "text-yellow-500"
              : s.score === 3
                ? "text-blue-500"
                : "text-emerald-500"
        }`}
      >
        {s.label}
      </p>
    </div>
  );
};

const Stepper = ({ step }) => (
  <div className="mb-6">
    <div className="flex items-center justify-between">
      {SIGNUP_STEPS.map(({ label, icon: Icon }, i) => {
        const active = i === step,
          done = i < step;
        return (
          <div key={label} className="flex flex-1 flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold font-display transition-all duration-300 ${
                active
                  ? "bg-gradient-coral text-primary-foreground scale-110 shadow-md"
                  : done
                    ? "bg-emerald-500 text-white"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? (
                <CheckCircle className="h-4 w-4" />
              ) : active ? (
                <Icon className="h-4 w-4" />
              ) : (
                i + 1
              )}
            </div>
            <p
              className={`mt-1 text-[10px] font-semibold transition-colors ${active ? "text-foreground" : "text-muted-foreground"}`}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
    <div className="mt-2 flex gap-1">
      {SIGNUP_STEPS.map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-muted"}`}
        />
      ))}
    </div>
    <p className="mt-2 text-center text-xs text-muted-foreground">
      Step {step + 1} of {SIGNUP_STEPS.length} — {SIGNUP_STEPS[step].desc}
    </p>
  </div>
);

// ─────────────────────────────────────────────
// AvatarPicker
// ─────────────────────────────────────────────

const AvatarPicker = ({ state, dispatch }) => {
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      dispatch({ type: "ERROR", k: "avatarUrl", v: "Max file size is 3 MB." });
      return;
    }

    try {
      dispatch({ type: "LOADING_AVATAR", v: true });

      // preview instantly (UX win)
      const reader = new FileReader();
      reader.onload = () =>
        dispatch({ type: "FIELD", k: "avatarUrl", v: reader.result });
      reader.readAsDataURL(file);

      // 🔥 upload to backend
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await api.uploadAvatar(formData);

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ replace preview with real URL
      dispatch({ type: "FIELD", k: "avatarUrl", v: data.url });
    } catch (err: any) {
      dispatch({
        type: "ERROR",
        k: "avatarUrl",
        v: err.message || "Upload failed",
      });
    } finally {
      dispatch({ type: "LOADING_AVATAR", v: false });
    }
  };

  // const handleFile = (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   if (file.size > 3 * 1024 * 1024) {
  //     dispatch({ type: "ERROR", k: "avatarUrl", v: "Max file size is 3 MB." });
  //     return;
  //   }
  //   const reader = new FileReader();
  //   reader.onload = () =>
  //     dispatch({ type: "FIELD", k: "avatarUrl", v: reader.result });
  //   reader.readAsDataURL(file);
  // };

  const initials = (state.displayName || state.name || "?")
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="space-y-3">
      <Label className="font-body font-semibold">Profile Picture</Label>
      <div className="flex items-center gap-4">
        {/* Avatar preview */}
        <div
          className="relative h-20 w-20 shrink-0 cursor-pointer rounded-full ring-4 ring-primary/20 overflow-hidden"
          style={{ background: state.avatarColor }}
          onClick={() => !state.avatarUrl && fileRef.current?.click()}
        >
          {state.avatarUrl ? (
            <img
              src={state.avatarUrl}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-display text-2xl font-bold text-white">
              {initials}
            </span>
          )}
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              fileRef.current?.click();
            }}
          >
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-2 flex-1">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted transition-colors w-full"
          >
            <ImagePlus className="h-3.5 w-3.5" /> Upload photo
          </button>
          {state.avatarUrl && (
            <button
              type="button"
              onClick={() => dispatch({ type: "FIELD", k: "avatarUrl", v: "" })}
              className="text-xs text-red-500 hover:underline"
            >
              Remove photo
            </button>
          )}
          {!state.avatarUrl && (
            <div className="flex gap-1.5 flex-wrap">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    dispatch({ type: "FIELD", k: "avatarColor", v: c })
                  }
                  className={`h-5 w-5 rounded-full transition-all ${state.avatarColor === c ? "ring-2 ring-offset-1 ring-foreground scale-110" : "hover:scale-110"}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <AnimatePresence>
        <Err msg={state.errors.avatarUrl} />
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

const Login = () => {
  const { user, login, logout, signup } = useAuthContext();
  const navigate = useNavigate();

  // Mode
  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState(0);

  // Signup form state
  const [s, dispatch] = useReducer(reducer, INIT);
  const [showPwd, setShowPwd] = useState(false);
  const [showCpwd, setShowCpwd] = useState(false);

  // Login form state (kept separate — simple)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});

  // Shared
  const [loading, setLoading] = useState(false);
  const [globalErr, setGlobalErr] = useState(null);
  const [success, setSuccess] = useState(null);
  const firstRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => firstRef.current?.focus(), 320);
    return () => clearTimeout(t);
  }, [isSignup, step]);

  useEffect(() => {
    if (globalErr) setGlobalErr(null);
  }, [s, loginEmail, loginPassword]);

  // ── Live change handler ──
  const onField = useCallback(
    (k) => (e) => {
      const v = e.target?.value ?? e;
      dispatch({ type: "FIELD", k, v });
      dispatch({ type: "TOUCH", k });
      if (s.touched[k] || s.errors[k]) {
        const err =
          k === "confirmPassword"
            ? V.confirmPassword(v, s.password)
            : V[k]?.(v);
        dispatch({ type: "ERROR", k, v: err || null });
      }
    },
    [s.touched, s.errors, s.password],
  );

  // ── Bulk validate ──
  const validate = useCallback(
    (fields) => {
      const errs = {};
      let bad = false;
      fields.forEach((k) => {
        const fn =
          k === "confirmPassword"
            ? (v) => V.confirmPassword(v, s.password)
            : V[k];
        const err = fn?.(s[k]);
        dispatch({ type: "TOUCH", k });
        if (err) {
          errs[k] = err;
          bad = true;
        }
      });
      if (bad) dispatch({ type: "ERRORS", v: errs });
      return !bad;
    },
    [s],
  );

  // ── Login submit ──
  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = {};
    const emailErr = V.email(loginEmail);
    if (emailErr) errs.loginEmail = emailErr;
    if (!loginPassword) errs.loginPassword = "Password is required.";
    if (Object.keys(errs).length) {
      setLoginErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      trackEvent("login_success");
      // console.log("before redirection after login");
      // // navigate("/");
      // console.log("after redirection after login");
    } catch (err) {
      console.error("Failed to login:", err);
      setGlobalErr("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // ── Signup step handlers ──
  const goStep0 = async (e) => {
    e.preventDefault();
    // if (!validate(["name", "email", "password", "confirmPassword"])) return;
    if (!validate(["email", "password", "confirmPassword"])) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      trackEvent("signup_step0_done");
      setStep(1);
    } catch {
      setGlobalErr("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const goStep1 = async (e) => {
    e.preventDefault();
    // if (!validate(["displayName"])) return;
    if (!validate(["name"])) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      trackEvent("signup_step1_done");
      setStep(2);
    } catch {
      setGlobalErr("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const goStep2 = async (e) => {
    e.preventDefault();
    if (!validate(["childName", "ageGroup"])) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      trackEvent("signup_step2_done");
      setStep(3);
    } catch {
      setGlobalErr("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handleFinalSubmit = async () => {
  //   setLoading(true);
  //   setGlobalErr(null);
  //   try {
  //     // await api.registerUser({
  //     //   email: s.email, parentName: s.name,
  //     //   displayName: s.displayName, avatarUrl: s.avatarUrl, avatarColor: s.avatarColor,
  //     //   bio: s.bio, phone: s.phone, country: s.country,
  //     //   childProfiles: [{ name: s.childName, ageGroup: s.ageGroup }],
  //     // });
  //     trackEvent("signup_complete");
  //     setSuccess("🎉 Account created! Taking you in...");
  //     await new Promise((r) => setTimeout(r, 1500));
  //     navigate("/dashboard");
  //   } catch {
  //     setGlobalErr("Failed to create your account. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleFinalSubmit = async () => {
    const formData = new FormData();

    formData.append("name", s.name);
    formData.append("email", s.email);
    formData.append("password", s.password);
    // formData.append("displayName", s.displayName);
    formData.append("bio", s.bio || "");
    formData.append("phone", s.phone || "");
    formData.append("country", s.country || "");
    // formData.append("avatarUrl", s.avatarUrl); // 🔥 already uploaded
    // formData.append("childName", s.childName);
    // formData.append("ageGroup", s.ageGroup);

    if (s.avatarUrl) {
      formData.append("avatarUrl", s.avatarUrl);
    }

    console.table(s);

    // await api.signupWithAvatar(formData);
    setLoading(true);
    setGlobalErr(null);

    try {
      // let avatarUrl = null;

      // if (s.avatarFile) {
      //   // temp id (or use uuid)
      //   const tempId = crypto.randomUUID();
      //   avatarUrl = await uploadAvatar(s.avatarFile, tempId);
      // }
      await signup(formData);
      // const res = await fetch("/api/auth/signup", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     name: s.name,
      //     email: s.email,
      //     password: s.password,
      //     displayName: s.displayName,
      //     bio: s.bio,
      //     phone: s.phone,
      //     country: s.country,
      //     avatarUrl,
      //     child: {
      //       name: s.childName,
      //       ageGroup: s.ageGroup,
      //     },
      //   }),
      // });

      // const data = await res.json();

      // if (!res.ok) throw new Error(data.message);

      trackEvent("signup_complete");

      setSuccess("🎉 Account created! Taking you in...");
      await new Promise((r) => setTimeout(r, 1500));

      navigate("/dashboard");
    } catch (err: any) {
      setGlobalErr(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignup((v) => !v);
    setStep(0);
    setGlobalErr(null);
    setSuccess(null);
    dispatch({ type: "RESET" });
    setLoginErrors({});
  };

  // ─────────────────────────────────────────────
  // Form renders
  // ─────────────────────────────────────────────

  const renderLogin = () => (
    <form onSubmit={handleLogin} noValidate className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="l-email" className="font-body font-semibold">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={firstRef}
            id="l-email"
            type="email"
            autoComplete="email"
            placeholder="parent@email.com"
            className={`rounded-xl pl-10 ${loginErrors.loginEmail ? "border-red-400" : ""}`}
            value={loginEmail}
            onChange={(e) => {
              setLoginEmail(e.target.value);
              if (loginErrors.loginEmail)
                setLoginErrors((p) => ({ ...p, loginEmail: null }));
            }}
            disabled={loading}
          />
        </div>
        <AnimatePresence>
          <Err msg={loginErrors.loginEmail} />
        </AnimatePresence>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="l-pwd" className="font-body font-semibold">
            Password
          </Label>
          <Link
            to="/forgot-password"
            className="text-xs text-primary hover:underline"
            tabIndex={-1}
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="l-pwd"
            type={showLoginPwd ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className={`rounded-xl pl-10 pr-10 ${loginErrors.loginPassword ? "border-red-400" : ""}`}
            value={loginPassword}
            onChange={(e) => {
              setLoginPassword(e.target.value);
              if (loginErrors.loginPassword)
                setLoginErrors((p) => ({ ...p, loginPassword: null }));
            }}
            disabled={loading}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowLoginPwd((v) => !v)}
          >
            {showLoginPwd ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <AnimatePresence>
          <Err msg={loginErrors.loginPassword} />
        </AnimatePresence>
      </div>

      <Button
        variant="explorer"
        size="lg"
        className="w-full mt-2"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {" "}
            Sign In <ArrowRight className="h-4 w-4" />{" "}
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground pt-1">
        🎮{" "}
        <Link
          to="/lesson/1"
          className="font-semibold text-primary hover:underline"
        >
          Preview a Sample Mission first
        </Link>
      </p>
    </form>
  );

  const renderStep0 = () => (
    <form onSubmit={goStep0} noValidate className="space-y-4">
      {/* Full Name */}
      {/* <div className="space-y-1">
        <Label htmlFor="s-name" className="font-body font-semibold">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={firstRef}
            id="s-name"
            autoComplete="name"
            placeholder="Your full name"
            className={`rounded-xl pl-10 ${s.errors.name ? "border-red-400" : ""}`}
            value={s.name}
            onChange={onField("name")}
            onBlur={() =>
              dispatch({ type: "ERROR", k: "name", v: V.name(s.name) || null })
            }
            disabled={loading}
          />
        </div>
        <AnimatePresence>
          <Err msg={s.errors.name} />
        </AnimatePresence>
      </div> */}

      {/* Email */}
      <div className="space-y-1">
        <Label htmlFor="s-email" className="font-body font-semibold">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="s-email"
            type="email"
            autoComplete="email"
            placeholder="parent@email.com"
            className={`rounded-xl pl-10 ${s.errors.email ? "border-red-400" : ""}`}
            value={s.email}
            onChange={onField("email")}
            onBlur={() =>
              dispatch({
                type: "ERROR",
                k: "email",
                v: V.email(s.email) || null,
              })
            }
            disabled={loading}
          />
        </div>
        <AnimatePresence>
          <Err msg={s.errors.email} />
        </AnimatePresence>
      </div>

      {/* Password */}
      <div className="space-y-1">
        <Label htmlFor="s-pwd" className="font-body font-semibold">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="s-pwd"
            type={showPwd ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            className={`rounded-xl pl-10 pr-10 ${s.errors.password ? "border-red-400" : ""}`}
            value={s.password}
            onChange={onField("password")}
            onBlur={() =>
              dispatch({
                type: "ERROR",
                k: "password",
                v: V.password(s.password) || null,
              })
            }
            disabled={loading}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPwd((v) => !v)}
          >
            {showPwd ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <StrengthBar pwd={s.password} />
        <AnimatePresence>
          <Err msg={s.errors.password} />
        </AnimatePresence>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <Label htmlFor="s-cpwd" className="font-body font-semibold">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="s-cpwd"
            type={showCpwd ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your password"
            className={`rounded-xl pl-10 pr-10 ${s.errors.confirmPassword ? "border-red-400" : ""}`}
            value={s.confirmPassword}
            onChange={onField("confirmPassword")}
            onBlur={() =>
              dispatch({
                type: "ERROR",
                k: "confirmPassword",
                v: V.confirmPassword(s.confirmPassword, s.password) || null,
              })
            }
            disabled={loading}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowCpwd((v) => !v)}
          >
            {showCpwd ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <AnimatePresence>
          <Err msg={s.errors.confirmPassword} />
        </AnimatePresence>
      </div>

      <Button
        variant="explorer"
        size="lg"
        className="w-full mt-2"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {" "}
            Continue <ArrowRight className="h-4 w-4" />{" "}
          </>
        )}
      </Button>

      <div className="rounded-xl bg-muted p-3 space-y-1.5">
        <p className="text-xs font-semibold text-muted-foreground">
          What you'll get:
        </p>
        {[
          "7-day free trial",
          "Up to 3 explorer profiles",
          "Full parent dashboard",
        ].map((t) => (
          <p
            key={t}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" /> {t}
          </p>
        ))}
      </div>
    </form>
  );

  const renderStep1 = () => (
    <form onSubmit={goStep1} noValidate className="space-y-5">
      <AvatarPicker state={s} dispatch={dispatch} />

      {/* Display name */}
      <div className="space-y-1">
        <Label htmlFor="s-name" className="font-body font-semibold">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={firstRef}
            id="s-name"
            autoComplete="name"
            placeholder="Your full name"
            className={`rounded-xl pl-10 ${s.errors.name ? "border-red-400" : ""}`}
            value={s.name}
            onChange={onField("name")}
            onBlur={() =>
              dispatch({ type: "ERROR", k: "name", v: V.name(s.name) || null })
            }
            disabled={loading}
          />
        </div>
        <AnimatePresence>
          <Err msg={s.errors.name} />
        </AnimatePresence>
      </div>
      {/* <div className="space-y-1">
        <Label htmlFor="p-dname" className="font-body font-semibold">
          Display Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={firstRef}
            id="p-dname"
            autoComplete="nickname"
            placeholder="How should we call you?"
            className={`rounded-xl pl-10 ${s.errors.displayName ? "border-red-400" : ""}`}
            value={s.displayName}
            onChange={onField("displayName")}
            onBlur={() =>
              dispatch({
                type: "ERROR",
                k: "displayName",
                v: V.displayName(s.displayName) || null,
              })
            }
            disabled={loading}
          />
        </div>
        <AnimatePresence>
          <Err msg={s.errors.displayName} />
        </AnimatePresence>
      </div> */}

      {/* Bio */}
      <div className="space-y-1">
        <Label htmlFor="p-bio" className="font-body font-semibold">
          Short Bio{" "}
          <span className="text-xs font-normal text-muted-foreground">
            (optional)
          </span>
        </Label>
        <textarea
          id="p-bio"
          rows={2}
          placeholder="Tell us a little about yourself..."
          className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          value={s.bio}
          onChange={(e) =>
            dispatch({ type: "FIELD", k: "bio", v: e.target.value })
          }
          maxLength={160}
          disabled={loading}
        />
        <p className="text-right text-xs text-muted-foreground">
          {s.bio.length}/160
        </p>
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <Label htmlFor="p-phone" className="font-body font-semibold">
          Phone{" "}
          <span className="text-xs font-normal text-muted-foreground">
            (optional)
          </span>
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="p-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 555 000 0000"
            className="rounded-xl pl-10"
            value={s.phone}
            onChange={(e) =>
              dispatch({ type: "FIELD", k: "phone", v: e.target.value })
            }
            disabled={loading}
          />
        </div>
      </div>

      {/* Country */}
      <div className="space-y-1">
        <Label htmlFor="p-country" className="font-body font-semibold">
          Country{" "}
          <span className="text-xs font-normal text-muted-foreground">
            (optional)
          </span>
        </Label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="p-country"
            autoComplete="country-name"
            placeholder="e.g. United States"
            className="rounded-xl pl-10"
            value={s.country}
            onChange={(e) =>
              dispatch({ type: "FIELD", k: "country", v: e.target.value })
            }
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="rounded-xl"
          onClick={() => setStep(0)}
          disabled={loading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="explorer"
          size="lg"
          className="flex-1"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {" "}
              Continue <ArrowRight className="h-4 w-4" />{" "}
            </>
          )}
        </Button>
      </div>
    </form>
  );

  // const renderStep2 = () => (
  //   <form onSubmit={goStep2} noValidate className="space-y-5">
  //     <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
  //       👋 Now let's add your child's explorer profile. You can add more from
  //       the dashboard later.
  //     </div>

  //     <div className="space-y-1">
  //       <Label htmlFor="c-name" className="font-body font-semibold">
  //         Explorer's Name
  //       </Label>
  //       <div className="relative">
  //         <Baby className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  //         <Input
  //           ref={firstRef}
  //           id="c-name"
  //           autoComplete="off"
  //           placeholder="Your child's first name"
  //           className={`rounded-xl pl-10 ${s.errors.childName ? "border-red-400" : ""}`}
  //           value={s.childName}
  //           onChange={onField("childName")}
  //           onBlur={() =>
  //             dispatch({
  //               type: "ERROR",
  //               k: "childName",
  //               v: V.childName(s.childName) || null,
  //             })
  //           }
  //           disabled={loading}
  //         />
  //       </div>
  //       <AnimatePresence>
  //         <Err msg={s.errors.childName} />
  //       </AnimatePresence>
  //     </div>

  //     <div className="space-y-2">
  //       <div className="flex items-center gap-1">
  //         <CalendarDays className="h-4 w-4 text-muted-foreground" />
  //         <Label className="font-body font-semibold">Age Group</Label>
  //       </div>
  //       <div className="grid grid-cols-2 gap-2">
  //         {AGE_GROUPS.map((g) => (
  //           <button
  //             key={g.value}
  //             type="button"
  //             onClick={() => {
  //               dispatch({ type: "FIELD", k: "ageGroup", v: g.value });
  //               dispatch({ type: "TOUCH", k: "ageGroup" });
  //               dispatch({ type: "ERROR", k: "ageGroup", v: null });
  //             }}
  //             className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm font-semibold transition-all ${
  //               s.ageGroup === g.value
  //                 ? "border-primary bg-primary/10 text-primary"
  //                 : "border-border bg-card hover:border-primary/40 text-muted-foreground"
  //             }`}
  //           >
  //             <span className="text-base">{g.emoji}</span> {g.label}
  //           </button>
  //         ))}
  //       </div>
  //       <AnimatePresence>
  //         <Err msg={s.errors.ageGroup} />
  //       </AnimatePresence>
  //     </div>

  //     <div className="flex gap-2">
  //       <Button
  //         type="button"
  //         variant="outline"
  //         size="lg"
  //         className="rounded-xl"
  //         onClick={() => setStep(1)}
  //         disabled={loading}
  //       >
  //         <ChevronLeft className="h-4 w-4" />
  //       </Button>
  //       <Button
  //         variant="explorer"
  //         size="lg"
  //         className="flex-1"
  //         type="submit"
  //         disabled={loading}
  //       >
  //         {loading ? (
  //           <Loader2 className="h-4 w-4 animate-spin" />
  //         ) : (
  //           <>
  //             {" "}
  //             Continue <ArrowRight className="h-4 w-4" />{" "}
  //           </>
  //         )}
  //       </Button>
  //     </div>
  //   </form>
  // );

  const renderStep3 = () => {
    const initials = (s.displayName || s.name || "?")
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");

    return (
      <div className="space-y-5">
        {/* Summary */}
        <div className="rounded-2xl border border-border bg-muted/40 p-4 space-y-4">
          {/* Avatar + name */}
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 shrink-0 rounded-full overflow-hidden ring-2 ring-primary/20"
              style={{ background: s.avatarColor }}
            >
              {s.avatarUrl ? (
                <img
                  src={s.avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-display text-lg font-bold text-white">
                  {initials}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">{s.displayName || s.name}</p>
              <p className="text-xs text-muted-foreground">{s.email}</p>
            </div>
          </div>

          {s.bio && (
            <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-3">
              "{s.bio}"
            </p>
          )}

          {(s.phone || s.country) && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {s.phone && (
                <>
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{s.phone}</span>
                </>
              )}
              {s.country && (
                <>
                  <span className="text-muted-foreground">Country</span>
                  <span className="font-medium">{s.country}</span>
                </>
              )}
            </div>
          )}

          {/* <div className="h-px bg-border" /> */}

          {/* Child */}
          {/* <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Baby className="h-3.5 w-3.5" /> Explorer
            </span>
            <span className="font-semibold">
              {s.childName} ·{" "}
              {AGE_GROUPS.find((g) => g.value === s.ageGroup)?.label}
            </span>
          </div> */}
        </div>

        {/* Quick-edit links */}
        <div className="flex justify-center gap-4 text-xs flex-wrap">
          {[
            ["Edit credentials", 0],
            ["Edit profile", 1],
            // ["Edit explorer", 2],
          ].map(([label, target]) => (
            <button
              key={label}
              onClick={() => setStep(target)}
              className="text-primary hover:underline"
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          By continuing you agree to our{" "}
          <Link
            to="/terms"
            className="text-primary hover:underline font-medium"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="text-primary hover:underline font-medium"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="rounded-xl"
            onClick={() => setStep(2)}
            disabled={loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="explorer"
            size="lg"
            className="flex-1"
            onClick={handleFinalSubmit}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "🚀 Launch My Adventure!"
            )}
          </Button>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────
  // Heading map
  // ─────────────────────────────────────────────

  const HEADS = {
    login: {
      title: "Welcome Back, Explorer!",
      sub: "Sign in to continue your journey.",
    },
    step0: {
      title: "Create Parent Account",
      sub: "Set up your credentials to get started.",
    },
    step1: {
      title: "Build Your Profile",
      sub: "Add a photo and personal details.",
    },
    step2: { title: "Add Your Explorer", sub: "Tell us about your child." },
    step3: {
      title: "Almost There!",
      sub: "Review your setup and launch the adventure.",
    },
  };

  const hk = !isSignup ? "login" : `step${step}`;
  const { title, sub } = HEADS[hk];

  // ─────────────────────────────────────────────
  // Layout
  // ─────────────────────────────────────────────

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero p-4 py-10">
      <motion.div
        key={hk}
        className="w-full max-w-md rounded-2xl bg-card p-8 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Logo */}
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-coral">
            <Compass className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">
            Future Explorer
          </span>
        </Link>

        {isSignup && <Stepper step={step} />}

        {/* Heading */}
        <AnimatePresence mode="wait">
          <motion.div
            key={hk + "-h"}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="mb-1 text-center font-display text-2xl font-bold">
              {title}
            </h1>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              {sub}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Global error */}
        <AnimatePresence>
          {globalErr && (
            <motion.div
              role="alert"
              className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
            >
              <AlertCircle className="h-4 w-4 shrink-0" /> {globalErr}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success */}
        <AnimatePresence>
          {success && (
            <motion.div
              role="status"
              className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className="h-4 w-4 shrink-0" /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={hk + "-body"}
            initial={{ opacity: 0, x: isSignup && step > 0 ? 28 : -28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSignup && step > 0 ? -28 : 28 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {!isSignup && renderLogin()}
            {isSignup && step === 0 && renderStep0()}
            {isSignup && step === 1 && renderStep1()}
            {/* {isSignup && step === 2 && renderStep2()} */}
            {/* {isSignup && step === 3 && renderStep3()} */}
            {isSignup && step === 2 && renderStep3()}
          </motion.div>
        </AnimatePresence>

        {/* Mode switch */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "New to Future Explorer?"}{" "}
          <button
            onClick={switchMode}
            className="font-bold text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            {isSignup ? "Sign In" : "Sign Up Free"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
