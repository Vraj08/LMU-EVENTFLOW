import { useState } from "react";
import { PencilIcon, LogOutIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UserProfileMenu({ firstName, lastName, onEditClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("eventflowUser");
    toast.success("Logged out successfully!");
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div className="relative text-center">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="rounded-full border-4 border-white overflow-hidden shadow-md hover:shadow-lg transition"
      >
        <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold uppercase">
          {firstName?.[0]}{lastName?.[0]}
        </div>
      </button>
      <div className="text-sm mt-1 text-purple-800 dark:text-white font-semibold">
        {firstName} {lastName}
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 top-14 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
        >
          <button
            onClick={() => {
              onEditClick();
              setMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <PencilIcon className="w-4 h-4" />
            Update Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400"
          >
            <LogOutIcon className="w-4 h-4" />
            Logout
          </button>
        </motion.div>
      )}
    </div>
  );
}
