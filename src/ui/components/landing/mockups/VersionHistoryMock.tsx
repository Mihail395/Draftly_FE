import { Box, Stack, Typography } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import RestoreIcon from "@mui/icons-material/Restore";
import CloseIcon from "@mui/icons-material/Close";
import { LANDING_COLORS } from "../landingColors";

const TABS = [
    { icon: HistoryIcon, label: "History", active: true },
    { icon: PeopleAltOutlinedIcon, label: "People", active: false },
    { icon: PersonAddAltIcon, label: "Share", active: false },
];

// Sample versions with varied authors and realistic timestamps.
// Different from any real user data — purely illustrative.
const VERSIONS = [
    { name: "Sarah Chen", initials: "S C", when: "Today at 14:22" },
    { name: "James Wilson", initials: "J W", when: "Yesterday at 16:45" },
    { name: "Sarah Chen", initials: "S C", when: "Yesterday at 09:30" },
];

// Mockup of the editor's version history side panel. Mirrors the structure
// of the real app: "Document" header, tabbed nav, and version entries with
// Preview + Restore button-styled pills (purely visual, not interactive).
const VersionHistoryMock = () => (
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
        {/* "Document" header */}
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
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
                    fontSize: "1.1rem",
                    color: LANDING_COLORS.INK,
                }}
            >
                Document
            </Typography>
            <CloseIcon sx={{ fontSize: 20, color: LANDING_COLORS.MUTED }} />
        </Box>

        {/* tabbed header with icons */}
        <Box
            sx={{
                display: "flex",
                gap: 0,
                borderBottom: "1px solid",
                borderColor: "divider",
            }}
        >
            {TABS.map((tab, i) => {
                const Icon = tab.icon;
                return (
                    <Box
                        key={i}
                        sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.7,
                            px: 2,
                            py: 1.5,
                            borderBottom: tab.active
                                ? `2px solid ${LANDING_COLORS.ACCENT}`
                                : "2px solid transparent",
                            fontFamily: "'Source Sans 3', sans-serif",
                            fontSize: "0.85rem",
                            fontWeight: tab.active ? 700 : 500,
                            color: tab.active ? LANDING_COLORS.ACCENT : LANDING_COLORS.MUTED,
                        }}
                    >
                        <Icon sx={{ fontSize: 16 }} />
                        {tab.label}
                    </Box>
                );
            })}
        </Box>

        {/* version list */}
        <Box sx={{ p: 2 }}>
            <Stack spacing={1.5}>
                {VERSIONS.map((v, i) => (
                    <Box
                        key={i}
                        sx={{
                            pb: 1.5,
                            borderBottom: i < VERSIONS.length - 1 ? "1px solid" : "none",
                            borderColor: "divider",
                        }}
                    >
                        {/* top row: avatar + name/timestamp */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    backgroundColor: LANDING_COLORS.ACCENT,
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: "'Source Sans 3', sans-serif",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.5px",
                                    flexShrink: 0,
                                }}
                            >
                                {v.initials}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                    sx={{
                                        fontFamily: "'Source Sans 3', sans-serif",
                                        fontSize: "0.9rem",
                                        fontWeight: 700,
                                        color: LANDING_COLORS.INK,
                                    }}
                                >
                                    {v.name}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Source Sans 3', sans-serif",
                                        fontSize: "0.78rem",
                                        color: LANDING_COLORS.MUTED,
                                    }}
                                >
                                    {v.when}
                                </Typography>
                            </Box>
                        </Box>

                        {/* bottom row: Preview + Restore — static visual pills, not buttons */}
                        <Box sx={{ display: "flex", gap: 1 }}>
                            {/* Preview pill (outlined style) */}
                            <Box
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 0.6,
                                    py: 0.7,
                                    borderRadius: 1.5,
                                    border: "1px solid",
                                    borderColor: LANDING_COLORS.ACCENT,
                                    color: LANDING_COLORS.ACCENT,
                                    fontFamily: "'Source Sans 3', sans-serif",
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                }}
                            >
                                <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                                Preview
                            </Box>

                            {/* Restore pill (filled style) */}
                            <Box
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 0.6,
                                    py: 0.7,
                                    borderRadius: 1.5,
                                    backgroundColor: LANDING_COLORS.ACCENT,
                                    color: "white",
                                    fontFamily: "'Source Sans 3', sans-serif",
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                }}
                            >
                                <RestoreIcon sx={{ fontSize: 16 }} />
                                Restore
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Stack>
        </Box>
    </Box>
);

export default VersionHistoryMock;