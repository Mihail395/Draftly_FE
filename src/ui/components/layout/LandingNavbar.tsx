import { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router-dom";

const LandingNavbar = () => {
    const navigate = useNavigate();
    // Track scroll position to add shadow when user scrolls down
    // gives the navbar depth and separates it from content
    const [scrolled, setScrolled] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                borderBottom: scrolled
                    ? "1px solid"
                    : "1px solid transparent",
                borderColor: scrolled ? "divider" : "transparent",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                boxShadow: scrolled
                    ? "0px 2px 12px rgba(0, 0, 0, 0.06)"
                    : "none",
            }}
        >
            <Container maxWidth="lg">
                <Toolbar
                    disableGutters
                    sx={{
                        height: 64,
                        justifyContent: "space-between",
                    }}
                >
                    {/* Logo */}
                    <Box
                        onClick={() => navigate("/")}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
                            "&:hover .logo-icon": {
                                transform: "rotate(-8deg) scale(1.1)",
                            },
                        }}
                    >
                        <EditNoteIcon
                            className="logo-icon"
                            sx={{
                                color: "primary.main",
                                fontSize: 34,
                                transition: "transform 0.2s ease",
                            }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: "'Merriweather', serif",
                                fontWeight: 700,
                                fontSize: "1.3rem",
                                color: "text.primary",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Draftly
                        </Typography>
                    </Box>

                    {/* Navigation Actions */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Button
                            variant="text"
                            onClick={() => navigate("/login")}
                            sx={{
                                color: "text.primary",
                                fontWeight: 600,
                                "&:hover": {
                                    backgroundColor: "rgba(43, 87, 154, 0.06)",
                                    color: "primary.main",
                                },
                            }}
                        >
                            Sign In
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/register")}
                            sx={{
                                backgroundColor: "primary.main",
                                px: 3,
                            }}
                        >
                            Get Started
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default LandingNavbar;