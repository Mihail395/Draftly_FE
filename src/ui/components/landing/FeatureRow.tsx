import { Box, Container, Typography } from "@mui/material";
import type { ReactNode } from "react";
import useInView from "../../../hooks/useInView";
import { LANDING_COLORS } from "./landingColors";

interface FeatureRowProps {
    eyebrow: string;
    title: string;
    description: string;
    mockup: ReactNode;
    reverse?: boolean;
    backgroundColor?: string;
}

// Reusable section showing an "eyebrow + title + description" on one side
// and a mockup on the other. Direction alternates via the `reverse` prop.
const FeatureRow = ({
                        eyebrow,
                        title,
                        description,
                        mockup,
                        reverse = false,
                        backgroundColor,
                    }: FeatureRowProps) => {
    const { ref, visible } = useInView();

    return (
        <Box
            component="section"
            ref={ref}
            sx={{
                py: { xs: 8, md: 14 },
                backgroundColor: backgroundColor ?? "white",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: { xs: 5, md: 10 },
                        alignItems: "center",
                        direction: reverse ? { md: "rtl" } : "ltr",
                    }}
                >
                    {/* text column */}
                    <Box sx={{ direction: "ltr" }}>
                        <Typography
                            sx={{
                                fontFamily: "'Source Sans 3', sans-serif",
                                fontSize: "0.78rem",
                                fontWeight: 700,
                                letterSpacing: "2.5px",
                                color: LANDING_COLORS.ACCENT,
                                textTransform: "uppercase",
                                mb: 2,
                            }}
                        >
                            {eyebrow}
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: "'Merriweather', serif",
                                fontSize: { xs: "2rem", md: "2.75rem" },
                                fontWeight: 700,
                                color: LANDING_COLORS.INK,
                                lineHeight: 1.15,
                                letterSpacing: "-0.5px",
                                mb: 2.5,
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: "'Source Sans 3', sans-serif",
                                fontSize: "1.1rem",
                                color: LANDING_COLORS.MUTED,
                                lineHeight: 1.7,
                                maxWidth: 500,
                            }}
                        >
                            {description}
                        </Typography>
                    </Box>

                    {/* mockup column */}
                    <Box sx={{ direction: "ltr" }}>{mockup}</Box>
                </Box>
            </Container>
        </Box>
    );
};

export default FeatureRow;