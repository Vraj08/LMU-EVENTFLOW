// Full homepage with responsive stacking, zoom effect, navbar, center text with animated lines, and full restoration

import React, { useState, useEffect } from "react";
import Button from "./components/ui/Button";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaCalendarCheck,
  FaUserShield,
  FaHandshake,
  FaCogs,
  FaChartLine,
  FaMobileAlt
} from "react-icons/fa";

const developers = [
  { name: "Vraj Patel", role: "Frontend Developer", image: "/assets/vraj.jpg" },
  { name: "Divy Patel", role: "Backend Developer", image: "/assets/divy.jpg" },
  { name: "Jay Panchal", role: "DevOps Engineer", image: "/assets/jay.jpg" },
  { name: "Ayush Prabhakar", role: "Product Owner", image: "/assets/ayush.jpg" },
  { name: "Jinil Patel", role: "UI/UX Designer", image: "/assets/jinil.jpg" }
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
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sectionRef, isInView] = useInView({ triggerOnce: true });
  const animation = useAnimation();

  useEffect(() => {
    if (isInView) animation.start({ opacity: 1, y: 0 });
  }, [isInView]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const themeClasses = darkMode
    ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
    : "bg-gradient-to-br from-indigo-100 to-pink-100 text-black";

  return (
    <div className={`min-h-screen flex flex-col ${themeClasses} transition-colors duration-500`}>
      {/* Navbar */}
      <motion.nav
        className={`flex justify-between items-center px-10 sticky top-0 z-50 shadow-lg backdrop-blur-md bg-white/30 dark:bg-gray-900/50 rounded-b-xl transition-all duration-300 ${isScrolled ? "py-2" : "py-6"}`}
        animate={{ paddingTop: isScrolled ? "0.5rem" : "1.5rem" }}
      >
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-black text-indigo-700 dark:text-white cursor-pointer drop-shadow-sm"
        >
          LMU EventFlow
        </motion.h1>
        <motion.div whileHover={{ scale: 1.1 }}>
          <Button
            className="text-white bg-indigo-600 px-6 py-2 rounded-xl shadow-md hover:shadow-xl hover:shadow-pink-400 dark:hover:shadow-pink-500 transition duration-300"
            onClick={() => setShowLogin(true)}
          >
            Login
          </Button>
        </motion.div>
      </motion.nav>

      {/* Hero Section */}
      <section className="text-center py-10 px-4">
        <h1 className="text-5xl font-extrabold text-indigo-800 dark:text-white mb-6">
          Welcome to LMU EventFlow
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          A centralized platform to create, manage, and coordinate campus events — all in one place.
        </p>
      </section>

      {/* Animated Center Text Section */}
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
            className="text-gray-700 dark:text-gray-300 text-lg mb-4"
          >
            Your one-stop solution for campus event management.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-gray-700 dark:text-gray-300 text-lg mb-4"
          >
            Collaborate with departments, request resources, and track RSVPs with ease.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-gray-700 dark:text-gray-300 text-lg"
          >
            LMU EventFlow turns your ideas into impactful, organized events.
          </motion.p>
        </motion.div>
      </section>

      {/* Platform Highlights */}
      <section className="text-center px-6 py-10">
        <h2 className="text-4xl font-bold text-indigo-800 dark:text-white mb-10">Platform Highlights</h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl hover:shadow-indigo-400 dark:hover:shadow-pink-400 transition-all"
            >
              <div className="text-4xl text-indigo-600 dark:text-pink-400 mb-4">
                <Icon />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Meet Our Developers */}
      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0, y: 50 }}
        animate={animation}
        transition={{ duration: 1, type: "spring", bounce: 0.3 }}
        className="text-center px-6 pb-20"
      >
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-10">Meet Our Developers</h2>
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
