import { Dialog, DialogContent, DialogActions, Button, Typography, Box, CircularProgress } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";

interface DeleteConfirmDialogProps {
    open: boolean;
    documentTitle: string;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

const DeleteConfirmDialog = ({ open, documentTitle, onClose, onConfirm }: DeleteConfirmDialogProps) => {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } catch {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={isDeleting ? undefined : onClose}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        width: "100%",
                        maxWidth: 440,
                        borderTop: "3px solid",
                        borderColor: "error.main",
                    },
                },
            }}
        >
            <DialogContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: "rgba(211, 47, 47, 0.10)",
                        }}
                    >
                        <DeleteOutlineIcon sx={{ color: "error.main", fontSize: 24 }} />
                    </Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: "'Merriweather', serif",
                            fontWeight: 700,
                            color: "text.primary",
                        }}
                    >
                        Delete document?
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Are you sure you want to delete <strong>"{documentTitle}"</strong>? This
                    action will move the document to trash.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                <Button
                    onClick={onClose}
                    disabled={isDeleting}
                    sx={{ color: "text.secondary" }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleConfirm}
                    disabled={isDeleting}
                    sx={{ minWidth: 100 }}
                >
                    {isDeleting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmDialog;