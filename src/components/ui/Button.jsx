import React from "react";


export const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-semibold ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export function buttonVariants({ variant = "default" } = {}) {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-black text-white hover:bg-black/90",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
  
    gradient:
     "bg-gradient-to-br from-black via-gray-800 to-gray-600 text-white shadow-lg hover:shadow-2xl hover:brightness-110 transition-all",
  };
  

  return `${base} ${variants[variant] || variants.default}`;
}
