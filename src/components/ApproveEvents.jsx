import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";
import UserProfileMenu from "../components/UserProfileMenu";
import UpdateProfileModal from "../components/UpdateProfileModal";

export default function ApproveEvents({ role = "Admin" }) {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [events, setEvents] = useState([]);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const rolePaths = {
        Admin: "/admin-dashboard"
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

    // Fetch events
    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/events/pending`);
            setEvents(res.data);
        } catch {
            toast.error("Failed to fetch events.", toastErrorStyle);
        }
    };

    // Approve event
    const handleApprove = async (eventId) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/events/approve/${eventId}`, { isApproved: true });
            toast.success("Event approved!", toastSuccessStyle);
            fetchEvents();
        } catch {
            toast.error("❌ Failed to approve event", toastErrorStyle);
        }
    };

    // Delete event
    const handleDelete = async (eventId) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/events/delete/${eventId}`, {
                isActive: false,
                isApproved: false
            });
            toast.success("🗑️ Event deleted", toastSuccessStyle);
            setConfirmDeleteId(null);
            fetchEvents();
        } catch {
            toast.error("Failed to delete event", toastErrorStyle);
        }
    };

    // Dark mode toggle effect
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
        }

        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    // Fetch events on page load
    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className={`min-h-screen px-4 sm:px-6 pt-24 pb-4 transition-colors duration-500 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"}`}>
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
            
            
            {/* Dark Mode and Profile Menu */}
            <div className="absolute top-4 right-6 z-50 flex items-center gap-4">
                <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                <UserProfileMenu
                    firstName={firstName}
                    lastName={lastName}
                    onEditClick={() => setShowProfileModal(true)}
                />
            </div>

            {/* Back to Admin Dashboard button */}
            <div className="fixed top-4 left-6 z-50">
                <button
                    onClick={() => navigate(rolePaths[role] || "/")}
                    className="flex items-center text-purple-700 hover:text-purple-900 font-medium"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Admin Dashboard
                </button>
            </div>

            {/* Main Title */}
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-center mb-16 bg-gradient-to-r from-purple-700 to-pink-600 text-transparent bg-clip-text drop-shadow-lg leading-tight sm:leading-[1.2] md:leading-[1.3] lg:leading-[1.4]">
                Approve Events
            </h2>

            {/* No Events Message */}
            {events.length === 0 ? (
                <div className="text-center py-16 text-2xl text-gray-600">
                    🎉 No Event Approval Requests as of now
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-2 sm:px-0">
                    {events.map(event => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="rounded-[2rem] overflow-hidden shadow-2xl border border-gray-300 bg-white hover:border-purple-400 transition-all duration-300"
                        >
                            <Card className="bg-transparent border-none">
                                <CardContent className="flex flex-col justify-between h-full p-8 space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-purple-700 mb-1">{event.title}</h3>
                                        <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                                        <p className="text-xs text-gray-500">
                                            📅 {event.date} &nbsp; 🕒 {event.time}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-4 pt-6">
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700 text-white text-base py-3 rounded-xl shadow"
                                            onClick={() => handleApprove(event._id)}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            className="w-full bg-red-600 hover:bg-red-700 text-white text-base py-3 rounded-xl shadow"
                                            onClick={() => setConfirmDeleteId(event._id)}
                                        >
                                            🗑️ Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Delete Confirmation */}
                            {confirmDeleteId === event._id && (
                                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center"
                                    >
                                        <h4 className="text-lg font-semibold mb-4 text-red-600">
                                            Are you sure you want to delete this event?
                                        </h4>
                                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                                            <button
                                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                                onClick={() => setConfirmDeleteId(null)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                onClick={() => handleDelete(event._id)}
                                            >
                                                Yes, Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Profile Modal */}
            {showProfileModal && (
                <UpdateProfileModal
                    tempFirstName={firstName}
                    tempLastName={lastName}
                    setTempFirstName={setFirstName}
                    setTempLastName={setLastName}
                    onCancel={() => setShowProfileModal(false)}
                    onSave={() => {/* Add logic to handle profile update */}}
                />
            )}
        </div>
    );
}
