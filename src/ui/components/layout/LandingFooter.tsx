import { Box, Container, Typography } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";

const LandingFooter = () => {
    return (
        <Box
            component="footer"
            sx={{
                borderTop: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
                py: 2.5,        // reduced from py: 4
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    {/* Logo */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <EditNoteIcon
                            sx={{ color: "primary.main", fontSize: 28 }}  // increased from 22
                        />
                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: "'Merriweather', serif",
                                fontWeight: 700,
                                fontSize: "1.1rem",                        // increased from default body1
                                color: "text.primary",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Draftly
                        </Typography>
                    </Box>

                    {/* Copyright */}
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                    >
                        © {new Date().getFullYear()} Draftly. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default LandingFooter;