import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome, {user.name}
                    </h1>
                    <button
                        onClick={logout}
                        className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                    >
                        Logout
                    </button>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
                    </h2>
                    <p className="text-gray-600">
                        Your centralized academic management hub.
                    </p>
                    {/* Module widgets will go here */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
