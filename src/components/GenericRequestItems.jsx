import { motion } from "framer-motion";
import {
    CalendarDays,
    UtensilsCrossed,
    Laptop2,
    ParkingCircle,
    ClipboardList,
    Wrench,
    Image,
    ShieldCheck,
    Megaphone,
    SunIcon,
    MoonIcon,
    ArrowLeft,
    LogOutIcon
} from "lucide-react";
import Tilt from 'react-parallax-tilt';
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"; // Add this at the top
export default function GenericRequestItems({ role = "User" }) {
    const navigate = useNavigate(); // Add this inside component
    const [canNavigate, setCanNavigate] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    });
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [tempFirstName, setTempFirstName] = useState("");
    const [tempLastName, setTempLastName] = useState("");
    const user = JSON.parse(localStorage.getItem("user")) || {};
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
        Admin: "/admin-dashboard"
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
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
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);


    useEffect(() => {
        setCanNavigate(typeof navigate === 'function');

        // ✅ Clear department after it's been used
        const defaultDept = localStorage.getItem("chatDepartment");
        if (defaultDept) {
            localStorage.removeItem("chatDepartment");
        }
    }, [navigate]);
    const cardGradients = [
        "from-red-500 via-rose-500 to-orange-500",          // Sodexo – Red/Rose
        "from-yellow-400 via-amber-400 to-lime-400",        // ITS – Yellow/Lime
        "from-green-500 via-emerald-500 to-teal-400",       // Parking – Green/Teal
        "from-cyan-500 via-sky-500 to-blue-500",            // Event Org – Cyan/Blue
        "from-indigo-600 via-violet-500 to-purple-500",     // Facilities – Indigo/Violet
        "from-pink-500 via-fuchsia-500 to-rose-400",        // Graphics – Pink/Fuchsia
        "from-orange-500 via-amber-500 to-yellow-500",      // Campus Safety – Orange/Gold
        "from-zinc-600 via-neutral-500 to-gray-400"         // Marketing – Gray/Metallic
      ];
      
      
      const glowColors = [
        "#ef4444", // Sodexo – Red
        "#eab308", // ITS – Yellow
        "#10b981", // Parking – Green
        "#0ea5e9", // Event Org – Cyan
        "#8b5cf6", // Facilities – Violet
        "#ec4899", // Graphics – Pink
        "#f97316", // Campus Safety – Orange
        "#a3a3a3"  // Marketing – Gray
      ];
      
      
    const iconComponents = [
        UtensilsCrossed,
        Laptop2,
        ParkingCircle,
        ClipboardList,
        Wrench,
        Image,
        ShieldCheck,
        Megaphone
    ];

    const requestOptions = [
        "Sodexo",
        "ITS",
        "Parking",
        "Event Organization",
        "Facilities Management",
        "Campus Graphics",
        "Campus Safety",
        "Marketing"
    ];

    const descriptions = [
        "Food & Catering Services",
        "Tech Support & Equipment",
        "Validate Parking Tickets",
        "Chairs, Tables & Amenities",
        "Campus maintenance, setup, and logistics",
        "Poster & Banner Printing Services",
        "Security support & crowd control",
        "Promote your event with campus outreach"
    ];

    const paths = requestOptions.map(name =>
        `/faculty/request-items/${name.toLowerCase().replace(/\s+/g, '-')}`
    );

    return (
        <div className={`min-h-screen px-6 pt-32 pb-16 font-sans transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 text-black"}`}>
            <Toaster position="top-center" reverseOrder={false} />
            <button
                onClick={() => navigate(rolePaths[role] || "/generic-dashboard")}
                className="absolute top-5 left-5 flex items-center text-purple-700 hover:text-purple-900 font-medium z-60"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> {`Back to ${role} Dashboard`}
            </button>

            <div className="max-w-6xl mx-auto">
                <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 text-purple-600 dark:text-yellow-400 shadow"
                    >
                        {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                    </button>

                    <div className="relative text-center">
                        <button
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            className="rounded-full border-4 border-white overflow-hidden shadow-md hover:shadow-lg transition"
                        >
                            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold uppercase">
                                {firstName.charAt(0)}{lastName.charAt(0)}
                            </div>
                        </button>
                        <div className="text-sm mt-1 text-purple-800 dark:text-white font-semibold text-center">
                            {firstName} {lastName}
                        </div>

                        {profileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                            >
                                <button
                                    onClick={() => setShowProfileModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    <ClipboardList className="w-4 h-4" /> Update Profile
                                </button>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("user");
                                        setTimeout(() => navigate("/"), 1000);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400"
                                >
                                    <LogOutIcon className="w-4 h-4" /> Logout
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-yellow-400 dark:via-yellow-500 dark:to-yellow-600 font-display">
                        Request Items
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-base sm:text-lg font-medium">
                        Choose a department to request help or resources for your upcoming event.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.15
                            }
                        }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {requestOptions.map((title, index) => {
                        const Icon = iconComponents[index];
                        return (
                            <Tilt key={index} options={{ max: 10, scale: 1.02, speed: 400 }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => {
                                        const selectedDepartment = requestOptions[index];
                                        localStorage.setItem("chatDepartment", selectedDepartment);

                                        const user = JSON.parse(localStorage.getItem("user")) || {};
                                        const rawRole = user?.role || user?.userType || "generic";
                                        const role =
                                            rawRole
                                                .toLowerCase()
                                                .split(" ")
                                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                .join(" "); // e.g., "facilities management" → "Facilities Management"

                                        console.log("🧠 Logged-in user object:", user);
                                        console.log("🔑 Normalized role:", role);

                                        const rolePaths = {
                                            Sodexo: "/sodexo-dashboard",
                                            Its: "/its-dashboard",
                                            Parking: "/parking-dashboard",
                                            "Event Organization": "/event-organization-dashboard",
                                            "Facilities Management": "/facilities-management-dashboard",
                                            "Campus Graphics": "/campus-graphics-dashboard",
                                            "Campus Safety": "/campus-safety-dashboard",
                                            Marketing: "/marketing-dashboard",
                                            Faculty: "/faculty-dashboard",
                                             Admin:"/admin-dashboard"
                                        };
                                        const normalizedRole = Object.keys(rolePaths).find(
                                            key => key.toLowerCase() === role.toLowerCase()
                                          );
                                          
                                        const dashboardPath = rolePaths[role] || "/generic-dashboard";
                                        console.log("📍 Final dashboardPath:", dashboardPath);

                                        navigate(`${dashboardPath}/messages`);
                                    }}


                                    className={`group relative cursor-pointer rounded-3xl p-6 bg-gradient-to-br ${cardGradients[index]} dark:bg-zinc-900 border border-purple-200 dark:border-zinc-700 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl`}
                                    style={{
                                        boxShadow: `0 0 20px 4px ${glowColors[index]}`,
                                        transition: "box-shadow 0.4s ease-in-out"
                                    }}

                                >
                                    <div
                                        className="absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-0"
                                        style={{ borderColor: glowColors[index], boxShadow: `0 0 18px 6px ${glowColors[index]}` }}
                                    />
                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <motion.div
                                            whileHover={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                            transition={{ duration: 0.6 }}
                                            className="mb-4"
                                        >
                                            <Icon className="w-10 h-10" />
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-white dark:text-yellow-200 drop-shadow-md">
                                            {title}
                                        </h3>
                                        <p className="mt-2 text-sm text-white/90 dark:text-gray-300 drop-shadow-sm">
                                            {descriptions[index]}
                                        </p>

                                    </div>
                                </motion.div>
                            </Tilt>
                        );
                    })}
                    {showProfileModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-96 shadow-xl"
                            >
                                <h3 className="text-lg font-bold mb-4 text-purple-700 dark:text-purple-400">Update Profile</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            value={tempFirstName}
                                            onChange={(e) => setTempFirstName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg bg-white text-black placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={tempLastName}
                                            onChange={(e) => setTempLastName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg bg-white text-black placeholder-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
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
                                            onClick={() => {
                                                const user = JSON.parse(localStorage.getItem("user")) || {};
                                                const updatedUser = {
                                                    ...user,
                                                    firstName: tempFirstName,
                                                    lastName: tempLastName,
                                                };
                                                localStorage.setItem("user", JSON.stringify(updatedUser));
                                                setFirstName(tempFirstName);
                                                setLastName(tempLastName);
                                                setShowProfileModal(false);
                                                toast.success("Profile updated successfully!");
                                            }}

                                            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                </motion.div>
            </div>
        </div>
    );
}
