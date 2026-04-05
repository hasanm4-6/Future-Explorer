import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import CreateChild from "./pages/CreateChild";
import LessonMap from "./pages/LessonMap";
import LessonDetail from "./pages/LessonDetail";
import Downloads from "./pages/Downloads";
import Settings from "./pages/Settings";
import TeacherDashboard from "./pages/TeacherDashboard";
import Privacy from "./pages/Privacy";
import PrivacySummary from "./pages/PrivacySummary";
import DataManagement from "./pages/DataManagement";
import ParentalConsent from "./pages/ParentalConsent";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "@/components/ErrorBoundary";

import { AuthProvider } from "@/contexts/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import RootRoute from "@/components/RootRoute";
const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* <Route
                path="/"
                element={
                  // <PublicRoute>
                  <Index />
                  // </PublicRoute>
                }
              /> */}
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
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
