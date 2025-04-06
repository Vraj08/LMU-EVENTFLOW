import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-scroll";
import { useAuth } from "../context/AuthContext";

import {
  FaCalendarCheck,
  FaUserShield,
  FaHandshake,
  FaCogs,
  FaChartLine,
  FaMobileAlt,
  FaMoon,
  FaSun
} from "react-icons/fa";

const developers = [
  { name: "Vraj Patel", role: "Frontend Developer", image: "/assets/vraj.jpg" },
  { name: "Divy Patel", role: "Backend Developer", image: "/assets/divy.jpg" },
  { name: "Jinil Patel", role: "UI/UX Designer", image: "/assets/jinil.jpg" },
  { name: "Ayush Prabhakar", role: "Product Owner", image: "/assets/ayush.jpg" },
  { name: "Jay Panchal", role: "DevOps Engineer", image: "/assets/jay.jpg" }
];



const features = [
  { icon: FaCalendarCheck, title: "Event Scheduling", desc: "Book rooms, manage timelines, and sync with campus calendars." },
  { icon: FaUserShield, title: "Role-Based Access", desc: "Permissions for students, faculty, and supervisors." },
  { icon: FaHandshake, title: "Unified Requests", desc: "Request resources from facilities, ITS, and Sodexo." },
  { icon: FaCogs, title: "Automation", desc: "Streamlined workflows and notifications." },
  { icon: FaChartLine, title: "Analytics Dashboard", desc: "Visualize RSVPs, requests, and participation." },
  { icon: FaMobileAlt, title: "Responsive Design", desc: "Optimized for mobile, tablet, and desktop." }
];

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const { login } = useAuth(); // ⬅️ gets login function from AuthContext
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sectionRef, isInView] = useInView({ triggerOnce: true });
  const animation = useAnimation();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const dashboardRoutes = {
    Student: "/student-dashboard",
    Admin: "/admin-dashboard",
    Faculty: "/faculty-dashboard",
    Sodexo: "/sodexo-dashboard",
    ITS: "/its-dashboard",
    Parking: "/parking-dashboard",
    "Event Organization": "/event-organization-dashboard",
    "Facilities Management": "/facilities-management-dashboard",
    "Campus Graphics": "/campus-graphics-dashboard",
    "Campus Safety": "/campus-safety-dashboard",
    Marketing: "/marketing-dashboard"
  };
  
  const toTitleCase = (str = "") =>
    str
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  
  const redirectToDashboard = (userType) => {
    const normalized = toTitleCase(userType);
    const route = dashboardRoutes[normalized];
  
    if (route) {
      window.location.href = route;
    } else {
      window.location.href = "/unauthorized";
    }
  };
  

  useEffect(() => {
    if (isInView) animation.start({ opacity: 1, y: 0 });
  }, [isInView, animation]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toastErrorStyle = {
    style: {
      fontSize: "1.2rem",
      padding: "1.5rem",
      background: darkMode ? "#330000" : "#fff0f0",
      color: "#ff4d4d",
      fontWeight: "bold",
      border: "1px solid #ff4d4d"
    },
    iconTheme: {
      primary: "#ff4d4d",
      secondary: "white"
    }
  };

  const toastSuccessStyle = {
    style: {
      fontSize: "1.2rem",
      padding: "1.5rem",
      background: darkMode ? "#333" : "#fefefe",
      color: darkMode ? "#1e90ff" : "#1e3a8a",
      fontWeight: "bold",
      border: darkMode ? "1px solid #1e90ff" : "1px solid #1e3a8a"
    },
    iconTheme: {
      primary: darkMode ? "#1e90ff" : "#1e3a8a",
      secondary: "white"
    }
  };

  const handleSendOTP = async () => {
    if (otpSent || resendTimer > 0) return;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(lion\.)?lmu\.edu$/;
    if (!emailRegex.test(email)) {
      toast.error("Only @lmu.edu or @lion.lmu.edu emails allowed.", toastErrorStyle);
      return;
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString();

    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode, time: expiryTime }),
      });
      
      toast.success("OTP sent to your email", toastSuccessStyle);
      setOtpSent(true);
      setResendTimer(60);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP. Please try again.", toastErrorStyle);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp !== generatedOtp) {
      toast.error("Incorrect OTP", toastErrorStyle);
      return;
    }

    toast.success("Email verified! Checking access...", toastSuccessStyle);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })  // Only send email initially
      });

      if (response.status === 404) {
        // New user, show name form
        setShowNameModal(true);
      } else {
        const data = await response.json();

        login({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.userType
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        });

        console.log("📦 Stored user:", JSON.parse(localStorage.getItem("user")));
        setShowLogin(false);
        redirectToDashboard(data.userType);

      }
    } catch (error) {
      toast.error("Backend error. Try again later.", toastErrorStyle);
      console.error(error);
    }
  };


  const handleNameSubmit = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName })
      });

      const data = await response.json();
      login({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.userType
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      });

      setShowNameModal(false);
      setShowLogin(false);
      redirectToDashboard(data.userType);

    } catch (error) {
      toast.error("Failed to save user info", toastErrorStyle);
      console.error(error);
    }
  };

  const themeClasses = darkMode
    ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
    : "bg-gradient-to-br from-indigo-100 to-pink-100 text-black";

  const headingColor = darkMode ? "text-yellow-400" : "text-indigo-800";

  return (
    <div className={`min-h-screen flex flex-col ${themeClasses} transition-colors duration-500`}>
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{ zIndex: 99999 }}  // ensures toast stays on top
        toastOptions={{
          style: {
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
            background: "#fff0f0",
            color: "#cc0000",
            border: "1px solid #cc0000",
            fontWeight: "bold",
            fontSize: "1.1rem",
          },
          success: {
            style: {
              background: "#f0fff0",
              color: "#006400",
              border: "1px solid #006400",
            },
          },
          error: {
            style: {
              background: "#fff0f0",
              color: "#cc0000",
              border: "1px solid #cc0000",
            },
          },
        }}
      />


      <motion.nav
        className={`flex justify-between items-center px-6 py-4 sticky top-0 z-50 shadow-lg backdrop-blur-md bg-white/30 dark:bg-gray-900/50 rounded-b-xl transition-all duration-300`}
        animate={{ paddingTop: isScrolled ? "0.5rem" : "1.5rem" }}
      >
        <h1 className={`text-2xl font-bold cursor-pointer drop-shadow-sm ${headingColor}`}>LMU EventFlow</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-white/40 dark:bg-gray-700"
          >
            {darkMode ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-indigo-700" />}
          </button>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:shadow-xl hover:shadow-pink-400 dark:hover:shadow-yellow-500 transition"
          >
            Login
          </button>
        </div>
      </motion.nav>

      <AnimatePresence mode="wait">
        {showLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-[9999] flex justify-center items-center">
            <motion.div
              key="login-popup"
              initial={{ scale: 0.8, y: -30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -30 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-2xl shadow-xl relative transition-all duration-300"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowLogin(false)} // Close the modal when clicked
                className="absolute right-4 top-2 text-2xl text-gray-700 dark:text-white hover:text-red-500"
              >
                &times;
              </button>

              {/* Modal Title */}
              <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600 dark:text-yellow-400">
                Login with LMU Email
              </h2>

              {/* Email Input */}
              <input
                type="email"
                placeholder="Enter your @lmu.edu or @lion.lmu.edu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-lg border mb-6 dark:bg-gray-900 dark:border-gray-600 text-black dark:text-white"
              />

              {/* OTP Section */}
              {otpSent ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-4 rounded-lg border mb-6 dark:bg-gray-900 dark:border-gray-600 text-black dark:text-white"
                  />
                  <button
                    onClick={handleVerifyOTP}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg"
                  >
                    Verify OTP
                  </button>
                </>
              ) : resendTimer > 0 ? (
                <button disabled className="w-full bg-gray-400 text-white py-4 rounded-lg">
                  Resend in {resendTimer}s
                </button>
              ) : (
                <button
                  onClick={handleSendOTP}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg"
                >
                  Send OTP
                </button>
              )}
              {showNameModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-[9999] flex justify-center items-center">
                  <motion.div
                    key="name-popup"
                    initial={{ scale: 0.8, y: -30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: -30 }}
                    className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-2xl shadow-xl relative transition-all duration-300"
                  >
                    <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600 dark:text-yellow-400">Complete Your Profile</h2>

                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-4 rounded-lg border mb-4 dark:bg-gray-900 dark:border-gray-600 text-black dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-4 rounded-lg border mb-6 dark:bg-gray-900 dark:border-gray-600 text-black dark:text-white"
                    />
                    <button
                      onClick={handleNameSubmit}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg"
                    >
                      Submit
                    </button>
                  </motion.div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="text-center py-10 px-4">
        <h1 className={`text-5xl font-extrabold mb-6 ${headingColor}`}>Welcome to LMU EventFlow</h1>
        <p className="text-lg text-black-700 dark:text-white-300 max-w-3xl mx-auto">
          <span>
            A centralized platform to create, manage, and coordinate campus events — all in one place.
          </span>
        </p>
      </section>

      {/* Info Section */}
      <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 max-w-3xl"
        >
          <motion.p
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg mb-4 text-gray-700 dark:text-gray-300"
          >
            Your one-stop solution for campus event management.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg mb-4 text-gray-700 dark:text-gray-300"
          >
            Collaborate with departments, request resources, and track RSVPs with ease.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-gray-700 dark:text-gray-300"
          >
            LMU EventFlow turns your ideas into impactful, organized events.
          </motion.p>
        </motion.div>
      </section>

      {/* Highlights Section */}
      <section id="highlights" className="text-center px-6 py-10">
        <h2 className={`text-4xl font-bold mb-10 ${headingColor}`}>Platform Highlights</h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl hover:shadow-indigo-400 dark:hover:shadow-yellow-400 transition-all"
            >
              {/* Icon and Title in Same Line */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-4xl text-indigo-600 dark:text-yellow-400">
                  <Icon />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Developers Section */}
      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0, y: 50 }}
        animate={animation}
        transition={{ duration: 1, type: "spring", bounce: 0.3 }}
        className="text-center px-6 pb-20"
      >
        <h2 className={`text-4xl font-bold mb-10 ${headingColor}`}>Meet Our Developers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {developers.map((dev, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative group rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div
                className="h-[360px] w-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: dev.image ? `url(${dev.image})` : undefined }}
              ></div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-5 py-3 rounded-2xl group-hover:opacity-0 transition duration-300">
                <h3 className="text-lg font-semibold leading-tight text-center">{dev.name}</h3>
                <p className="text-xs text-center">{dev.role}</p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileHover={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center p-6"
              >
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6 rounded-2xl w-[85%] shadow-lg text-left opacity-0 group-hover:opacity-100 transition duration-300">
                  <h3 className="text-xl font-bold mb-1">{dev.name}</h3>
                  <p className="text-sm mb-2">{dev.role}</p>
                  <p className="text-xs">
                    {`${dev.name.split(" ")[0]} is part of the LMU EventFlow team helping transform how events are managed and coordinated across campus.`}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
