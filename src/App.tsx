import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import Loading from "@/components/Loading";

import { AuthProvider } from "@/contexts/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import RootRoute from "@/components/RootRoute";

// ── Lazy-loaded pages (code splitting) ─────────────────────────────────────
// Only the shell (Navbar, routing, auth) is in the main bundle.
// Each page is loaded on demand when navigated to.
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateChild = lazy(() => import("./pages/CreateChild"));
const LessonMap = lazy(() => import("./pages/LessonMap"));
const LessonDetail = lazy(() => import("./pages/LessonDetail"));
const Downloads = lazy(() => import("./pages/Downloads"));
const Settings = lazy(() => import("./pages/Settings"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const Privacy = lazy(() => import("./pages/Privacy"));
const PrivacySummary = lazy(() => import("./pages/PrivacySummary"));
const DataManagement = lazy(() => import("./pages/DataManagement"));
const ParentalConsent = lazy(() => import("./pages/ParentalConsent"));
const NotFound = lazy(() => import("./pages/NotFound"));

// ── QueryClient with production-ready defaults ─────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,       // 2 min — data considered fresh
      gcTime: 10 * 60 * 1000,         // 10 min — garbage collect cache
      refetchOnWindowFocus: false,     // Don't spam API on tab switch
      retry: 1,                        // One retry on failure
      refetchOnMount: "always",        // Ensure fresh data on mount (respects staleTime)
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<RootRoute />} />

                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route path="/pricing" element={<Pricing />} />
                <Route
                  element={
                    <ProtectedRoute>
                      <Outlet />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/create-child" element={<CreateChild />} />
                  <Route path="/lessons" element={<LessonMap />} />
                  <Route path="/lesson/:id" element={<LessonDetail />} />
                  <Route path="/downloads" element={<Downloads />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/data-management" element={<DataManagement />} />
                  <Route path="/teacher" element={<TeacherDashboard />} />
                </Route>
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/privacy-summary" element={<PrivacySummary />} />
                <Route path="/parental-consent" element={<ParentalConsent />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
