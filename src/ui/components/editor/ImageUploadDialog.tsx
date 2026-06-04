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
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

interface ImageUploadDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (url: string) => void;
}

const ImageUploadDialog = ({ open, onClose, onConfirm }: ImageUploadDialogProps) => {
    const [url, setUrl] = useState<string>("");
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
        try {
            new URL(trimmed);
        } catch {
            setError("Please enter a valid image URL");
            return;
        }
        onConfirm(trimmed);
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
                        <ImageOutlinedIcon sx={{ color: "primary.main", fontSize: 22 }} />
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
                            Insert Image
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            Paste an image URL to insert it
                        </Typography>
                    </Box>
                </Box>

                <TextField
                    inputRef={inputRef}
                    fullWidth
                    label="Image URL"
                    placeholder="https://example.com/image.jpg"
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        if (error) setError("");
                    }}
                    onKeyDown={handleKeyPress}
                    error={!!error}
                    //helperText={error || "TODO: File upload support coming later"}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
                <Button onClick={onClose} sx={{ color: "text.secondary" }}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleConfirm} sx={{ minWidth: 100 }}>
                    Insert
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImageUploadDialog;