import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { CalendarIcon, ClockIcon, LogOutIcon, PencilIcon, SunIcon, MoonIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tempFirstName, setTempFirstName] = useState("");
  const [tempLastName, setTempLastName] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  const toastErrorStyle = {
    style: {
      fontSize: "1.1rem",
      padding: "1.3rem",
      background: darkMode ? "#330000" : "#fff0f0",
      color: "#ff4d4d",
      fontWeight: "bold",
      border: "1px solid #ff4d4d",
    },
    iconTheme: {
      primary: "#ff4d4d",
      secondary: "white",
    },
  };

  const toastSuccessStyle = {
    style: {
      fontSize: "1.1rem",
      padding: "1.3rem",
      background: darkMode ? "#333" : "#fefefe",
      color: darkMode ? "#1e90ff" : "#1e3a8a",
      fontWeight: "bold",
      border: darkMode ? "1px solid #1e90ff" : "1px solid #1e3a8a",
    },
    iconTheme: {
      primary: darkMode ? "#1e90ff" : "#1e3a8a",
      secondary: "white",
    },
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("eventflowUser"));
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setTempFirstName(user.firstName);
      setTempLastName(user.lastName);
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events/all");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        toast.error("Failed to load events", toastErrorStyle);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);
  

  const handleRSVP = async (eventId) => {
    const user = JSON.parse(localStorage.getItem("eventflowUser"));
    const email = user?.email;
  
    console.log("🔍 RSVP Data Sent:", { eventId, email });
  
    if (!eventId || !email) {
      toast.error("❌ Missing event ID or email. Cannot RSVP.", toastErrorStyle);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, email })
      });
  
      const data = await response.json();
  
      if (response.status === 201) {
        toast.success("🎉 RSVP confirmed!", toastSuccessStyle);
      } else if (response.status === 409) {
        toast.error("⚠️ You already RSVP'd to this event.", toastErrorStyle);
      } else {
        toast.error(data.message || "❌ Unexpected error occurred.", toastErrorStyle);
      }
    } catch (err) {
      console.error("RSVP failed:", err);
      toast.error("❌ Server error. Try again later.", toastErrorStyle);
    }
  };
  
  
  
  
  const handleLogout = () => {
    localStorage.removeItem("eventflowUser");
    toast.success("👋 Logged out successfully!", toastSuccessStyle);
    setTimeout(() => navigate("/"), 1500);
  };

  const handleProfileUpdate = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("eventflowUser")) || {};
      const response = await fetch("http://localhost:5000/api/update-profile", {
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
      setFirstName(updated.firstName);
      setLastName(updated.lastName);
      setShowProfileModal(false);
      toast.success("Profile updated successfully!", toastSuccessStyle);
    } catch (err) {
      toast.error("❌ Failed to update profile", toastErrorStyle);
    }
  };

  const openProfileModal = () => {
    setTempFirstName(firstName);
    setTempLastName(lastName);
    setShowProfileModal(true);
  };

  if (loading) {
    return <div className="text-center text-xl p-10 animate-pulse text-indigo-600">Loading events...</div>;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div
        className={`relative p-10 min-h-screen transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-200 text-black"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Dark Mode Toggle */}
        {/* Top Bar with Greeting and Right Icons */}
<div className="flex justify-between items-center mb-8">
<div className="text-center w-full mb-1">  {/* Reduced margin-bottom to 4 */}
  <motion.h1
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-pink-600 text-transparent bg-clip-text drop-shadow-lg break-words leading-[1.3] sm:leading-[1.85]"
  >
    {`Good ${new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}, ${firstName}!`}
  </motion.h1>
</div>

  {/* Right: Dark Mode Toggle + Avatar */}
  <div className="flex items-center gap-4 absolute top-5 right-5 z-50 text-center">
    {/* Dark mode toggle */}
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full bg-white dark:bg-gray-800 text-purple-600 dark:text-yellow-400 shadow hover:scale-105 transition"
    >
      {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
    </button>

    {/* Avatar */}
    <div className="relative text-center">
      <button
        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
        className="rounded-full border-4 border-white overflow-hidden shadow-md hover:shadow-lg transition"
      >
        <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold uppercase">
          {firstName.charAt(0)}{lastName.charAt(0)}
        </div>
      </button>
      <div className="text-sm mt-1 text-purple-800 dark:text-white font-semibold">
        {firstName} {lastName}
      </div>
    </div>
  </div>
</div>


        {/* Profile Modal */}
        {showProfileModal && (
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
            onClick={() => setShowProfileModal(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleProfileUpdate}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
          >
            Save
          </button>
        </div>
      </div>
    </motion.div>
  </div>
)}


        {/* User Avatar */}
        <div className="absolute top-5 right-5 z-50 text-center">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="rounded-full border-4 border-white overflow-hidden shadow-md hover:shadow-lg"
          >
            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold uppercase">
              {firstName.charAt(0)}{lastName.charAt(0)}
            </div>
          </button>
          <div className="text-sm mt-1 font-semibold">{firstName} {lastName}</div>
          {profileMenuOpen && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
  >
    <button
      onClick={openProfileModal}
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

        {/* Event Cards */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 mt-20">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-3xl shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition duration-300 overflow-hidden"
              >
                <CardContent className="p-6">
                  <h2 className="text-3xl font-extrabold text-purple-700 dark:text-yellow-300 mb-3">{event.title}</h2>
                  <div className="flex items-center text-gray-500 dark:text-gray-300 text-sm mb-1">
                    <CalendarIcon className="w-4 h-4 mr-2" /> {event.date}
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-300 text-sm mb-4">
                    <ClockIcon className="w-4 h-4 mr-2" /> {event.time}
                  </div>
                  <p className="dark:text-white text-gray-700 mb-6 text-md leading-relaxed">{event.description}</p>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button
                      onClick={() => handleRSVP(event.eventId)}
                      className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110 text-white text-lg py-2 font-semibold rounded-xl shadow"
                    >
                      RSVP Now
                    </Button>
                  </motion.div>
                </CardContent>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
