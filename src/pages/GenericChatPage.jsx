import ChatComponent from "../components/ChatComponent";
import { useEffect, useState } from "react";
import UserProfileMenu from "../components/UserProfileMenu";
import UpdateProfileModal from "../components/UpdateProfileModal";
import DarkModeToggle from "../components/DarkModeToggle";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

export default function GenericChatPage({ role: propRole }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tempFirstName, setTempFirstName] = useState("");
  const [tempLastName, setTempLastName] = useState("");

  const userObj = JSON.parse(localStorage.getItem("user"));
  const user = userObj?.email;
  const department = userObj?.department;

  // ✅ NEW: Get selected chat department
  const defaultDepartment = localStorage.getItem("chatDepartment") || "";

  // ✅ Derive and normalize role from props, route, or department
  const routeStateRole = location.state?.role;
  const derivedRole = (() => {
    const deptOrUserType = department || userObj?.userType || "";
    if (deptOrUserType.includes("@")) {
      const name = deptOrUserType.split("@")[0];
      return name
        .split(/[-_ ]+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
    return deptOrUserType
      .split(/[-_ ]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  })();
  

  const rawRole = propRole || routeStateRole || derivedRole || "User";
  const normalizedRole = (propRole || userObj?.userType || "Generic")
  .toLowerCase()
  .split(" ")
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(" ");

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

  const handleBackClick = () => {
    const backPath = rolePaths[normalizedRole] || "/generic-dashboard";
    navigate(backPath);
  };

  useEffect(() => {
    if (userObj) {
      setFirstName(userObj.firstName);
      setLastName(userObj.lastName);
      setTempFirstName(userObj.firstName);
      setTempLastName(userObj.lastName);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user,
          firstName: tempFirstName,
          lastName: tempLastName,
        }),
      });

      if (!response.ok) throw new Error("Failed to update");

      const updated = await response.json();
      const updatedUser = {
        ...userObj,
        firstName: updated.firstName,
        lastName: updated.lastName,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setFirstName(updated.firstName);
      setLastName(updated.lastName);
      setShowProfileModal(false);
      toast.success("✅ Profile updated successfully");
    } catch (err) {
      toast.error("❌ Failed to update profile");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 transition-colors duration-500 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-100 via-sky-100 to-purple-100"
      }`}
    >
      {/* ✅ Back Button */}
      <div className="absolute top-4 left-6 z-50">
        <button
          onClick={handleBackClick}
          className="text-purple-700 hover:text-purple-900 font-semibold"
        >
          ← Back to {normalizedRole} Dashboard
        </button>
      </div>

      <Toaster />

      <div className="absolute top-4 right-6 z-50 flex items-center gap-4">
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        <UserProfileMenu
          firstName={firstName}
          lastName={lastName}
          onEditClick={() => setShowProfileModal(true)}
        />
      </div>

      {/* ✅ ChatComponent with department pre-selected */}
      <div className="w-full max-w-[1200px] mx-auto pt-16 sm:pt-12">
        <ChatComponent
          user={user}
          department={department}
          defaultDepartment={defaultDepartment}
        />
      </div>

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
