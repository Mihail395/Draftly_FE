import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LinkIcon from "@mui/icons-material/Link";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import { LANDING_COLORS } from "../landingColors";

const TOOLBAR_ICONS = [
    FormatBoldIcon,
    FormatItalicIcon,
    FormatListBulletedIcon,
    FormatQuoteIcon,
    LinkIcon,
    TableChartOutlinedIcon,
];

// Editor preview shown in the hero. Tilted slightly, with a fake blinking
// cursor. Straightens on hover for a subtle delight moment.
const HeroEditorMock = () => (
    <Box
        sx={{
            position: "relative",
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: "0px 30px 80px -20px rgba(15, 23, 41, 0.25), 0px 12px 30px -10px rgba(43, 87, 154, 0.18)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
            transform: "rotate(-1deg)",
            transition: "transform 0.5s ease",
            "&:hover": {
                transform: "rotate(0deg)",
            },
        }}
    >
        {/* fake title bar */}
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2.5,
                py: 1.5,
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
                Quarterly review
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

        {/* fake toolbar */}
        <Box
            sx={{
                display: "flex",
                gap: 0.8,
                px: 2.5,
                py: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
                backgroundColor: "rgba(0, 0, 0, 0.01)",
            }}
        >
            {TOOLBAR_ICONS.map((Icon, i) => (
                <Box
                    key={i}
                    sx={{
                        p: 0.5,
                        borderRadius: 1,
                        color: i === 0 ? LANDING_COLORS.ACCENT : LANDING_COLORS.MUTED,
                        backgroundColor: i === 0 ? "rgba(43, 87, 154, 0.1)" : "transparent",
                    }}
                >
                    <Icon sx={{ fontSize: 16 }} />
                </Box>
            ))}
        </Box>

        {/* fake content */}
        <Box sx={{ px: 3.5, py: 3, fontFamily: "'Merriweather', serif" }}>
            <Typography
                sx={{
                    fontFamily: "'Merriweather', serif",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: LANDING_COLORS.INK,
                    mb: 1.5,
                }}
            >
                Looking ahead
            </Typography>
            <Typography
                sx={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.92rem",
                    color: LANDING_COLORS.INK,
                    lineHeight: 1.7,
                    mb: 1,
                }}
            >
                Our team delivered{" "}
                <Box component="span" sx={{ fontWeight: 700 }}>
                    three major releases
                </Box>{" "}
                this quarter. The new{" "}
                <Box
                    component="span"
                    sx={{
                        color: LANDING_COLORS.ACCENT,
                        textDecoration: "underline",
                    }}
                >
                    collaboration features
                </Box>{" "}
                drove engagement up 40%.
            </Typography>
            <Box
                component="ul"
                sx={{
                    pl: 2.5,
                    m: 0,
                    "& li": {
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "0.92rem",
                        color: LANDING_COLORS.INK,
                        mb: 0.5,
                        lineHeight: 1.6,
                    },
                }}
            >
                <li>Launched real-time editing</li>
                <li>Improved auto-save reliability</li>
                <li>Built version history panel</li>
            </Box>
        </Box>

        {/* fake blinking cursor */}
        <Box
            sx={{
                position: "absolute",
                bottom: 60,
                right: 60,
                width: 2,
                height: 18,
                backgroundColor: LANDING_COLORS.ACCENT,
                animation: "blink 1s steps(2, start) infinite",
                "@keyframes blink": {
                    to: { visibility: "hidden" },
                },
            }}
        />
    </Box>
);

export default HeroEditorMock;