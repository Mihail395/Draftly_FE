import { createContext } from "react";

type SnackbarSeverity = "success" | "error" | "warning" | "info";

export interface SnackbarContextType {
    showSnackbar: (message: string, severity: SnackbarSeverity) => void;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);