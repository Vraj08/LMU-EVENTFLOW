import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import UserProfileMenu from "../components/UserProfileMenu";
import UpdateProfileModal from "../components/UpdateProfileModal";
import DarkModeToggle from "../components/DarkModeToggle";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import api from "../utils/api";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { format, addDays } from "date-fns";
import { motion } from "framer-motion";
import Calendar from "./ui/calendar";

const timeSlots = Array.from({ length: 9 }, (_, i) => {
  const hour = 6 + i * 2;
  const start = hour.toString().padStart(2, "0") + ":00";
  const end = (hour + 2).toString().padStart(2, "0") + ":00";
  return `${start} - ${end}`;
});


const buildings = {
  "Communication Arts Building": ["COM 102", "COM 105"],
  "Doolan Hall": ["DOO 219", "DOO 222"],
  "Foley Annex": ["FAN 160", "FAN 165", "FAN 170", "FAN 175", "FAN 180"],
  "Hilton Center for Business": [
    "HIL 023",
    "HIL 031",
    "HIL 035",
    "HIL 063",
    "HIL 103",
    "HIL 107",
    "HIL 109",
    "HIL 119",
    "HIL 300",
    "HIL 302",
    "HIL 304",
  ],
  "Malone Student Center": ["MAL 112", "MAL 460"],
  "Pereira Hall of Engineering": [
    "PER 109",
    "PER 121",
    "PER 140",
    "PER 200",
    "PER 201",
    "PER 202",
    "PER 206",
    "PER 207",
    "PER 208",
    "PER 211",
  ],
  "Seaver Science Hall": ["SEA 100", "SEA 111", "SEA 200", "SEA 205", "SEA 207"],
  "St. Robert's Hall": [
    "STR 22",
    "STR 104",
    "STR 106",
    "STR 233",
    "STR 234",
    "STR 235",
    "STR 237",
    "STR 239",
    "STR 242",
    "STR 246",
    "STR 248",
    "STR 249",
    "STR 353",
    "STR 354",
    "STR 355",
    "STR 356",
    "STR 357",
    "STR 358",
    "STR 361",
    "STR 366",
    "STR 367",
    "STR 369",
  ],
  "University Hall (UHall)": [
    "UNH 1218",
    "UNH 1222",
    "UNH 1226",
    "UNH 1401",
    "UNH 1402",
    "UNH 1404",
    "UNH 1405",
    "UNH 1775",
    "UNH 1858",
    "UNH 1859",
    "UNH 1866",
    "UNH 2001",
    "UNH 2002",
    "UNH 2330",
    "UNH 3111",
    "UNH 3112",
    "UNH 3222",
    "UNH 3226",
    "UNH 3230",
    "UNH 3304",
    "UNH 3316",
    "UNH 3320",
    "UNH 3324",
    "UNH 3328",
    "UNH 4766",
    "UNH 4802",
  ],
  "Von Der Ahe Building": ["VDA 040", "VDA 240"],
  "William H. Hannon Library": [
    "WHH 104",
    "WHH 105",
    "WHH 106",
    "WHH 117",
    "WHH 118",
    "WHH 324",
    ...Array.from({ length: 20 }, (_, i) => `Study Room ${203 + i}`),
  ],
};

export default function ClassroomBookingPage({ role = "User" }) {
  const navigate = useNavigate();
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
  const [selectedBuilding, setSelectedBuilding] = useState(
    Object.keys(buildings)[0]
  );
  const [selectedRoom, setSelectedRoom] = useState(
    buildings[Object.keys(buildings)[0]][0]
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings", {
          params: { date: format(selectedDate, "yyyy-MM-dd") },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };

    fetchBookings();
  }, [selectedDate]);

  return (
    <>
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


      <div className={`min-h-screen p-4 flex flex-col items-center justify-center transition-colors duration-500 ${darkMode
        ? "bg-gray-900 text-gray-100"
        : "bg-gradient-to-br from-[#f0f9ff] via-[#e6f0ff] to-[#fdfcff] text-gray-900"
        }`}>
        <div className="w-full max-w-6xl space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-center text-purple-700 drop-shadow-md">
            📚 Classroom Booking
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

            {/* Building Select */}
            <Select value={selectedBuilding} onValueChange={(val) => {
              setSelectedBuilding(val);
              setSelectedRoom(buildings[val][0]);
            }}>
              <SelectTrigger className="w-full sm:w-72 px-4 py-2 bg-gradient-to-br from-[#dfe9f3] via-[#f8f9fa] to-[#e2f0fb] text-gray-900 text-left font-normal rounded-xl shadow-md border border-blue-100">
                <SelectValue placeholder="Select Building" />
              </SelectTrigger>

              <SelectContent className="bg-gradient-to-br from-[#dfe9f3] via-[#f8f9fa] to-[#e2f0fb] border border-blue-100 shadow-md rounded-xl">
                {Object.keys(buildings).map((building) => (
                  <SelectItem
                    key={building}
                    value={building}
                    className="text-gray-900 hover:bg-blue-100/60 px-4 py-2 rounded-md transition cursor-pointer"
                  >
                    {building}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Room Select */}
            <Select value={selectedRoom} onValueChange={(val) => setSelectedRoom(val)}>
              <SelectTrigger className="w-full sm:w-72 px-4 py-2 bg-gradient-to-br from-[#dfe9f3] via-[#f8f9fa] to-[#e2f0fb] text-gray-900 text-left font-normal rounded-xl shadow-md border border-blue-100">
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>

              <SelectContent className="bg-gradient-to-br from-[#dfe9f3] via-[#f8f9fa] to-[#e2f0fb] border border-blue-100 shadow-md rounded-xl">
                {buildings[selectedBuilding].map((room) => (
                  <SelectItem
                    key={room}
                    value={room}
                    className="text-gray-900 hover:bg-blue-100/60 px-4 py-2 rounded-md transition cursor-pointer"
                  >
                    {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Picker (Popover calendar) */}
            <Calendar selected={selectedDate} onSelect={setSelectedDate} />

          </div>


          <div className="text-lg font-medium text-center text-gray-900 bg-gradient-to-br from-[#dfe9f3] via-[#f8f9fa] to-[#e2f0fb] rounded-xl shadow-md p-3 mt-2 border border-blue-100">
            Booking for{" "}
            <span className="font-semibold">{selectedRoom}</span> on{" "}
            <span className="text-primary font-semibold">
              {format(selectedDate, "PPP")}
            </span>
          </div>

          <motion.div
            key={`${selectedRoom}-${selectedDate}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {timeSlots.map((slot) => {
              const isBooked = bookings.some(
                (b) =>
                  b.room === selectedRoom &&
                  b.date === format(selectedDate, "yyyy-MM-dd") &&
                  b.timeSlot === slot
              );

              return (
                <Card
                  key={slot}
                  className={`transition-transform ${isBooked ? "opacity-30 pointer-events-none" : ""
                    } bg-gradient-to-br from-[#dfe9f3] via-[#f8f9fa] to-[#e2f0fb] text-gray-900 rounded-3xl shadow-2xl hover:shadow-[0_0_45px_10px_rgba(100,149,237,0.6)] hover:scale-105 duration-500 border border-blue-100`}
                >
                  <CardContent className="p-5 text-gray-900">
                    <div className="text-lg font-semibold">{slot}</div>
                    <Button
                      onClick={async () => {
                        try {
                          await api.post("/book", {
                            building: selectedBuilding,
                            room: selectedRoom,
                            date: format(selectedDate, "yyyy-MM-dd"),
                            timeSlot: slot,
                          });
                          toast.success(" Booking confirmed!");
                          setBookings((prev) => [
                            ...prev,
                            {
                              building: selectedBuilding,
                              room: selectedRoom,
                              date: format(selectedDate, "yyyy-MM-dd"),
                              timeSlot: slot,
                            },
                          ]);
                        } catch (err) {
                          if (err.response?.status === 409) {
                            toast.error("❌ Already booked.");
                          } else {
                            toast.error("⚠️ Booking failed.");
                          }
                        }
                      }}
                      className="mt-2 w-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white font-semibold shadow-md hover:shadow-lg active:scale-95 transition duration-300"
                    >
                      Book
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        </div>
        {showProfileModal && (
          <UpdateProfileModal
            tempFirstName={tempFirstName}
            tempLastName={tempLastName}
            setTempFirstName={setTempFirstName}
            setTempLastName={setTempLastName}
            onCancel={() => setShowProfileModal(false)}
            onSave={async () => {
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
            }}
          />
        )}

      </div>
    </>
  );
}
