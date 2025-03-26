import React from "react";

export const CardContent = ({ children, className = "" }) => {
  return (
    <div className={`p-4 bg-white rounded-xl shadow-md ${className}`}>
      {children}
    </div>
  );
};
