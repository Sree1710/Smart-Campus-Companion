import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Placeholders - Need to create these
import StudentAttendance from "./pages/student/Attendance";
import DutyLeave from "./pages/student/DutyLeave";
import Notes from "./pages/student/Notes";
import BusTracking from "./pages/student/BusTracking";
import TeacherAttendance from "./pages/teacher/Attendance";
import ODRequests from "./pages/teacher/ODRequests";
import Notices from "./pages/teacher/Notices";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />

              {/* Student Routes */}
              <Route path="/attendance" element={<StudentAttendance />} />
              <Route path="/od" element={<DutyLeave />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/bus" element={<BusTracking />} />

              {/* Teacher Routes */}
              <Route path="/mark-attendance" element={<TeacherAttendance />} />
              <Route path="/od-requests" element={<ODRequests />} />
              <Route path="/notices" element={<Notices />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
