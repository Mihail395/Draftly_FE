import { createContext } from "react";
import type { UserResponse } from "../api/types/user";

export interface AuthContextType {
    // The currently logged user — null if not logged in
    user: UserResponse | null;

    // The JWT token — null if not logged in
    token: string | null;

    // Derived from token — if token exists user is authenticated
    isAuthenticated: boolean;

    // Called after successful login or register
    // Saves token to localStorage and sets user + token in context
    login: (token: string, user: UserResponse) => void;

    // Called when user clicks logout
    // Clears localStorage and resets context to unauthenticated state
    logout: () => void;

    // Re-fetches the current user from the backend and updates context
    // Used after profile updates (e.g. name change) so the UI reflects the new data
    refreshUser: () => Promise<void>;

    // True while AuthProvider is checking localStorage for an existing token
    // and calling /me to restore the session on app load
    // Prevents the app from flashing the login page before session is restored
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);