import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#2B579A",      // MW blue
            dark: "#185ABD",      // Darker blue for hover states
            light: "#4472C4",     // Lighter blue for accents
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#185ABD",
            contrastText: "#FFFFFF",
        },
        background: {
            default: "#F5F5F5",   // Light gray page background
            paper: "#FFFFFF",     // White for cards and surfaces
        },
        text: {
            primary: "#1A1A2E",   // Near black for main text
            secondary: "#5C6B7A", // Gray for secondary text
        },
        error: {
            main: "#D32F2F",
        },
        success: {
            main: "#2E7D32",
        },
        divider: "#E0E0E0",
    },

    typography: {
        // Merriweather for headings — elegant serif that feels premium
        // Source Sans Pro for body — clean readable sans-serif
        // Import both in index.html from Google Fonts
        fontFamily: "'Source Sans Pro', sans-serif",
        h1: {
            fontFamily: "'Merriweather', serif",
            fontWeight: 700,
            fontSize: "2.5rem",
        },
        h2: {
            fontFamily: "'Merriweather', serif",
            fontWeight: 700,
            fontSize: "2rem",
        },
        h3: {
            fontFamily: "'Merriweather', serif",
            fontWeight: 600,
            fontSize: "1.5rem",
        },
        h4: {
            fontFamily: "'Merriweather', serif",
            fontWeight: 600,
            fontSize: "1.25rem",
        },
        h5: {
            fontFamily: "'Merriweather', serif",
            fontWeight: 600,
            fontSize: "1rem",
        },
        h6: {
            fontFamily: "'Merriweather', serif",
            fontWeight: 600,
            fontSize: "0.875rem",
        },
        body1: {
            fontSize: "1rem",
            lineHeight: 1.6,
        },
        body2: {
            fontSize: "0.875rem",
            lineHeight: 1.6,
        },
        button: {
            textTransform: "none", // Disable ALL CAPS on buttons globally
            fontWeight: 600,
        },
    },

    shape: {
        borderRadius: 8, // Default border radius for all components
    },

    // Override default styles for specific MUI components globally so no setting manually
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: "8px 20px",
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "none",
                    },
                },
                containedPrimary: {
                    "&:hover": {
                        backgroundColor: "#185ABD",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                    "&:hover": {
                        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.12)",
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
                size: "small",
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#FFFFFF",
                    color: "#1A1A2E",
                    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.08)",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 600,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#F5F5F5",
                    minHeight: "100vh",
                },
            },
        },
    },
});

export default theme;