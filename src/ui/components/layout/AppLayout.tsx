import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";

const AppLayout = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundColor: "background.default",
            }}
        >
            <AppNavbar />

            {/* Main content area — takes remaining height */}
            <Box component="main" sx={{ flex: 1 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default AppLayout;