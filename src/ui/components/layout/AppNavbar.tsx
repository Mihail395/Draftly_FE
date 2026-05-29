import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Container,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    Tooltip,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const AppNavbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate("/");
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate("/profile");
    };

    const handleDashboard = () => {
        navigate("/dashboard");
    };

    const getInitials = (): string => {
        if (!user) return "?";
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <AppBar position="sticky" elevation={0}>
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{
                        height: 60,
                        justifyContent: "space-between",
                    }}
                >
                    {/* Logo */}
                    <Box
                        onClick={handleDashboard}
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
                                fontSize: 32,
                                transition: "transform 0.2s ease",
                            }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: "'Merriweather', serif",
                                fontWeight: 700,
                                fontSize: "1.2rem",
                                color: "text.primary",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Draftly
                        </Typography>
                    </Box>

                    {/* User Avatar + Dropdown Menu */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Tooltip title="Account">
                            <IconButton
                                onClick={handleAvatarClick}
                                size="small"
                                sx={{ p: 0.5 }}
                            >
                                <Avatar
                                    sx={{
                                        width: 34,
                                        height: 34,
                                        backgroundColor: "primary.main",
                                        fontSize: "0.8rem",
                                        fontWeight: 700,
                                        fontFamily: "'Source Sans 3', sans-serif",
                                        cursor: "pointer",
                                        transition: "transform 0.15s ease, box-shadow 0.15s ease",
                                        "&:hover": {
                                            transform: "scale(1.05)",
                                            boxShadow: "0 0 0 2px #2B579A33",
                                        },
                                    }}
                                >
                                    {getInitials()}
                                </Avatar>
                            </IconButton>
                        </Tooltip>

                        {/* Dropdown Menu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={menuOpen}
                            onClose={handleMenuClose}
                            transformOrigin={{ horizontal: "right", vertical: "top" }}
                            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                            slotProps={{
                                paper: {
                                    elevation: 0,
                                    sx: {
                                        mt: 1,
                                        minWidth: 200,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
                                        borderRadius: 2,
                                        overflow: "visible",
                                    },
                                },
                            }}
                        >
                            {/* User info at top of menu */}
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 700, color: "text.primary" }}
                                >
                                    {user?.firstName} {user?.lastName}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ color: "text.secondary" }}
                                >
                                    {user?.email}
                                </Typography>
                            </Box>

                            <Divider />

                            <MenuItem
                                onClick={handleDashboard}
                                sx={{ gap: 1.5, py: 1.2 }}
                            >
                                <ListItemIcon>
                                    <DashboardOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                <Typography variant="body2">Dashboard</Typography>
                            </MenuItem>

                            <MenuItem
                                onClick={handleProfile}
                                sx={{ gap: 1.5, py: 1.2 }}
                            >
                                <ListItemIcon>
                                    <PersonOutlineIcon fontSize="small" />
                                </ListItemIcon>
                                <Typography variant="body2">Profile</Typography>
                            </MenuItem>

                            <Divider />

                            <MenuItem
                                onClick={handleLogout}
                                sx={{
                                    gap: 1.5,
                                    py: 1.2,
                                    color: "error.main",
                                    "&:hover": {
                                        backgroundColor: "rgba(211, 47, 47, 0.04)",
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    <LogoutIcon
                                        fontSize="small"
                                        sx={{ color: "error.main" }}
                                    />
                                </ListItemIcon>
                                <Typography variant="body2">Sign Out</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default AppNavbar;