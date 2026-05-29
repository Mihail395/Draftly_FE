import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";

const LandingLayout = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <LandingNavbar />

            {/* pt: 8 = 64px — pushes content below fixed navbar */}
            <Box component="main" sx={{ flex: 1, pt: 8 }}>
                <Outlet />
            </Box>

            <LandingFooter />
        </Box>
    );
};

export default LandingLayout;