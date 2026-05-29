import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import useAuth from "../../../hooks/useAuth";

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Wait for AuthProvider to finish checking localStorage
    // and calling /me before deciding whether to redirect
    // Without this the app flashes the login page on every refresh
    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;