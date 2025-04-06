import React from "react";
import { Navigate } from "react-router-dom";

// Utility: Make "admin", "event organization" → "Admin", "Event Organization"
const toTitleCase = (str = "") =>
  str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user || !user.role) {
    return <Navigate to="/unauthorized" replace />;
  }

  const userRole = toTitleCase(user.role);
  const allowed = allowedRoles.map(toTitleCase);

  console.log("🔍 Checking user.role:", userRole);
  console.log("🔍 Allowed Roles:", allowed);

  if (!allowed.includes(userRole)) {
    console.warn("⛔ Role unauthorized:", userRole);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
