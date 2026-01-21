import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
    Home,
    UserCheck,
    MapPin,
    FileText,
    Calendar,
    Bus,
    Users,
    Bell,
    LogOut,
    BookOpen
} from "lucide-react";

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    // Define menu items based on functions
    const commonItems = [
        { name: "Home", path: "/dashboard", icon: Home },
    ];

    const studentItems = [
        { name: "Attendance", path: "/attendance", icon: UserCheck },
        { name: "Duty Leave", path: "/od", icon: Calendar },
        { name: "Notes", path: "/notes", icon: FileText },
        { name: "Bus Tracking", path: "/bus", icon: Bus },
    ];

    const teacherItems = [
        { name: "Attendance", path: "/mark-attendance", icon: UserCheck },
        { name: "Assignments", path: "/teacher/notes", icon: BookOpen }, // Using BookOpen icon
        { name: "OD Requests", path: "/od-requests", icon: Calendar },
        { name: "Notices", path: "/notices", icon: Bell },
    ];

    const adminItems = [
        { name: "View Attendance", path: "/view-attendance", icon: UserCheck },
        { name: "Notice Board", path: "/notices", icon: Bell },
        { name: "OD Requests", path: "/od-requests", icon: Calendar }, // View Pending
        { name: "Manage Users", path: "/users", icon: Users },
        { name: "Manage Buses", path: "/manage-bus", icon: Bus },
    ];

    let menuItems = [...commonItems];
    if (user.role === 'student') menuItems = [...menuItems, ...studentItems];
    if (user.role === 'teacher') menuItems = [...menuItems, ...teacherItems];
    if (user.role === 'admin') menuItems = [...menuItems, ...adminItems];

    return (
        <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
            <div className="flex h-16 items-center justify-center border-b border-gray-800">
                <h1 className="text-xl font-bold">campusO</h1>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${isActive(item.path)
                            ? "bg-indigo-600 text-white"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`}
                    >
                        <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="border-t border-gray-800 p-4">
                <button
                    onClick={logout}
                    className="flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
