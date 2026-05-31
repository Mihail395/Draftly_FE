import React, { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

interface LinkDialogProps {
    open: boolean;
    initialUrl?: string;
    onClose: () => void;
    onConfirm: (url: string) => void;
}

const LinkDialog = ({ open, initialUrl = "", onClose, onConfirm }: LinkDialogProps) => {
    const [url, setUrl] = useState<string>(initialUrl);
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

    const handleConfirm = () => {
        const trimmed = url.trim();
        if (!trimmed) {
            setError("URL is required");
            return;
        }
        // Validate URL format
        try {
            new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
        } catch {
            setError("Please enter a valid URL");
            return;
        }
        const finalUrl = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
        onConfirm(finalUrl);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleConfirm();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                        <LinkIcon sx={{ color: "primary.main", fontSize: 22 }} />
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
                            {initialUrl ? "Edit Link" : "Insert Link"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            Enter a URL to link the selected text
                        </Typography>
                    </Box>
                </Box>

                <TextField
                    inputRef={inputRef}
                    fullWidth
                    label="URL"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        if (error) setError("");
                    }}
                    onKeyDown={handleKeyPress}
                    error={!!error}
                    helperText={error}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
                <Button onClick={onClose} sx={{ color: "text.secondary" }}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleConfirm} sx={{ minWidth: 100 }}>
                    {initialUrl ? "Update" : "Insert"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LinkDialog;