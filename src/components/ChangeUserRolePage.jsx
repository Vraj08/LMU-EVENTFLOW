import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/Card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { motion } from "framer-motion";
import { Switch } from "./ui/switch";
import confetti from "canvas-confetti";
import { toast, Toaster } from "react-hot-toast";
import { Button, buttonVariants } from "./ui/Button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // for the arrow icon
import DarkModeToggle from "../components/DarkModeToggle";
import UserProfileMenu from "../components/UserProfileMenu";
import UpdateProfileModal from "../components/UpdateProfileModal"; // Import the modal


let animationFrameId = null;

const toastSuccessStyle = {
    style: {
        fontSize: "1.1rem",
        padding: "1.2rem",
        background: "#f0fff0",
        color: "#006400",
        fontWeight: "bold",
        border: "1px solid #006400",
    },
    iconTheme: {
        primary: "#006400",
        secondary: "white",
    },
};

const ChangeUserRolePage = () => {
    const [emails, setEmails] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [roles, setRoles] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [currentRole, setCurrentRole] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [interactive, setInteractive] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [showProfileModal, setShowProfileModal] = useState(false);

    const cardRef = useRef(null);
    const lightRef = useRef(null);
    const lastEvent = useRef(null);
    const navigate = useNavigate();  // Initialize navigation

    useEffect(() => {
        setEmails(["user1@example.com", "user2@example.com"]);
        setRoles(["Admin", "Editor", "Viewer"]);

        // Fetch user data from localStorage
        const user = JSON.parse(localStorage.getItem("eventflowUser"));
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    useEffect(() => {
        if (selectedEmail) {
            const simulatedCurrentRole = "Viewer";  // Simulate the current role fetch
            setCurrentRole(simulatedCurrentRole);
        }
    }, [selectedEmail]);

    // Handle profile update
    const handleProfileUpdate = () => {
        // Update the user profile in localStorage
        const updatedUser = { ...JSON.parse(localStorage.getItem("eventflowUser")), firstName, lastName };
        localStorage.setItem("eventflowUser", JSON.stringify(updatedUser));

        // Close the modal and update the state
        setShowProfileModal(false);
        toast.success("Profile updated successfully!");
    };

    // Handle changing role
    const handleChangeRole = () => {
        console.log(`Changed ${selectedEmail} from ${currentRole} to ${selectedRole}`);
        toast.success("Role Successfully Changed!", toastSuccessStyle);
        confetti({ particleCount: 60, spread: 45, origin: { y: 0.6 } });
        setTimeout(() => confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } }), 300);
        setTimeout(() => confetti({ particleCount: 120, spread: 90, origin: { y: 0.4 } }), 600);
        setConfirmOpen(false);
    };

    const processMouseMove = () => {
        if (!lastEvent.current || !interactive) return;
        const e = lastEvent.current;
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
        animationFrameId = null;
    };

    const handleMouseMove = (e) => {
        if (!interactive) return;
        lastEvent.current = e;
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(processMouseMove);
        }
    };

    const handleMouseLeave = () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        const card = cardRef.current;
        if (card) {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
            card.style.boxShadow = "0px 10px 25px rgba(0, 0, 0, 0.1)";
        }
        if (lightRef.current) {
            lightRef.current.style.background = "none";
        }
    };

    return (
        <motion.div
            className={`min-h-screen flex flex-col items-center justify-center px-4 
        ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-sky-100 via-rose-100 to-fuchsia-200"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Toaster position="top-center" reverseOrder={false} />
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
                    onClick={() => navigate("/admin-dashboard")} // Change this to your actual Admin Dashboard path
                    className="flex items-center text-purple-700 hover:text-purple-900 font-medium"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Admin Dashboard
                </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
                <Switch id="toggle3d" checked={interactive} onCheckedChange={setInteractive} />
                <label
                    htmlFor="toggle3d"
                    className={`text-sm font-medium ${darkMode ? "text-white" : "text-black"}`}
                >
                    Enable 3D Interaction
                </label>
            </div>


            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-full max-w-md rounded-3xl"
            >
                <div
                    ref={lightRef}
                    className="absolute top-0 left-0 w-full h-full rounded-3xl pointer-events-none z-0"
                ></div>

                <Card className="relative z-10 p-6 rounded-[2rem] shadow-2xl bg-gradient-to-br from-sky-100 via-rose-100 to-fuchsia-200 dark:from-zinc-800 dark:to-zinc-900 animated-border">
                    <CardContent className="space-y-6">
                        <h2 className="text-2xl font-bold text-center text-indigo-800">Change User Role</h2>

                        <div>
                            <label className="block text-sm font-medium">Select Email</label>
                            <Select onValueChange={setSelectedEmail}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose email" />
                                </SelectTrigger>
                                <SelectContent>
                                    {emails.map((email) => (
                                        <SelectItem key={email} value={email}>{email}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Select New Role</label>
                            <Select onValueChange={setSelectedRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose new role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role} value={role}>{role}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    className={buttonVariants({ variant: "gradient" }) + " w-full"}
                                    disabled={!selectedEmail || !selectedRole}
                                >
                                    Change Role
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Confirm Role Change</DialogTitle>
                                </DialogHeader>
                                <p>Are you sure you want to change role for <strong>{selectedEmail}</strong> from <strong>{currentRole}</strong> to <strong>{selectedRole}</strong>?</p>
                                <DialogFooter>
                                    <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                                    <Button
                                        className={buttonVariants({ variant: "gradient" }) + " px-6 py-2 rounded-xl text-sm font-semibold"}
                                        onClick={handleChangeRole}
                                    >
                                        Yes, Change
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Update Profile Modal */}
            {showProfileModal && (
                <UpdateProfileModal
                    tempFirstName={firstName}
                    tempLastName={lastName}
                    setTempFirstName={setFirstName}
                    setTempLastName={setLastName}
                    onCancel={() => setShowProfileModal(false)}
                    onSave={handleProfileUpdate} // onSave now saves the updated profile
                />
            )}
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
    );
};

export default ChangeUserRolePage;
