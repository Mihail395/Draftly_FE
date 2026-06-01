import { Box, Typography, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export type SaveState = "saved" | "saving" | "unsaved" | "error";

interface SaveStatusProps {
    state: SaveState;
}

const SaveStatus = ({ state }: SaveStatusProps) => {
    const config = {
        saved: {
            icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />,
            label: "Saved",
            color: "#2E7D32",
        },
        saving: {
            icon: <CircularProgress size={14} thickness={5} />,
            label: "Saving…",
            color: "primary.main",
        },
        unsaved: {
            icon: <EditOutlinedIcon sx={{ fontSize: 16 }} />,
            label: "Unsaved changes",
            color: "warning.main",
        },
        error: {
            icon: <ErrorOutlineIcon sx={{ fontSize: 16 }} />,
            label: "Save failed",
            color: "error.main",
        },
    };

    const current = config[state];

    return (
        <Box
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.7,
                color: current.color,
                transition: "color 0.2s ease",
            }}
        >
            {current.icon}
            <Typography
                variant="caption"
                sx={{
                    fontWeight: 500,
                    fontSize: "0.8rem",
                    color: "inherit",
                }}
            >
                {current.label}
            </Typography>
        </Box>
    );
};

export default SaveStatus;