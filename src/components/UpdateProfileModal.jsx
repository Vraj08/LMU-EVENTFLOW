import { motion } from "framer-motion";

export default function UpdateProfileModal({
  tempFirstName,
  tempLastName,
  setTempFirstName,
  setTempLastName,
  onCancel,
  onSave
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-96 shadow-xl"
      >
        <h3 className="text-lg font-bold mb-4 text-purple-700 dark:text-purple-400">
          Update Profile
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">First Name</label>
            <input
              type="text"
              value={tempFirstName}
              onChange={(e) => setTempFirstName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white text-black placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              placeholder="First Name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
            <input
              type="text"
              value={tempLastName}
              onChange={(e) => setTempLastName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white text-black placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              placeholder="Last Name"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
