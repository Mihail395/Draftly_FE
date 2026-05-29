import { useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";
import { SnackbarContext } from "../context/SnackbarContext";

type SnackbarSeverity = "success" | "error" | "warning" | "info";

interface SnackbarState {
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
}

interface SnackbarProviderProps {
    children: React.ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "info",
    });

    const showSnackbar = useCallback((message: string, severity: SnackbarSeverity) => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleClose = useCallback(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    }, []);

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            {/* Single Snackbar rendered once for the entire app */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};