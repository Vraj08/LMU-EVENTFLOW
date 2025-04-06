import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import Unauthorized3DPage from './pages/unathorized';

import ApproveEvents from "./components/ApproveEvents";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import SodexoDashboard from "./pages/SodexoDashboard";
import ITSDashboard from "./pages/ITSDashboard";
import ParkingDashboard from "./pages/ParkingDashboard";
import EventOrganizationDashboard from "./pages/EventOrganizationDashboard";
import FacilitiesManagementDashboard from "./pages/FacilitiesManagementDashboard";
import CampusGraphicsDashboard from "./pages/CampusGraphicsDashboard";
import CampusSafetyDashboard from "./pages/CampusSafetyDashboard";
import MarketingDashboard from "./pages/MarketingDashboard";

import GenericDashboard from "./components/GenericDashboard";
import GenericCreateEvent from "./components/GenericCreateEvent";
import GenericManageEvents from "./components/GenericManageEvents";
import GenericEditEvent from "./components/GenericEditEvent";
import GenericRequestItems from "./components/GenericRequestItems";
import GenericClassroomBookings from "./components/GenericClassroomBookings";
import UpcomingEventsLayout from "./components/UpcomingEventsLayout";
import ChatPage from "./pages/GenericChatPage";
import GenericChatPage from "./pages/GenericChatPage";
import ChangeUserRolePage from "./components/ChangeUserRolePage";

function App() {
  const { user } = useAuth();
  console.log("👤 User Role in App.js:", user?.role);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/unauthorized" element={<Unauthorized3DPage />} />

        <Route path="/student-dashboard" element={
          <ProtectedRoute user={user} allowedRoles={["Student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard" element={
          <ProtectedRoute user={user} allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard/approve-events" element={
          <ProtectedRoute user={user} allowedRoles={["Admin"]}>
            <ApproveEvents role="Admin" />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard/change-roles" element={
          <ProtectedRoute user={user} allowedRoles={["Admin"]}>
            <ChangeUserRolePage role="Admin" />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard/create-event" element={
          <ProtectedRoute user={user} allowedRoles={["Admin"]}>
            <GenericCreateEvent role="Admin" />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard/manage-events" element={
          <ProtectedRoute user={user} allowedRoles={["Admin"]}>
            <GenericManageEvents role="Admin" />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard/manage-events/edit-event/:id" element={
          <ProtectedRoute user={user} allowedRoles={["Admin"]}>
            <GenericEditEvent role="Admin" />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard/request-items" element={
          <ProtectedRoute user={user} allowedRoles={["Admin"]}>
            <GenericRequestItems role="Admin" />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard/book-classroom" element={
          <ProtectedRoute user={user} allowedRoles={["Admin"]}>
            <GenericClassroomBookings role="Admin" />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard/messages" element={
          <ProtectedRoute user={user} allowedRoles={["Admin"]}>
            <ChatPage role="Admin" />
          </ProtectedRoute>
        } />
        <Route path="/admin/upcoming-events" element={
          <ProtectedRoute user={user} allowedRoles={["Admin"]}>
            <UpcomingEventsLayout role="Admin" />
          </ProtectedRoute>
        } />

        <Route path="/faculty-dashboard" element={
          <ProtectedRoute user={user} allowedRoles={["Faculty"]}>
            <FacultyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/faculty-dashboard/create-event" element={
          <ProtectedRoute user={user} allowedRoles={["Faculty"]}>
            <GenericCreateEvent role="Faculty" />
          </ProtectedRoute>
        } />
        <Route path="/faculty-dashboard/book-classroom" element={
          <ProtectedRoute user={user} allowedRoles={["Faculty"]}>
            <GenericClassroomBookings role="Faculty" />
          </ProtectedRoute>
        } />
        <Route path="/faculty-dashboard/manage-events" element={
          <ProtectedRoute user={user} allowedRoles={["Faculty"]}>
            <GenericManageEvents role="Faculty" />
          </ProtectedRoute>
        } />
        <Route path="/faculty-dashboard/manage-events/edit-event/:id" element={
          <ProtectedRoute user={user} allowedRoles={["Faculty"]}>
            <GenericEditEvent role="Faculty" />
          </ProtectedRoute>
        } />
        <Route path="/faculty-dashboard/request-items" element={
          <ProtectedRoute user={user} allowedRoles={["Faculty"]}>
            <GenericRequestItems role="Faculty" />
          </ProtectedRoute>
        } />
        <Route path="/faculty/upcoming-events" element={
          <ProtectedRoute user={user} allowedRoles={["Faculty"]}>
            <UpcomingEventsLayout role="Faculty" />
          </ProtectedRoute>
        } />
        <Route path="/faculty/request-items/:department" element={
          <ProtectedRoute user={user} allowedRoles={["Faculty"]}>
            <GenericChatPage role="Faculty" />
          </ProtectedRoute>
        } />

        {[
          ["Sodexo", SodexoDashboard],
          ["ITS", ITSDashboard],
          ["Parking", ParkingDashboard],
          ["Event Organization", EventOrganizationDashboard],
          ["Facilities Management", FacilitiesManagementDashboard],
          ["Campus Graphics", CampusGraphicsDashboard],
          ["Campus Safety", CampusSafetyDashboard],
          ["Marketing", MarketingDashboard],
        ].map(([role, Dashboard]) => (
          <React.Fragment key={role}>
            <Route path={`/${role.toLowerCase().replace(/ /g, "-")}-dashboard`} element={
              <ProtectedRoute user={user} allowedRoles={[role]}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path={`/${role.toLowerCase().replace(/ /g, "-")}-dashboard/create-event`} element={
              <ProtectedRoute user={user} allowedRoles={[role]}>
                <GenericCreateEvent role={role} />
              </ProtectedRoute>
            } />
            <Route path={`/${role.toLowerCase().replace(/ /g, "-")}-dashboard/book-classroom`} element={
              <ProtectedRoute user={user} allowedRoles={[role]}>
                <GenericClassroomBookings role={role} />
              </ProtectedRoute>
            } />
            <Route path={`/${role.toLowerCase().replace(/ /g, "-")}-dashboard/manage-events`} element={
              <ProtectedRoute user={user} allowedRoles={[role]}>
                <GenericManageEvents role={role} />
              </ProtectedRoute>
            } />
            <Route path={`/${role.toLowerCase().replace(/ /g, "-")}-dashboard/manage-events/edit-event/:id`} element={
              <ProtectedRoute user={user} allowedRoles={[role]}>
                <GenericEditEvent role={role} />
              </ProtectedRoute>
            } />
            <Route path={`/${role.toLowerCase().replace(/ /g, "-")}-dashboard/request-items`} element={
              <ProtectedRoute user={user} allowedRoles={[role]}>
                <GenericRequestItems role={role} />
              </ProtectedRoute>
            } />
            <Route path={`/${role.toLowerCase().replace(/ /g, "-")}-dashboard/messages`} element={
              <ProtectedRoute user={user} allowedRoles={[role]}>
                <ChatPage role={role} />
              </ProtectedRoute>
            } />
            <Route path={`/${role.toLowerCase().replace(/ /g, "-")}/upcoming-events`} element={
              <ProtectedRoute user={user} allowedRoles={[role]}>
                <UpcomingEventsLayout role={role} />
              </ProtectedRoute>
            } />
          </React.Fragment>
        ))}

        <Route path="/generic-dashboard" element={
          <ProtectedRoute user={user} allowedRoles={[
            "Admin",
            "Student",
            "Faculty",
            "Sodexo",
            "ITS",
            "Parking",
            "Event Organization",
            "Facilities Management",
            "Campus Graphics",
            "Campus Safety",
            "Marketing"
          ]}>
            <GenericDashboard />
          </ProtectedRoute>
        } />
        <Route path="/generic-dashboard/book-classroom" element={
          <ProtectedRoute user={user} allowedRoles={[
            "Admin",
            "Student",
            "Faculty",
            "Sodexo",
            "ITS",
            "Parking",
            "Event Organization",
            "Facilities Management",
            "Campus Graphics",
            "Campus Safety",
            "Marketing"
          ]}>
            <GenericClassroomBookings role="Generic" />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
