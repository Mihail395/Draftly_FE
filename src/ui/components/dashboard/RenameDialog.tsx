import React, { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

interface RenameDialogProps {
    open: boolean;
    currentTitle: string;
    onClose: () => void;
    onConfirm: (newTitle: string) => Promise<void>;
}

const RenameDialog = ({ open, currentTitle, onClose, onConfirm }: RenameDialogProps) => {
    // Initialize state with currentTitle directly — no useEffect needed
    // The parent will use a key prop to remount this component when reopened
    const [title, setTitle] = useState<string>(currentTitle);
    const [isRenaming, setIsRenaming] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [open]);


    const handleConfirm = async () => {
        if (!title.trim()) {
            setError("Title is required");
            inputRef.current?.focus();
            return;
        }
        if (title.length > 255) {
            setError("Title cannot exceed 255 characters");
            return;
        }
        if (title.trim() === currentTitle) {
            onClose();
            return;
        }
        setIsRenaming(true);
        setError("");
        try {
            await onConfirm(title.trim());
        } catch {
            setIsRenaming(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isRenaming) {
            e.preventDefault();
            void handleConfirm();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={isRenaming ? undefined : onClose}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        width: "100%",
                        maxWidth: 460,
                        borderTop: "3px solid",
                        borderColor: "primary.main",
                    },
                },
            }}
        >
            <DialogContent sx={{ p: 3, pb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: "rgba(43, 87, 154, 0.08)",
                        }}
                    >
                        <DriveFileRenameOutlineIcon sx={{ color: "primary.main", fontSize: 22 }} />
                    </Box>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: "'Merriweather', serif",
                                fontWeight: 700,
                                color: "text.primary",
                            }}
                        >
                            Rename Document
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            Choose a new title for this document
                        </Typography>
                    </Box>
                </Box>

                <TextField
                    inputRef={inputRef}
                    fullWidth
                    label="Document title"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        if (error) setError("");
                    }}
                    onKeyDown={handleKeyPress}
                    error={!!error}
                    helperText={error}
                    disabled={isRenaming}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
                <Button
                    onClick={onClose}
                    disabled={isRenaming}
                    sx={{ color: "text.secondary" }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={isRenaming}
                    sx={{ minWidth: 100 }}
                >
                    {isRenaming ? <CircularProgress size={20} color="inherit" /> : "Rename"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RenameDialog;