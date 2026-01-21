import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if token exists on load
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                try {
                    const res = await axios.get("http://localhost:5001/api/auth/me");
                    setUser(res.data.data);
                    setIsAuthenticated(true);
                } catch (err) {
                    localStorage.removeItem("token");
                    delete axios.defaults.headers.common["Authorization"];
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    // Register
    const register = async (formData) => {
        try {
            const res = await axios.post("http://localhost:5001/api/auth/register", formData);
            const { token, user: userData } = res.data;

            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setUser(userData);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || err.message };
        }
    };

    // Login
    const login = async (email, password) => {
        try {
            const res = await axios.post("http://localhost:5001/api/auth/login", { email, password });
            const { token, user: userData } = res.data;

            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setUser(userData);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || err.message };
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
