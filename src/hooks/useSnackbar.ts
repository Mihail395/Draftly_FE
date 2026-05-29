import { useContext } from "react";
import { SnackbarContext } from "../context/SnackbarContext";
import type { SnackbarContextType } from "../context/SnackbarContext";

const useSnackbar = (): SnackbarContextType => {
    const context = useContext(SnackbarContext);

    if (context === undefined) {
        throw new Error("useSnackbar must be used within a SnackbarProvider");
    }

    return context;
};

export default useSnackbar;