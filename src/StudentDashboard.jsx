import { useEffect, useState } from "react";
import { CardContent } from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import { motion } from "framer-motion";
import { SparklesIcon, CalendarIcon, ClockIcon, LogOutIcon, PencilIcon, ImageIcon } from "lucide-react";

export default function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [firstName, setFirstName] = useState("Vraj");
  const [lastName, setLastName] = useState("Patel");
  const [tempFirstName, setTempFirstName] = useState("Vraj");
  const [tempLastName, setTempLastName] = useState("Patel");
  const [profilePic, setProfilePic] = useState("https://i.pravatar.cc/100?img=20");
  const [previewPic, setPreviewPic] = useState(null);

  useEffect(() => {
    const sampleEvents = [
      {
        id: "1",
        title: "AI in 2025: A Look Ahead",
        date: "March 30, 2025",
        time: "2:00 PM",
        description: "Join us for an exciting talk on the future of artificial intelligence.",
      },
      {
        id: "2",
        title: "Spring Cultural Fest",
        date: "April 5, 2025",
        time: "6:00 PM",
        description: "Celebrate diversity with music, dance, and delicious food.",
      },
    ];
    setEvents(sampleEvents);
    setLoading(false);
  }, []);

  const handleRSVP = async (eventId) => {
    alert(`🎉 RSVP confirmed for event ID: ${eventId}`);
  };

  const handleLogout = () => {
    alert("👋 Logged out successfully!");
  };

  const handleProfileUpdate = () => {
    setFirstName(tempFirstName);
    setLastName(tempLastName);
    setShowProfileModal(false);
    alert("✅ Profile updated successfully!");
  };

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewPic(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPictureUpload = () => {
    if (previewPic) {
      setProfilePic(previewPic);
      setPreviewPic(null);
      setShowPictureModal(false);
      alert("✅ Profile picture updated!");
    }
  };

  const openProfileModal = () => {
    setTempFirstName(firstName);
    setTempLastName(lastName);
    setShowProfileModal(true);
  };

  if (loading) return <div className="text-center text-xl p-10 animate-pulse text-indigo-600">Loading events...</div>;

  return (
    <motion.div
      className="relative p-10 bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-200 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {showProfileModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-96 shadow-xl"
          >
            <h3 className="text-lg font-bold mb-4 text-purple-700">Update Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={tempFirstName}
                  onChange={(e) => setTempFirstName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={tempLastName}
                  onChange={(e) => setTempLastName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileModal(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                  onClick={handleProfileUpdate}
                >
                  Save
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showPictureModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-96 shadow-xl text-center"
          >
            <h3 className="text-lg font-bold mb-4 text-purple-700">Upload Profile Picture</h3>
            <div className="mb-4">
              <label htmlFor="profileUpload" className="cursor-pointer inline-block bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold px-4 py-2 rounded-lg transition duration-200">
                Choose Image
              </label>
              <input
                id="profileUpload"
                type="file"
                accept="image/*"
                onChange={handlePictureUpload}
                className="hidden"
              />
            </div>
            {previewPic && (
              <div className="mb-4">
                <img src={previewPic} alt="Preview" className="w-24 h-24 rounded-full mx-auto border-2 border-purple-300 shadow" />
              </div>
            )}
            <div className="flex justify-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => setShowPictureModal(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                onClick={confirmPictureUpload}
              >
                Save
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="absolute top-5 right-5 z-50">
        <div className="relative text-center">
          <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="rounded-full border-4 border-white overflow-hidden shadow-md hover:shadow-lg transition">
            <img
              src={profilePic}
              alt="Profile"
              className="w-10 h-10 object-cover rounded-full"
            />
          </button>
          <div className="text-sm mt-1 text-purple-800 font-semibold">{firstName} {lastName}</div>
          {profileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200"
            >
              <button onClick={openProfileModal} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <PencilIcon className="w-4 h-4" /> Update Profile
              </button>
              <button onClick={() => setShowPictureModal(true)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <ImageIcon className="w-4 h-4" /> Update Picture
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOutIcon className="w-4 h-4" /> Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 mt-20">
        {events.map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.6, type: "spring" }}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
              whileTap={{ scale: 0.97 }}
              className="rounded-3xl shadow-xl bg-white border border-gray-100 hover:shadow-2xl transition duration-300 overflow-hidden"
            >
              <CardContent className="p-6">
                <h2 className="text-3xl font-extrabold text-purple-700 mb-3">{event.title}</h2>
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <CalendarIcon className="w-4 h-4 mr-2" /> {event.date}
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <ClockIcon className="w-4 h-4 mr-2" /> {event.time}
                </div>
                <p className="text-gray-700 mb-6 text-md leading-relaxed">{event.description}</p>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    onClick={() => handleRSVP(event.id)}
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
  );
}
