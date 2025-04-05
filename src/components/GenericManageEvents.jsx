// src/pages/ManageEvents.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, PencilIcon, Trash2Icon } from "lucide-react";
import { motion } from "framer-motion";
import UserProfileMenu from "../components/UserProfileMenu";
import UpdateProfileModal from "../components/UpdateProfileModal";
import DarkModeToggle from "../components/DarkModeToggle";
import { useNavigate } from "react-router-dom";
export default function GenericManageEvents({ role = "User" }) {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [tempFirstName, setTempFirstName] = useState("");
    const [tempLastName, setTempLastName] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
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
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);
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
            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error("❌ Failed to update profile");
        }
    };

    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const fetchEvents = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("eventflowUser"));
            const encodedEmail = encodeURIComponent(user.email);
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/events/user/${encodedEmail}`);
            setEvents(res.data.filter(e => e.isApproved));
        } catch {
            toast.error("Failed to fetch events.");
        }
    };

    const handleDelete = async (eventId) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/events/delete/${eventId}`, {
                isActive: false,
                isApproved: false
            });
            toast.success("Event deleted");
            setConfirmDeleteId(null);
            fetchEvents();
        } catch {
            toast.error("Failed to delete event");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className={`min-h-screen px-4 sm:px-6 pt-24 pb-4 transition-colors duration-500 ${darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"
            }`}>

            <Toaster />
            <div className="absolute top-4 right-6 z-50 flex items-center gap-4">

                <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                <UserProfileMenu
                    firstName={firstName}
                    lastName={lastName}
                    onEditClick={() => setShowProfileModal(true)}
                />
            </div>
            <div className="fixed top-4 left-6 z-50">
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
            </div>

            <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-center mb-16 bg-gradient-to-r from-purple-700 to-pink-600 text-transparent bg-clip-text drop-shadow-lg leading-tight sm:leading-[1.2] md:leading-[1.3] lg:leading-[1.4]">
                Manage Your Events
            </h2>
            {events.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                        You have not created any events.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                    Only approved events appear here. Pending edits will show once re-approved.
                    </p>
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
                            className="rounded-[2rem] overflow-hidden shadow-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-400 dark:hover:border-yellow-300 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
                        >
                            <Card className="bg-transparent border-none">
                                <CardContent className="flex flex-col justify-between h-full p-8 space-y-4">
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-yellow-300 mb-1">
                                            {event.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                            {event.description}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            📅 {event.date} &nbsp; 🕒 {event.time}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-6">
                                        <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-base py-3 rounded-xl shadow flex items-center justify-center gap-2"
                                            onClick={() => navigate(`/${role.toLowerCase().replace(/\s+/g, "-")}-dashboard/manage-events/edit-event/${event._id}`)}

                                        >
                                            <PencilIcon className="w-5 h-5" /> <span>Edit</span>
                                        </Button>
                                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-base py-3 rounded-xl shadow flex items-center justify-center gap-2"
                                            onClick={() => setConfirmDeleteId(event._id)}
                                        >
                                            <Trash2Icon className="w-5 h-5" /> <span>Delete</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {confirmDeleteId === event._id && (
                                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-sm w-full text-center"
                                    >
                                        <h4 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">
                                            Are you sure you want to delete this event?
                                        </h4>
                                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                                            <button
                                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
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
            {showProfileModal && (
                <UpdateProfileModal
                    tempFirstName={tempFirstName}
                    tempLastName={tempLastName}
                    setTempFirstName={setTempFirstName}
                    setTempLastName={setTempLastName}
                    onCancel={() => setShowProfileModal(false)}
                    onSave={handleProfileUpdate}
                />
            )}

        </div>
    );
}
