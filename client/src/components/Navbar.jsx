import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="flex h-16 items-center justify-between border-b bg-white px-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
                Dashboard
            </h2>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
