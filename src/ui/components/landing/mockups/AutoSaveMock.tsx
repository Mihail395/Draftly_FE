import { Box, Stack, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { LANDING_COLORS } from "../landingColors";

const SAVE_STATES = [
    { label: "Typing...", color: LANDING_COLORS.MUTED, dot: "#FFC107" },
    { label: "Saving...", color: LANDING_COLORS.MUTED, dot: LANDING_COLORS.ACCENT },
    { label: "Saved 2 seconds ago", color: "#2E7D32", dot: "#4CAF50" },
];

// Visual progression showing the save lifecycle. Highlights the final
// "Saved" state with a subtle green tint and outline.
const AutoSaveMock = () => (
    <Box
        sx={{
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: "0px 20px 60px -15px rgba(15, 23, 41, 0.20)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
            position: "relative",
        }}
    >
        {/* doc bar with green saved pill */}
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2.5,
                py: 1.8,
                borderBottom: "1px solid",
                borderColor: "divider",
            }}
        >
            <Typography
                sx={{
                    fontFamily: "'Merriweather', serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: LANDING_COLORS.INK,
                    flex: 1,
                }}
            >
                Untitled document
            </Typography>
            <Box
                sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1.2,
                    py: 0.3,
                    borderRadius: 999,
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                    color: "#2E7D32",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                }}
            >
                <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
                Saved
            </Box>
        </Box>

        {/* save progression */}
        <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
                {SAVE_STATES.map((item, i) => {
                    const isFinal = i === SAVE_STATES.length - 1;
                    return (
                        <Box
                            key={i}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                py: 1,
                                px: 1.5,
                                borderRadius: 2,
                                backgroundColor: isFinal ? "rgba(76, 175, 80, 0.06)" : "transparent",
                                border: "1px solid",
                                borderColor: isFinal ? "rgba(76, 175, 80, 0.20)" : "transparent",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    backgroundColor: item.dot,
                                    flexShrink: 0,
                                }}
                            />
                            <Typography
                                sx={{
                                    fontFamily: "'Source Sans 3', sans-serif",
                                    fontSize: "0.9rem",
                                    color: item.color,
                                    fontWeight: isFinal ? 600 : 400,
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                    );
                })}
            </Stack>
        </Box>
    </Box>
);

export default AutoSaveMock;