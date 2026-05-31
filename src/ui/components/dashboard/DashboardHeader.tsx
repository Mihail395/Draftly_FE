import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useAuth from "../../../hooks/useAuth";

interface DashboardHeaderProps {
    onNewDocument: () => void;
}

const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 5) return "Working late";
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const DashboardHeader = ({ onNewDocument }: DashboardHeaderProps) => {
    const { user } = useAuth();
    const firstName = user?.firstName ?? "there";

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 4,
            }}
        >
            <Box>
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: "'Merriweather', serif",
                        fontWeight: 700,
                        color: "text.primary",
                        letterSpacing: "-0.5px",
                        lineHeight: 1.2,
                    }}
                >
                    {getGreeting()}, {firstName}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 0.5 }}
                >
                    Pick up where you left off, or start something new.
                </Typography>
            </Box>

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onNewDocument}
                sx={{
                    px: 2.5,
                    py: 1,
                    fontSize: "0.95rem",
                    whiteSpace: "nowrap",
                    boxShadow: "0px 4px 12px rgba(43, 87, 154, 0.25)",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0px 6px 16px rgba(43, 87, 154, 0.35)",
                    },
                }}
            >
                New Document
            </Button>
        </Box>
    );
};

export default DashboardHeader;