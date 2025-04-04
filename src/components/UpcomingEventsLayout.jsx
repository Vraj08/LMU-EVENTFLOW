import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { CalendarIcon, ClockIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import DashboardTopbar from "../components/DashboardTopbar";

const UpcomingEventsLayout = ({ backPath = "/", role = "User" }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('${process.env.REACT_APP_BACKEND_URL}/api/events/all');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    const user = JSON.parse(localStorage.getItem("eventflowUser"));
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("eventflowUser");
    toast.success("👋 Logged out successfully!", toastSuccessStyle);
    setTimeout(() => navigate("/"), 1500);
  };

  const handleProfileUpdate = (newFirst, newLast) => {
    setFirstName(newFirst);
    setLastName(newLast);
    toast.success(" Profile updated successfully!", toastSuccessStyle);
  };

  const handleRSVP = async (eventId) => {
    const user = JSON.parse(localStorage.getItem("eventflowUser"));
    const email = user?.email;

    if (!eventId || !email) {
      toast.error("❌ Missing event ID or email. Cannot RSVP.", toastErrorStyle);
      return;
    }

    try {
      const response = await fetch('${process.env.REACT_APP_BACKEND_URL}/api/rsvps', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, email }),
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

  if (loading) {
    return <div className="text-center text-xl p-10 animate-pulse text-indigo-600">Loading events...</div>;
  }

  const handleBackClick = () => {
    // Navigate to the specific dashboard based on the user's role
    const rolePaths = {
      Sodexo: "/sodexo-dashboard",
      ITS: "/its-dashboard",
      Parking: "/parking-dashboard",
      "Event Organization": "/event-organization-dashboard",
      "Facilities Management": "/facilities-management-dashboard",
      "Campus Graphics": "/campus-graphics-dashboard",
      "Campus Safety": "/campus-safety-dashboard",
      Marketing: "/marketing-dashboard",
      Faculty: "/faculty-dashboard"
    };

    // If role exists, navigate to its dashboard, otherwise fallback to generic dashboard
    if (rolePaths[role]) {
      navigate(rolePaths[role]);
    } else {
      navigate("/generic-dashboard");
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <motion.div
        className={`relative p-10 min-h-screen transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-indigo-100 via-pink-100 to-purple-200 text-black"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back Button */}
        <div className="flex justify-between items-start mb-10">
          <div className="w-full">
            <button
              onClick={handleBackClick}
              className="flex items-center text-purple-700 hover:text-purple-900 font-medium mb-4"
            >
               Back to {role} Dashboard
            </button>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-transparent bg-clip-text drop-shadow-3xl text-center w-full mb-2 leading-[1.6] sm:leading-[2]">
              Upcoming Events
            </h1>
          </div>
          <DashboardTopbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            firstName={firstName}
            lastName={lastName}
            onLogout={handleLogout}
            onProfileUpdate={handleProfileUpdate}
          />
        </div>

        {/* Event Cards */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 mt-10 justify-center">
          {events.map((event, idx) => (
            <motion.div
              key={event.eventId}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-3xl shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition duration-300 overflow-hidden"
              >
                <CardContent className="p-6 overflow-visible min-h-[240px]">
                  <h2 className="text-3xl font-extrabold text-purple-700 dark:text-yellow-300 mb-3">{event.title}</h2>
                  <div className="flex items-center text-gray-500 dark:text-gray-300 text-sm mb-1">
                    <CalendarIcon className="w-4 h-4 mr-2" /> {event.date}
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-300 text-sm mb-4">
                    <ClockIcon className="w-4 h-4 mr-2" /> {event.time}
                  </div>
                  <p className="dark:text-white text-gray-700 mb-6 text-md leading-relaxed">
                    {event.description}
                  </p>
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
};

export default UpcomingEventsLayout;
