import { useEffect } from "react";
import { SunIcon, MoonIcon } from "lucide-react";

export default function DarkModeToggle({ darkMode, setDarkMode }) {
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full bg-white dark:bg-gray-800 text-purple-600 dark:text-yellow-400 shadow hover:scale-105 transition"
    >
      {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
    </button>
  );
}
