import { Box, Typography } from "@mui/material";
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

const TABLE_HEADERS = ["Phase", "Owner", "Status"];
const TABLE_ROWS = [
    ["Design", "Anna", "Done"],
    ["Build", "Marco", "In progress"],
];

// Mockup showcasing rich formatting capabilities: heading, bold,
// link, table, and blockquote — everything visible at a glance.
const FormattingMock = () => (
    <Box
        sx={{
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: "0px 20px 60px -15px rgba(15, 23, 41, 0.20)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
        }}
    >
        {/* prominent toolbar */}
        <Box
            sx={{
                display: "flex",
                gap: 0.5,
                px: 2,
                py: 1.2,
                borderBottom: "1px solid",
                borderColor: "divider",
                backgroundColor: "rgba(0, 0, 0, 0.01)",
                flexWrap: "wrap",
            }}
        >
            {TOOLBAR_ICONS.map((Icon, i) => {
                const isHighlighted = i === 0 || i === 4;
                return (
                    <Box
                        key={i}
                        sx={{
                            p: 0.7,
                            borderRadius: 1,
                            color: isHighlighted ? LANDING_COLORS.ACCENT : LANDING_COLORS.MUTED,
                            backgroundColor: isHighlighted ? "rgba(43, 87, 154, 0.1)" : "transparent",
                        }}
                    >
                        <Icon sx={{ fontSize: 18 }} />
                    </Box>
                );
            })}
        </Box>

        {/* content showcasing rich formatting */}
        <Box sx={{ p: 3 }}>
            <Typography
                sx={{
                    fontFamily: "'Merriweather', serif",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: LANDING_COLORS.INK,
                    mb: 1.5,
                }}
            >
                Project Phoenix
            </Typography>
            <Typography
                sx={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.92rem",
                    color: LANDING_COLORS.INK,
                    lineHeight: 1.7,
                    mb: 1.5,
                }}
            >
                We need to{" "}
                <Box component="span" sx={{ fontWeight: 700 }}>
                    focus on shipping
                </Box>{" "}
                by Q3. Read the{" "}
                <Box
                    component="span"
                    sx={{
                        color: LANDING_COLORS.ACCENT,
                        textDecoration: "underline",
                    }}
                >
                    full spec here
                </Box>
                .
            </Typography>

            {/* fake table */}
            <Box
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    overflow: "hidden",
                    mb: 1.5,
                }}
            >
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
                    {TABLE_HEADERS.map((h, i) => (
                        <Box
                            key={i}
                            sx={{
                                px: 1.5,
                                py: 1,
                                backgroundColor: "rgba(43, 87, 154, 0.06)",
                                borderRight: i < 2 ? "1px solid" : "none",
                                borderBottom: "1px solid",
                                borderColor: "divider",
                                fontFamily: "'Source Sans 3', sans-serif",
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                color: LANDING_COLORS.INK,
                            }}
                        >
                            {h}
                        </Box>
                    ))}
                    {TABLE_ROWS.map((row, ri) =>
                        row.map((cell, ci) => (
                            <Box
                                key={`${ri}-${ci}`}
                                sx={{
                                    px: 1.5,
                                    py: 1,
                                    borderRight: ci < 2 ? "1px solid" : "none",
                                    borderBottom: ri === 0 ? "1px solid" : "none",
                                    borderColor: "divider",
                                    fontFamily: "'Source Sans 3', sans-serif",
                                    fontSize: "0.8rem",
                                    color: LANDING_COLORS.INK,
                                }}
                            >
                                {cell}
                            </Box>
                        ))
                    )}
                </Box>
            </Box>

            {/* fake blockquote */}
            <Box
                sx={{
                    borderLeft: `3px solid ${LANDING_COLORS.ACCENT}`,
                    pl: 1.5,
                    py: 0.5,
                    backgroundColor: "rgba(43, 87, 154, 0.04)",
                    borderRadius: "0 6px 6px 0",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.85rem",
                    color: LANDING_COLORS.MUTED,
                    fontStyle: "italic",
                }}
            >
                "Make it work, make it right, make it fast." — Kent Beck
            </Box>
        </Box>
    </Box>
);

export default FormattingMock;