import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import FeatureRow from "../components/landing/FeatureRow";
import HeroEditorMock from "../components/landing/mockups/HeroEditorMock";
import AutoSaveMock from "../components/landing/mockups/AutoSaveMock";
import VersionHistoryMock from "../components/landing/mockups/VersionHistoryMock";
import FormattingMock from "../components/landing/mockups/FormattingMock";
import { LANDING_COLORS } from "../components/landing/landingColors";

const LandingPage = () => {
    return (
        <Box>
            {/* ───── HERO ───── */}
            <Box
                component="section"
                sx={{
                    backgroundColor: LANDING_COLORS.CREAM,
                    backgroundImage: `
                        radial-gradient(ellipse 60% 40% at 20% 20%, rgba(43, 87, 154, 0.06), transparent 60%),
                        radial-gradient(ellipse 50% 40% at 90% 80%, rgba(180, 140, 60, 0.06), transparent 50%)
                    `,
                    py: { xs: 8, md: 12 },
                    position: "relative",
                    overflow: "hidden",
                    "@keyframes heroFade": {
                        "0%": { opacity: 0, transform: "translateY(10px)" },
                        "100%": { opacity: 1, transform: "translateY(0)" },
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
                            gap: { xs: 6, md: 8 },
                            alignItems: "center",
                        }}
                    >
                        {/* text */}
                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: "'Source Sans 3', sans-serif",
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                    letterSpacing: "3px",
                                    color: LANDING_COLORS.ACCENT,
                                    textTransform: "uppercase",
                                    mb: 3,
                                    opacity: 0,
                                    animation: "heroFade 0.8s ease 0.1s forwards",
                                }}
                            >
                                Documents, redefined
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "'Merriweather', serif",
                                    fontSize: { xs: "2.5rem", md: "4rem" },
                                    fontWeight: 700,
                                    color: LANDING_COLORS.INK,
                                    lineHeight: 1.05,
                                    letterSpacing: "-1.5px",
                                    mb: 3,
                                    opacity: 0,
                                    animation: "heroFade 0.8s ease 0.25s forwards",
                                }}
                            >
                                The simple way to{" "}
                                <Box
                                    component="span"
                                    sx={{
                                        position: "relative",
                                        display: "inline-block",
                                        color: LANDING_COLORS.ACCENT,
                                        "&::after": {
                                            content: '""',
                                            position: "absolute",
                                            bottom: "0.05em",
                                            left: 0,
                                            right: 0,
                                            height: "0.18em",
                                            backgroundColor: "rgba(43, 87, 154, 0.18)",
                                            zIndex: -1,
                                        },
                                    }}
                                >
                                    write together
                                </Box>
                                .
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "'Source Sans 3', sans-serif",
                                    fontSize: { xs: "1.05rem", md: "1.2rem" },
                                    color: LANDING_COLORS.MUTED,
                                    lineHeight: 1.6,
                                    mb: 5,
                                    maxWidth: 520,
                                    opacity: 0,
                                    animation: "heroFade 0.8s ease 0.4s forwards",
                                }}
                            >
                                Auto-saving collaborative documents with rich formatting and full version history.
                                Start writing, stop worrying.
                            </Typography>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                                sx={{
                                    opacity: 0,
                                    animation: "heroFade 0.8s ease 0.55s forwards",
                                }}
                            >
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        backgroundColor: LANDING_COLORS.INK,
                                        color: "white",
                                        fontFamily: "'Source Sans 3', sans-serif",
                                        fontWeight: 700,
                                        fontSize: "1rem",
                                        px: 3.5,
                                        py: 1.5,
                                        borderRadius: 2,
                                        boxShadow: "0px 10px 30px -8px rgba(15, 23, 41, 0.30)",
                                        "&:hover": {
                                            backgroundColor: "#000",
                                            boxShadow: "0px 14px 40px -8px rgba(15, 23, 41, 0.40)",
                                            transform: "translateY(-1px)",
                                        },
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    Start writing free
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    variant="text"
                                    size="large"
                                    sx={{
                                        color: LANDING_COLORS.INK,
                                        fontFamily: "'Source Sans 3', sans-serif",
                                        fontWeight: 600,
                                        fontSize: "1rem",
                                        px: 2,
                                        py: 1.5,
                                        "&:hover": {
                                            backgroundColor: "rgba(15, 23, 41, 0.05)",
                                        },
                                    }}
                                >
                                    Sign in →
                                </Button>
                            </Stack>
                        </Box>

                        {/* hero mockup */}
                        <Box
                            sx={{
                                opacity: 0,
                                animation: "heroFade 0.9s ease 0.7s forwards",
                            }}
                        >
                            <HeroEditorMock />
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* ───── FEATURE 1: Auto-save ───── */}
            <FeatureRow
                eyebrow="Auto-save"
                title="Never lose a word."
                description="Every keystroke saves automatically in the background. Switch tabs, close the laptop, walk away — your work is safe. The green 'Saved' indicator confirms every change the moment it's stored."
                mockup={<AutoSaveMock />}
                backgroundColor="white"
            />

            {/* ───── FEATURE 2: Version History ───── */}
            <FeatureRow
                eyebrow="Version history"
                title="Travel back in time."
                description="Every meaningful change creates a checkpoint. Browse the history, preview any version, restore with one click. Made a mistake yesterday? Recovery is two clicks away."
                mockup={<VersionHistoryMock />}
                reverse
                backgroundColor={LANDING_COLORS.CREAM}
            />

            {/* ───── FEATURE 3: Rich Formatting ───── */}
            <FeatureRow
                eyebrow="Rich formatting"
                title="Format like a pro."
                description="Headings, lists, tables, links, images, code blocks — everything you need to structure your thoughts. A distraction-free toolbar that's there when you need it and out of the way when you don't."
                mockup={<FormattingMock />}
                backgroundColor="white"
            />

            {/* ───── FINAL CTA ───── */}
            <Box
                component="section"
                sx={{
                    backgroundColor: LANDING_COLORS.DEEP_NAVY,
                    backgroundImage: `
                        radial-gradient(ellipse 80% 60% at 50% 50%, rgba(43, 87, 154, 0.20), transparent 70%),
                        radial-gradient(ellipse 40% 50% at 80% 20%, rgba(180, 140, 60, 0.12), transparent 50%)
                    `,
                    py: { xs: 10, md: 14 },
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        sx={{
                            fontFamily: "'Source Sans 3', sans-serif",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            letterSpacing: "3px",
                            color: "rgba(255, 247, 232, 0.7)",
                            textTransform: "uppercase",
                            mb: 3,
                        }}
                    >
                        Get started
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "'Merriweather', serif",
                            fontSize: { xs: "2.5rem", md: "3.75rem" },
                            fontWeight: 700,
                            color: LANDING_COLORS.CREAM,
                            lineHeight: 1.1,
                            letterSpacing: "-1px",
                            mb: 3,
                        }}
                    >
                        Start writing today.
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "'Source Sans 3', sans-serif",
                            fontSize: { xs: "1.05rem", md: "1.2rem" },
                            color: "rgba(255, 247, 232, 0.7)",
                            lineHeight: 1.6,
                            mb: 5,
                            maxWidth: 540,
                            mx: "auto",
                        }}
                    >
                        Free. No credit card. Sign up and create your first document in seconds.
                    </Typography>
                    <Button
                        component={RouterLink}
                        to="/register"
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                            backgroundColor: LANDING_COLORS.CREAM,
                            color: LANDING_COLORS.INK,
                            fontFamily: "'Source Sans 3', sans-serif",
                            fontWeight: 700,
                            fontSize: "1.05rem",
                            px: 4.5,
                            py: 1.8,
                            borderRadius: 2,
                            boxShadow: "0px 14px 40px -8px rgba(0, 0, 0, 0.5)",
                            "&:hover": {
                                backgroundColor: "white",
                                boxShadow: "0px 18px 50px -8px rgba(0, 0, 0, 0.6)",
                                transform: "translateY(-2px)",
                            },
                            transition: "all 0.2s ease",
                        }}
                    >
                        Create your first document
                    </Button>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;