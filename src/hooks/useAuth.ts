import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import type { AuthContextType } from "../context/AuthContext";

// Custom hook for accessing the auth context
const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};

export default useAuth;