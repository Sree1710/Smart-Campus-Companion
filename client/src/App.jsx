import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

// Placeholders - Need to create these
import StudentAttendance from "./pages/student/Attendance";
import DutyLeave from "./pages/student/DutyLeave";
import Notes from "./pages/student/Notes";
import BusTracking from "./pages/student/BusTracking";
import TeacherAttendance from "./pages/teacher/Attendance";
import ODRequests from "./pages/teacher/ODRequests";
import Notices from "./pages/teacher/Notices";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageBuses from "./pages/admin/ManageBuses";
import ViewAttendance from "./pages/admin/ViewAttendance";
import TeacherNotes from "./pages/teacher/TeacherNotes";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Student Routes */}
              <Route path="/attendance" element={<StudentAttendance />} />
              <Route path="/od" element={<DutyLeave />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/bus" element={<BusTracking />} />

              {/* Teacher Routes */}
              <Route path="/mark-attendance" element={<TeacherAttendance />} />
              <Route path="/teacher/notes" element={<TeacherNotes />} />
              <Route path="/od-requests" element={<ODRequests />} />
              <Route path="/notices" element={<Notices />} />

              {/* Admin Routes */}
              <Route path="/view-attendance" element={<ViewAttendance />} />
              <Route path="/users" element={<ManageUsers />} />
              <Route path="/manage-bus" element={<ManageBuses />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
