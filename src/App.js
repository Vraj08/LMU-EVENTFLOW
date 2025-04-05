import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApproveEvents from "./components/ApproveEvents";


import HomePage from "./pages/HomePage";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./components/AdminDashboard";
import GenericDashboard from "./components/GenericDashboard";
import GenericManageEvents from "./components/GenericManageEvents";
import GenericEditEvent from "./components/GenericEditEvent"; // ✅ ADD THIS
import GenericRequestItems from "./components/GenericRequestItems"; // ✅ ADD THIS 
// ⬇️ New role dashboards
import SodexoDashboard from './pages/SodexoDashboard';
import ITSDashboard from './pages/ITSDashboard';
import ParkingDashboard from './pages/ParkingDashboard';
import EventOrganizationDashboard from './pages/EventOrganizationDashboard';
import FacilitiesManagementDashboard from './pages/FacilitiesManagementDashboard';
import CampusGraphicsDashboard from './pages/CampusGraphicsDashboard';
import CampusSafetyDashboard from './pages/CampusSafetyDashboard';
import MarketingDashboard from './pages/MarketingDashboard';
import GenericCreateEvent from "./components/GenericCreateEvent";
import UpcomingEventsLayout from "./components/UpcomingEventsLayout";
import ChatPage from "./pages/GenericChatPage";
import GenericChatPage from "./pages/GenericChatPage"; // make sure this path is correct
import ChangeUserRolePage from"./components/ChangeUserRolePage";
import GenericClassroomBookings from "./components/GenericClassroomBookings";
import Unauthorized3DPage from './pages/unathorized';
function App() {
  return (
    <Router>
      <Routes>
        {/* Existing Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard/approve-events" element={<ApproveEvents role="Admin" />} />
        <Route path="/admin-dashboard/change-roles" element={<ChangeUserRolePage  />} />{/*role="Admin"*/}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/sodexo-dashboard/messages" element={<ChatPage />} />
        <Route path="/sodexo-dashboard/book-classroom" element={<GenericClassroomBookings role="Sodexo" />} />
        <Route path="/its-dashboard/book-classroom" element={<GenericClassroomBookings role="ITS" />} />
        <Route path="/parking-dashboard/book-classroom" element={<GenericClassroomBookings role="Parking" />} />
        <Route path="/event-organization-dashboard/book-classroom" element={<GenericClassroomBookings role="Event Organization" />} />
        <Route path="/facilities-management-dashboard/book-classroom" element={<GenericClassroomBookings role="Facilities Management" />} />
        <Route path="/campus-graphics-dashboard/book-classroom" element={<GenericClassroomBookings role="Campus Graphics" />} />
        <Route path="/campus-safety-dashboard/book-classroom" element={<GenericClassroomBookings role="Campus Safety" />} />
        <Route path="/marketing-dashboard/book-classroom" element={<GenericClassroomBookings role="Marketing" />} />
        <Route path="/faculty-dashboard/book-classroom" element={<GenericClassroomBookings role="Faculty" />} />
        <Route path="/generic-dashboard/book-classroom" element={<GenericClassroomBookings role="Generic" />} />
        <Route path="/unauthorized" element={<Unauthorized3DPage />} />
        <Route path="/admin-dashboard/create-event" element={<GenericCreateEvent role="Admin" />} />
        <Route path="/admin-dashboard/manage-events" element={<GenericManageEvents role="Admin" />} />
        <Route path="/admin-dashboard/manage-events/edit-event/:id" element={<GenericEditEvent role="Admin" />} />
        <Route path="/admin-dashboard/request-items" element={<GenericRequestItems role="Admin" />} />
        <Route path="/admin-dashboard/book-classroom" element={<GenericClassroomBookings role="Admin" />} />
        <Route path="/admin-dashboard/messages" element={<ChatPage />} />
        <Route path="/admin/upcoming-events" element={<UpcomingEventsLayout role="Admin" />} />

        <Route path="/its-dashboard/messages" element={<ChatPage />} />
        <Route path="/parking-dashboard/messages" element={<ChatPage />} />
        <Route path="/facilities-management-dashboard/messages" element={<ChatPage />} />
        <Route path="/event-organization-dashboard/messages" element={<ChatPage />} />
        <Route path="/campus-graphics-dashboard/messages" element={<ChatPage />} />
        <Route path="/campus-safety-dashboard/messages" element={<ChatPage />} />
        <Route path="/marketing-dashboard/messages" element={<ChatPage />} />
        <Route path="/generic-dashboard" element={<GenericDashboard />} />

        {/* New Role Dashboards */}

        <Route path="/sodexo/upcoming-events" element={<UpcomingEventsLayout role="Sodexo" />} />
        <Route path="/its/upcoming-events" element={<UpcomingEventsLayout role="ITS" />} />
        <Route path="/parking/upcoming-events" element={<UpcomingEventsLayout role="Parking" />} />
        <Route path="/event-organization/upcoming-events" element={<UpcomingEventsLayout role="Event Organization" />} />
        <Route path="/facilities-management/upcoming-events" element={<UpcomingEventsLayout role="Facilities Management" />} />
        <Route path="/campus-graphics/upcoming-events" element={<UpcomingEventsLayout role="Campus Graphics" />} />
        <Route path="/campus-safety/upcoming-events" element={<UpcomingEventsLayout role="Campus Safety" />} />
        <Route path="/marketing/upcoming-events" element={<UpcomingEventsLayout role="Marketing" />} />
        <Route path="/faculty/upcoming-events" element={<UpcomingEventsLayout role="Faculty" />} />

        <Route path="/faculty/request-items/:department" element={<GenericChatPage />} />

        <Route path="/sodexo-dashboard" element={<SodexoDashboard />} />
        <Route path="/its-dashboard" element={<ITSDashboard />} />
        <Route path="/parking-dashboard" element={<ParkingDashboard />} />
        <Route path="/event-organization-dashboard" element={<EventOrganizationDashboard />} />
        <Route path="/facilities-management-dashboard" element={<FacilitiesManagementDashboard />} />
        <Route path="/campus-graphics-dashboard" element={<CampusGraphicsDashboard />} />
        <Route path="/campus-safety-dashboard" element={<CampusSafetyDashboard />} />
        <Route path="/marketing-dashboard" element={<MarketingDashboard />} />
        <Route path="/sodexo-dashboard/create-event" element={<GenericCreateEvent role="Sodexo" />} />
        <Route path="/its-dashboard/create-event" element={<GenericCreateEvent role="ITS" />} />
        <Route path="/parking-dashboard/create-event" element={<GenericCreateEvent role="Parking" />} />
        <Route path="/event-organization-dashboard/create-event" element={<GenericCreateEvent role="Event Organization" />} />
        <Route path="/facilities-management-dashboard/create-event" element={<GenericCreateEvent role="Facilities Management" />} />
        <Route path="/campus-graphics-dashboard/create-event" element={<GenericCreateEvent role="Campus Graphics" />} />
        <Route path="/campus-safety-dashboard/create-event" element={<GenericCreateEvent role="Campus Safety" />} />
        <Route path="/marketing-dashboard/create-event" element={<GenericCreateEvent role="Marketing" />} />
        <Route path="/faculty-dashboard/create-event" element={<GenericCreateEvent role="Faculty" />} />
        <Route path="/sodexo-dashboard/manage-events" element={<GenericManageEvents role="Sodexo" />} />
        <Route path="/its-dashboard/manage-events" element={<GenericManageEvents role="ITS" />} />
        <Route path="/parking-dashboard/manage-events" element={<GenericManageEvents role="Parking" />} />
        <Route path="/event-organization-dashboard/manage-events" element={<GenericManageEvents role="Event Organization" />} />
        <Route path="/facilities-management-dashboard/manage-events" element={<GenericManageEvents role="Facilities Management" />} />
        <Route path="/campus-graphics-dashboard/manage-events" element={<GenericManageEvents role="Campus Graphics" />} />
        <Route path="/campus-safety-dashboard/manage-events" element={<GenericManageEvents role="Campus Safety" />} />
        <Route path="/marketing-dashboard/manage-events" element={<GenericManageEvents role="Marketing" />} />
        <Route path="/faculty-dashboard/manage-events" element={<GenericManageEvents role="Faculty" />} />
        <Route path="/sodexo-dashboard/manage-events/edit-event/:id" element={<GenericEditEvent role="Sodexo" />} />
        <Route path="/its-dashboard/manage-events/edit-event/:id" element={<GenericEditEvent role="ITS" />} />
        <Route path="/parking-dashboard/manage-events/edit-event/:id" element={<GenericEditEvent role="Parking" />} />
        <Route path="/event-organization-dashboard/manage-events/edit-event/:id" element={<GenericEditEvent role="Event Organization" />} />
        <Route path="/facilities-management-dashboard/manage-events/edit-event/:id" element={<GenericEditEvent role="Facilities Management" />} />
        <Route path="/campus-graphics-dashboard/manage-events/edit-event/:id" element={<GenericEditEvent role="Campus Graphics" />} />
        <Route path="/campus-safety-dashboard/manage-events/edit-event/:id" element={<GenericEditEvent role="Campus Safety" />} />
        <Route path="/marketing-dashboard/manage-events/edit-event/:id" element={<GenericEditEvent role="Marketing" />} />
        <Route path="/faculty-dashboard/manage-events/edit-event/:id" element={<GenericEditEvent role="Faculty" />} />
        <Route path="/sodexo-dashboard/request-items" element={<GenericRequestItems role="Sodexo" />} />
        <Route path="/its-dashboard/request-items" element={<GenericRequestItems role="ITS" />} />
        <Route path="/parking-dashboard/request-items" element={<GenericRequestItems role="Parking" />} />
        <Route path="/event-organization-dashboard/request-items" element={<GenericRequestItems role="Event Organization" />} />
        <Route path="/facilities-management-dashboard/request-items" element={<GenericRequestItems role="Facilities Management" />} />
        <Route path="/campus-graphics-dashboard/request-items" element={<GenericRequestItems role="Campus Graphics" />} />
        <Route path="/campus-safety-dashboard/request-items" element={<GenericRequestItems role="Campus Safety" />} />
        <Route path="/marketing-dashboard/request-items" element={<GenericRequestItems role="Marketing" />} />
        <Route path="/faculty-dashboard/request-items" element={<GenericRequestItems role="Faculty" />} />




      </Routes>
    </Router>
  );
}

export default App;
