import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/localAuth";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
