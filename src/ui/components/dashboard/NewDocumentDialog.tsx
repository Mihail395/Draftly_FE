import React, { useState, useRef, useEffect} from "react";
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
import EditNoteIcon from "@mui/icons-material/EditNote";

interface NewDocumentDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (title: string) => Promise<void>;
}

const NewDocumentDialog = ({ open, onClose, onConfirm }: NewDocumentDialogProps) => {
    const [title, setTitle] = useState<string>("");
    const [isCreating, setIsCreating] = useState<boolean>(false);
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
        setIsCreating(true);
        setError("");
        try {
            await onConfirm(title.trim());
        } catch {
            setIsCreating(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isCreating) {
            e.preventDefault();
            void handleConfirm();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={isCreating ? undefined : onClose}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        width: "100%",
                        maxWidth: 460,
                        borderTop: "3px solid",
                        borderColor: "primary.main",
                        animation: "dialogEntrance 0.25s ease forwards",
                        "@keyframes dialogEntrance": {
                            "0%": {
                                opacity: 0,
                                transform: "translateY(-12px) scale(0.98)",
                            },
                            "100%": {
                                opacity: 1,
                                transform: "translateY(0) scale(1)",
                            },
                        },
                    },
                },
            }}
        >
            <DialogContent sx={{ p: 3, pb: 1 }}>
                {/* Icon + Title */}
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
                        <EditNoteIcon sx={{ color: "primary.main", fontSize: 24 }} />
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
                            New Document
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            Give your document a title to get started
                        </Typography>
                    </Box>
                </Box>

                <TextField
                    inputRef={inputRef}
                    fullWidth
                    label="Document title"
                    placeholder="e.g. Project Proposal"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        if (error) setError("");
                    }}
                    onKeyDown={handleKeyPress}
                    error={!!error}
                    helperText={error}
                    disabled={isCreating}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
                <Button
                    onClick={onClose}
                    disabled={isCreating}
                    sx={{ color: "text.secondary" }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={isCreating}
                    sx={{ minWidth: 100 }}
                >
                    {isCreating ? <CircularProgress size={20} color="inherit" /> : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewDocumentDialog;