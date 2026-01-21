import { createContext, useState, useEffect } from "react";
import api from "../utils/api";

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
                // Token is attached automatically by interceptor in utils/api.js
                try {
                    const res = await api.get("/auth/me");
                    setUser(res.data.data);
                    setIsAuthenticated(true);
                } catch (err) {
                    localStorage.removeItem("token");
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
            const res = await api.post("/auth/register", formData);
            const { token, user: userData } = res.data;

            localStorage.setItem("token", token);
            // axios headers handled by interceptor
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
            const res = await api.post("/auth/login", { email, password });
            const { token, user: userData } = res.data;

            localStorage.setItem("token", token);
            // axios headers handled by interceptor
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
        // delete axios.defaults.headers.common["Authorization"]; // handled by interceptor (it reads per request)
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
