import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Tilt from 'react-parallax-tilt';
import {
  CalendarDays, PlusSquare, Boxes, Sliders,
  School, MessageCircle
} from "lucide-react";

import toast, { Toaster } from "react-hot-toast";
import DashboardTopbar from "./DashboardTopbar";

function GenericDashboard({ basePath = "/generic", roleName = "User" }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
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
    localStorage.removeItem("user");
    toast.success("👋 Logged out successfully!", toastSuccessStyle);
    setTimeout(() => navigate("/"), 1500);
  };

  const handleProfileUpdate = async (newFirst, newLast) => {
    toast.remove();
    const user = JSON.parse(localStorage.getItem("user")) || {};

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          firstName: newFirst,
          lastName: newLast,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.firstName || !data?.lastName) {
        return toast.error("❌ " + (data?.message || "Profile update failed"), toastErrorStyle);
      }

      const updatedUser = {
        ...user,
        firstName: data.firstName,
        lastName: data.lastName,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setFirstName(data.firstName);
      setLastName(data.lastName);
      return toast.success(" Profile updated successfully!", toastSuccessStyle);
    } catch (err) {
      return toast.error("❌ " + (err.message || "Something went wrong"), toastErrorStyle);
    }
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  const cardData = [
    {
      title: "View Upcoming Events",
      description: "See all your scheduled and approved events.",
      icon: <CalendarDays className="w-8 h-8 text-purple-500 dark:text-blue-300" />,
      onClick: () => navigate(`${basePath}/upcoming-events`),
    },
    {
      title: "Create New Event",
      description: "Submit a request to organize a new event.",
      icon: <PlusSquare className="w-8 h-8 text-purple-500 dark:text-blue-300" />,
      onClick: () => navigate(`${basePath}-dashboard/create-event`),
    },
    {
      title: "Request Items for Event",
      description: "Ask for chairs, mics, tables, or tech support.",
      icon: <Boxes className="w-8 h-8 text-purple-500 dark:text-blue-300" />,
      onClick: () => navigate(`${basePath}-dashboard/request-items`),
    },
    {
      title: "Manage Events",
      description: "Edit, cancel or update your existing events.",
      icon: <Sliders className="w-8 h-8 text-purple-500 dark:text-blue-300" />,
      onClick: () => navigate(`${basePath}-dashboard/manage-events`),
    },
    {
      title: "Book Classrooms",
      description: "Reserve available rooms for your upcoming events.",
      icon: <School className="w-8 h-8 text-purple-500 dark:text-blue-300" />,
      onClick: () => navigate(`${basePath}-dashboard/book-classroom`),
    },
    {
      title: "View Messages",
      description: "Check your chat messages with departments.",
      icon: <MessageCircle className="w-8 h-8 text-purple-500 dark:text-blue-300" />,
      onClick: () => navigate(`${basePath}-dashboard/messages`)
    }
  ];

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <motion.div
        className={`relative p-10 min-h-screen transition-colors duration-500 ${darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-100 via-pink-100 to-purple-200 text-black"
          }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      ><div className="mb-16">
          <DashboardTopbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            firstName={firstName}
            lastName={lastName}
            onLogout={handleLogout}
            onProfileUpdate={handleProfileUpdate}
          />
        </div>
        <div className="text-center w-full mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-pink-600 text-transparent bg-clip-text drop-shadow-lg break-words leading-[1.3] sm:leading-[1.85]"
          >
            {greeting}, {firstName}!
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl mt-16 mx-auto justify-items-center">
          {cardData.map((card, idx) => (
            <Tilt options={{ max: 15, scale: 1.05, speed: 500 }} key={idx} className="w-full">
              <motion.div
                onClick={card.onClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 14, delay: idx * 0.2 }}
                className="group relative cursor-pointer transform p-10 h-72 flex flex-col justify-center rounded-3xl shadow-2xl transition duration-500 border-2 border-purple-300 dark:border-blue-400 bg-gradient-to-br from-white/90 to-purple-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-blue-400 overflow-hidden"
              >
                <motion.div className="mb-4">{card.icon}</motion.div>
                <h2 className="text-3xl font-bold mb-2 text-purple-700 dark:text-blue-300 drop-shadow">{card.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{card.description}</p>
                <div className='absolute inset-0 rounded-3xl opacity-0 group-active:opacity-30 bg-blue-300/20 transition duration-300 pointer-events-none'></div>
                <span className='absolute inset-0 rounded-3xl border border-blue-300 opacity-0 group-hover:opacity-100 animate-pulse transition duration-300 pointer-events-none'></span>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </motion.div>
    </>
  );
}

export default GenericDashboard;
