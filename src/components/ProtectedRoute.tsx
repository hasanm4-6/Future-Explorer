// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthProvider";
import LoadingState from "./Loading";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuthContext();

  if (loading) return <LoadingState />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
