import { Box, Button, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

interface ProfileDangerZoneProps {
    onLogout: () => void;
}

// Section at the bottom of the profile page for the logout action.
// Visually subtle but uses error coloring on hover to signal it's a
// session-ending action.
const ProfileDangerZone = ({ onLogout }: ProfileDangerZoneProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
            }}
        >
            <Box sx={{ flex: 1 }}>
                <Typography
                    sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        mb: 0.3,
                    }}
                >
                    Sign out of Draftly
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                >
                    You'll need to sign in again to access your documents.
                </Typography>
            </Box>
            <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={onLogout}
                sx={{
                    fontWeight: 700,
                    textTransform: "none",
                    px: 3,
                    flexShrink: 0,
                    "&:hover": {
                        backgroundColor: "rgba(244, 67, 54, 0.06)",
                    },
                }}
            >
                Sign out
            </Button>
        </Box>
    );
};

export default ProfileDangerZone;