import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, TextField } from "@mui/material";

interface EditableTitleProps {
    title: string;
    onSave: (newTitle: string) => Promise<void>;
    editable: boolean;
}

const EditableTitle = ({ title, onSave, editable }: EditableTitleProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [draft, setDraft] = useState<string>(title);
    const inputRef = useRef<HTMLInputElement>(null);

    // When external title changes (e.g. after restore) sync the draft
    useEffect(() => {
        if (!isEditing) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDraft(title);
        }
    }, [title, isEditing]);

    // Focus the input when entering edit mode
    useEffect(() => {
        if (isEditing) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isEditing]);

    const handleStartEdit = () => {
        if (!editable) return;
        setIsEditing(true);
    };

    const handleSave = async () => {
        const trimmed = draft.trim();
        if (!trimmed || trimmed === title) {
            setDraft(title);
            setIsEditing(false);
            return;
        }
        if (trimmed.length > 255) {
            setDraft(title);
            setIsEditing(false);
            return;
        }
        try {
            await onSave(trimmed);
        } catch {
            setDraft(title);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setDraft(title);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            void handleSave();
        } else if (e.key === "Escape") {
            e.preventDefault();
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <TextField
                inputRef={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => void handleSave()}
                onKeyDown={handleKeyDown}
                variant="standard"
                sx={{
                    "& .MuiInputBase-input": {
                        fontFamily: "'Merriweather', serif",
                        fontWeight: 700,
                        fontSize: "1.15rem",
                        color: "text.primary",
                        padding: "2px 4px",
                    },
                    "& .MuiInput-underline:before": {
                        borderBottomColor: "primary.main",
                    },
                }}
            />
        );
    }

    return (
        <Box
            onClick={handleStartEdit}
            sx={{
                display: "inline-block",
                cursor: editable ? "text" : "default",
                px: 0.7,
                py: 0.3,
                borderRadius: 1,
                transition: "background-color 0.15s ease",
                "&:hover": editable
                    ? { backgroundColor: "rgba(43, 87, 154, 0.06)" }
                    : {},
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontFamily: "'Merriweather', serif",
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    color: "text.primary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 480,
                }}
            >
                {title || "Untitled"}
            </Typography>
        </Box>
    );
};

export default EditableTitle;