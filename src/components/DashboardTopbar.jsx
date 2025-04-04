import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOutIcon, PencilIcon, SunIcon, MoonIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardTopbar({
  darkMode,
  setDarkMode,
  firstName = "",
  lastName = "",
  onLogout = () => {},
  onProfileUpdate = () => {}
}) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempFirstName, setTempFirstName] = useState("");
  const [tempLastName, setTempLastName] = useState("");

  useEffect(() => {
    setTempFirstName(firstName || "");
    setTempLastName(lastName || "");
  }, [firstName, lastName]);

  const handleUpdateClick = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("eventflowUser")) || {};
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          firstName: tempFirstName,
          lastName: tempLastName,
        }),
      });

      if (!response.ok) throw new Error("Failed to update");

      const updated = await response.json();
      const updatedUser = {
        ...user,
        firstName: updated.firstName,
        lastName: updated.lastName,
      };

      localStorage.setItem("eventflowUser", JSON.stringify(updatedUser));
      onProfileUpdate(updated.firstName, updated.lastName);
      setShowProfileModal(false);
    } catch (err) {
      toast.error("❌ Failed to update profile");
    }
  };

  return (
    <div className="absolute top-5 right-5 flex items-center gap-4 z-50">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-full bg-white dark:bg-gray-800 text-purple-600 dark:text-yellow-400 shadow"
      >
        {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
      </button>

      <div className="relative text-center">
        <button
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className="rounded-full border-4 border-white overflow-hidden shadow-md hover:shadow-lg transition"
        >
          <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold uppercase">
            {(firstName || '').charAt(0)}{(lastName || '').charAt(0)}
          </div>
        </button>
        <div className="text-sm mt-1 text-purple-800 dark:text-white font-semibold text-center" style={{ marginTop: '4px' }}>
          {firstName} {lastName}
        </div>
        {profileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <PencilIcon className="w-4 h-4" /> Update Profile
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400"
            >
              <LogOutIcon className="w-4 h-4" /> Logout
            </button>
          </motion.div>
        )}
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-96 shadow-xl"
          >
            <h3 className="text-lg font-bold mb-4 text-purple-700 dark:text-purple-400">Update Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                <input
                  type="text"
                  value={tempFirstName}
                  onChange={(e) => setTempFirstName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-black placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <input
                  type="text"
                  value={tempLastName}
                  onChange={(e) => setTempLastName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-black placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateClick}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
