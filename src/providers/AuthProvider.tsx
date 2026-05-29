import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import type { AuthContextType } from "../context/AuthContext";
import type { UserResponse } from "../api/types/user";
import authAPI from "../api/authAPI";

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {

    const [user, setUser] = useState<UserResponse | null>(null);

    const [token, setToken] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    // On app load — check if a token exists in localStorage
    // If it does, call /me to get the user info and restore the session
    // If /me fails (token expired or invalid) — clear everything and treat as logged out
    // This runs once when the app first loads
    useEffect(() => {
        const restoreSession = async () => {
            const storedToken = localStorage.getItem("token");

            if (!storedToken) {
                setIsLoading(false);
                return;
            }

            try {
                const currentUser = await authAPI.getCurrentUser();
                setUser(currentUser);
                setToken(storedToken);
            } catch (error) {

                localStorage.removeItem("token");
                setUser(null);
                setToken(null);
            } finally {

                setIsLoading(false);
            }
        };

        restoreSession();
    }, []);


    const login = useCallback((newToken: string, newUser: UserResponse) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(newUser);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }, []);

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: token !== null,
        login,
        logout,
        isLoading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};