import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from "./providers/SnackbarProvider";
import { AuthProvider } from "./providers/AuthProvider";
import theme from "./theme";
import App from "./App";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </SnackbarProvider>
        </ThemeProvider>
    </StrictMode>
);