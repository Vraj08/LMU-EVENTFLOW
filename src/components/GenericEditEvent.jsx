import { useState, useEffect, useRef } from "react";  // Add useEffect here
import axios from "axios";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/Button";
import { toast, Toaster } from "react-hot-toast";
import { Card, CardContent } from "../components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";
import { Switch } from "../components/ui/switch";
import { CalendarIcon, ClockIcon, LogOutIcon, PencilIcon, SunIcon, MoonIcon, ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";



const inputHoverClass = "transition duration-300 ease-in-out focus:ring-2 focus:ring-green-500 focus:outline-none hover:ring-2 hover:ring-green-500 hover:shadow-md focus:border-green-500 border border-transparent focus:shadow-[0_0_10px_2px_rgba(255,165,0,0.4)]";

export default function GenericEditEvent({ role = "User" }) {

  const [form, setForm] = useState({ title: "", description: "", date: "", time: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [interactive, setInteractive] = useState(true);  // 3D Interaction toggle
  const [previewOnly, setPreviewOnly] = useState(true);  // Live preview toggle
  const cardRef = useRef(null);
  const { id: eventId } = useParams();
  const [originalData, setOriginalData] = useState({});
  const lightRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tempFirstName, setTempFirstName] = useState("");
  const [tempLastName, setTempLastName] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const rolePaths = {
    Sodexo: "/sodexo-dashboard",
    ITS: "/its-dashboard",
    Parking: "/parking-dashboard",
    "Event Organization": "/event-organization-dashboard",
    "Facilities Management": "/facilities-management-dashboard",
    "Campus Graphics": "/campus-graphics-dashboard",
    "Campus Safety": "/campus-safety-dashboard",
    Marketing: "/marketing-dashboard",
    Faculty: "/faculty-dashboard",
    Admin:"/admin-dashboard"
};

  const navigate = useNavigate();
  const handleMouseMove = (e) => {
    if (!interactive) return;
    const card = cardRef.current;
    const light = lightRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / 15);
    const rotateY = (x - centerX) / 15;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.boxShadow = `${-rotateY * 3}px ${rotateX * 3}px 60px rgba(0, 123, 255, 0.6), 0 0 50px rgba(0, 123, 255, 0.9), inset 0 0 25px rgba(0, 123, 255, 0.4)`;
    if (light) {
      light.style.transition = "background 0.15s ease";
      light.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.7), transparent 80%)`;
    }
  };
  const [successAnimation, setSuccessAnimation] = useState(null);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/events/${eventId}`);
        const data = res.data;

        setForm({
          title: data.title,
          description: data.description,
          date: data.date?.slice(0, 10), // formats '2025-04-12T00:00:00.000Z' to '2025-04-12'
          time: data.time?.slice(0, 5)   // formats '14:30:00' to '14:30'
        });


        setOriginalData({
          title: data.title,
          description: data.description,
          date: data.date,
          time: data.time,
        });
      } catch {
        toast.error("Failed to load event");
      }
    };

    fetchEvent();
  }, [eventId]);


  useEffect(() => {
    fetch("https://assets10.lottiefiles.com/packages/lf20_jbrw3hcz.json")
      .then(res => res.json())
      .then(data => setSuccessAnimation(data))
      .catch(err => console.error("Failed to load animation:", err));
  }, []);
  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      card.style.boxShadow = "0px 10px 25px rgba(0, 0, 0, 0.1)";
    }
    if (lightRef.current) {
      lightRef.current.style.background = "none";
    }
  };
  const openProfileModal = () => {
    setTempFirstName(firstName);
    setTempLastName(lastName);
    setShowProfileModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
  const validateForm = async () => {
    let tempErrors = {};
    let messages = [];

    if (!form.title.trim()) {
      tempErrors.title = "Title is required";
      messages.push("Title is required");
    } else if (form.title.length < 5) {
      tempErrors.title = "Title must be at least 5 characters";
      messages.push("Title must be at least 5 characters");
    }

    if (!form.description.trim()) {
      tempErrors.description = "Description is required";
      messages.push("Description is required");
    } else if (form.description.length < 10) {
      tempErrors.description = "Description must be at least 10 characters";
      messages.push("Description must be at least 10 characters");
    }

    if (!form.date) {
      tempErrors.date = "Date is required";
      messages.push("Date is required");
    } else {
      const selectedDate = new Date(`${form.date}T00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        tempErrors.date = "Please select a future date";
        messages.push("Please select a future date");
      }
    }

    if (!form.time) {
      tempErrors.time = "Time is required";
      messages.push("Time is required");
    } else {
      const selectedDateTime = new Date(`${form.date}T${form.time}`);
      const now = new Date();
      if (selectedDateTime <= now) {
        tempErrors.time = "Please select a future time";
        messages.push("Please select a future time");
      }
    }

    setErrors(tempErrors);

    messages.forEach((msg, i) => {
      setTimeout(() => toast.error(msg, toastErrorStyle), i * 500);
    });

    return Object.keys(tempErrors).length === 0;
  };

  const handleRSVPPreview = () => {
    toast.success("This will RSVP to the event when live.", toastSuccessStyle);
  };

  const toastErrorStyle = {
    style: {
      fontSize: "1.1rem",
      padding: "1.2rem",
      background: "#fff0f0",
      color: "#cc0000",
      fontWeight: "bold",
      border: "1px solid #cc0000"
    },
    iconTheme: {
      primary: "#cc0000",
      secondary: "white"
    }
  };

  const toastSuccessStyle = {
    style: {
      fontSize: "1.1rem",
      padding: "1.2rem",
      background: "#f0fff0",
      color: "#006400",
      fontWeight: "bold",
      border: "1px solid #006400"
    },
    iconTheme: {
      primary: "#006400",
      secondary: "white"
    }
  };
  const handleProfileUpdate = async () => {
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
      setFirstName(updated.firstName);
      setLastName(updated.lastName);
      setShowProfileModal(false);
      toast.success("Profile updated successfully!", toastSuccessStyle);
    } catch (err) {
      toast.error("❌ Failed to update profile", toastErrorStyle);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("eventflowUser");
    toast.success("👋 Logged out successfully!", toastSuccessStyle);
    setTimeout(() => navigate("/"), 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.title === originalData.title &&
      form.description === originalData.description &&
      form.date === originalData.date &&
      form.time === originalData.time
    ) {
      toast("No changes made", { icon: "⚠️" });
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/events/${eventId}`, {
        ...form,
      });

      // 🎉 Confetti animation
      confetti({ particleCount: 60, spread: 45, origin: { y: 0.6 } });
      setTimeout(() => confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } }), 300);
      setTimeout(() => confetti({ particleCount: 120, spread: 90, origin: { y: 0.4 } }), 600);

      toast.success("🎉 Event updated successfully!", toastSuccessStyle);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update event", toastErrorStyle);
    }
  };


  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <motion.div
        className={`relative flex flex-col justify-center items-center min-h-screen px-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-sky-100 via-rose-100 to-fuchsia-200"}`}
        style={{ animation: "gradientShift 10s ease-in-out infinite" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
       <button
                    onClick={() => {
                        if (rolePaths[role]) {
                            navigate(rolePaths[role]);
                        } else {
                            navigate("/generic-dashboard");
                        }
                    }}
                    className="absolute top-5 left-5 flex items-center text-purple-700 hover:text-purple-900 font-medium z-60 whitespace-nowrap"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    {`Back to ${role} Dashboard`}
                </button>


        <div className="absolute top-5 right-5 z-50 flex items-center gap-5">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-white dark:bg-gray-800 text-purple-600 dark:text-yellow-400 shadow hover:scale-105 transition"
          >
            {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>


          {/* Avatar and Profile Menu */}
          <div className="relative text-center">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="rounded-full border-4 border-white overflow-hidden shadow-md hover:shadow-lg transition"
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
        </div>
        {showProfileModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <motion.div
              className={`relative bg-white dark:bg-gray-900 text-black dark:text-white w-full max-w-md mx-auto p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold mb-4 text-purple-700 dark:text-purple-400 text-center">
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


        {/* Responsive Toggle Buttons Section */}
        <div className="w-full max-w-5xl px-6 mt-20 sm:mt-20 mb-6 flex flex-col sm:flex-row gap-4 sm:gap-12">
          <div className="flex items-center gap-2">
            <Switch id="toggle3d" checked={interactive} onCheckedChange={setInteractive} />
            <label htmlFor="toggle3d" className="text-sm font-medium">
              Enable 3D Interaction
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="togglePreview" checked={previewOnly} onCheckedChange={setPreviewOnly} />
            <label htmlFor="togglePreview" className="text-sm font-medium">
              Live preview of how it will look when live
            </label>
          </div>
        </div>


        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl px-4 flex-wrap items-center justify-center">
          {/* Form Section with responsive sizing */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative transition-transform duration-300 ease-out w-full lg:max-w-xl rounded-3xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 80 }}
          >
            <div
              ref={lightRef}
              className="absolute top-0 left-0 w-full h-full rounded-3xl pointer-events-none z-0 transition-all duration-300"
            ></div>

            <Card className="relative z-10 p-6 rounded-[2rem] shadow-2xl bg-gradient-to-br from-sky-100 via-rose-100 to-fuchsia-200 dark:from-zinc-800 dark:to-zinc-900 animated-border">
              <CardContent>
                <motion.h2
                  className="text-3xl font-bold text-center mb-6 text-indigo-800 dark:text-white"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Update Your Event
                </motion.h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input type="text" name="title" placeholder="Event Title" value={form.title} onChange={handleChange} className={`text-base ${inputHoverClass}`} />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}

                  <Textarea name="description" placeholder="Event Description" value={form.description} onChange={handleChange} className={`text-base ${inputHoverClass}`} />
                  {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}

                  <Input type="date" name="date" value={form.date} onChange={handleChange} className={`text-base ${inputHoverClass}`} />
                  {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}

                  <Input type="time" name="time" value={form.time} onChange={handleChange} className={`text-base ${inputHoverClass}`} />
                  {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time}</p>}

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      className="w-full text-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white shadow-lg transition duration-300 border-2 border-transparent hover:border-pink-400 hover:shadow-[0_0_14px_4px_rgba(0,123,255,0.6)] hover:animate-pulse focus:ring-2 focus:ring-orange-400 focus:shadow-[0_0_10px_2px_rgba(255,165,0,0.4)]"
                    >
                      Update Event
                    </Button>
                  </motion.div>
                </form>

                <AnimatePresence>
                  {submitted && successAnimation && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="flex flex-col items-center mt-4"
                    >
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Preview Section - responsive */}
          {previewOnly && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-full sm:max-w-md"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-3xl shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition duration-300 overflow-hidden"
              >
                <CardContent className="p-6">
                  <h2 className="text-3xl font-extrabold text-purple-700 dark:text-yellow-300 mb-3 break-words">{form.title || "Live Preview: Event Title"}</h2>
                  <div className="flex items-center text-gray-500 dark:text-gray-300 text-sm mb-1">
                    <CalendarIcon className="w-4 h-4 mr-2" /> {form.date || "Event Date"}
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-300 text-sm mb-4">
                    <ClockIcon className="w-4 h-4 mr-2" /> {form.time || "Event Time"}
                  </div>
                  <p className="dark:text-white text-gray-700 mb-6 text-md leading-relaxed break-words">{form.description || "Event description will appear here as you type..."}</p>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button
                      onClick={handleRSVPPreview}
                      className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110 text-white text-lg py-2 font-semibold rounded-xl shadow"
                    >
                      RSVP Now
                    </Button>
                  </motion.div>
                </CardContent>
              </motion.div>
            </motion.div>
          )}
        </div>


        <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
             50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes neonBorder {
            0% { border-color: #00ffff; box-shadow: 0 0 15px #00ffff; }
            25% { border-color: #0080ff; box-shadow: 0 0 15px #0080ff; }
            50% { border-color: #8000ff; box-shadow: 0 0 15px #8000ff; }
            75% { border-color: #ff0080; box-shadow: 0 0 15px #ff0080; }
            100% { border-color: #00ffff; box-shadow: 0 0 15px #00ffff; }
          }

          .animated-border {
            border: 2px solid;
            animation: neonBorder 6s linear infinite;
          }
        `}</style>
      </motion.div>
    </>
  );
}
