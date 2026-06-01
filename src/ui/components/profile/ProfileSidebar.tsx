import { Box, Paper, Typography } from "@mui/material";
import type { UserResponse } from "../../../api/types/user";

interface ProfileSidebarProps {
    user: UserResponse;
}

const ProfileSidebar = ({ user }: ProfileSidebarProps) => {
    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    const fullName = `${user.firstName} ${user.lastName}`;

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                p: 4,
                textAlign: "center",
                position: { md: "sticky" },
                top: { md: 84 },
            }}
        >
            {/* Avatar */}
            <Box
                sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Merriweather', serif",
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    mx: "auto",
                    mb: 2.5,
                    boxShadow: "0px 8px 24px -8px rgba(43, 87, 154, 0.40)",
                }}
            >
                {initials}
            </Box>

            {/* Name */}
            <Typography
                sx={{
                    fontFamily: "'Merriweather', serif",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "text.primary",
                    mb: 0.5,
                    lineHeight: 1.3,
                }}
            >
                {fullName}
            </Typography>

            {/* Email */}
            <Typography
                sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    wordBreak: "break-word",
                }}
            >
                {user.email}
            </Typography>
        </Paper>
    );
};

export default ProfileSidebar;