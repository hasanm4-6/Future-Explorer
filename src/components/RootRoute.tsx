import { useAuthContext } from "@/contexts/AuthProvider";
import { Navigate } from "react-router-dom";
import LoadingState from "@/components/Loading";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Index";

const RootRoute = () => {
  const { user, loading } = useAuthContext();

  // 🔥 CRITICAL: block until auth resolved
  if (loading) return <LoadingState />;

  return user ? <Dashboard /> : <Landing />;
};

export default RootRoute;
