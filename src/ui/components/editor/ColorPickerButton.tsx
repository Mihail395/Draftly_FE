import React, { useState } from "react";
import {
    IconButton,
    Menu,
    Box,
    Tooltip,
    Typography,
} from "@mui/material";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

type ColorMode = "text" | "highlight";

interface ColorPickerButtonProps {
    mode: ColorMode;
    currentColor?: string;
    onColorChange: (color: string | null) => void;
    disabled?: boolean;
}

const TEXT_COLORS = [
    "#1A1A2E", "#2B579A", "#185ABD", "#D32F2F", "#ED6C02",
    "#2E7D32", "#9C27B0", "#0288D1", "#5C6B7A", "#A0A8B0",
];

const HIGHLIGHT_COLORS = [
    "#FFF59D", "#FFE0B2", "#FFCDD2", "#C8E6C9", "#BBDEFB",
    "#E1BEE7", "#B2DFDB", "#F8BBD0", "#D7CCC8", "#CFD8DC",
];

const ColorPickerButton = ({
                               mode,
                               currentColor,
                               onColorChange,
                               disabled = false,
                           }: ColorPickerButtonProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleColorSelect = (color: string) => {
        onColorChange(color);
        handleClose();
    };

    const handleReset = () => {
        onColorChange(null);
        handleClose();
    };

    const colors = mode === "text" ? TEXT_COLORS : HIGHLIGHT_COLORS;
    const Icon = mode === "text" ? FormatColorTextIcon : BorderColorOutlinedIcon;
    const tooltipLabel = mode === "text" ? "Text color" : "Highlight";

    return (
        <>
            <Tooltip title={tooltipLabel}>
                <span>
                    <IconButton
                        size="small"
                        onClick={handleOpen}
                        disabled={disabled}
                        sx={{
                            borderRadius: 1,
                            color: "text.primary",
                            position: "relative",
                            "&:hover": {
                                backgroundColor: "rgba(43, 87, 154, 0.08)",
                            },
                        }}
                    >
                        <Icon fontSize="small" />
                        {currentColor && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 4,
                                    left: 6,
                                    right: 6,
                                    height: 3,
                                    backgroundColor: currentColor,
                                    borderRadius: 0.5,
                                }}
                            />
                        )}
                    </IconButton>
                </span>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            mt: 0.5,
                            p: 1.5,
                            border: "1px solid",
                            borderColor: "divider",
                            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.08)",
                            borderRadius: 2,
                        },
                    },
                }}
            >
                <Box>
                    <Typography
                        variant="caption"
                        sx={{
                            color: "text.secondary",
                            fontWeight: 600,
                            display: "block",
                            mb: 1,
                            ml: 0.5,
                        }}
                    >
                        {mode === "text" ? "Text color" : "Highlight color"}
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 1fr)",
                            gap: 0.7,
                        }}
                    >
                        {colors.map((color) => (
                            <Box
                                key={color}
                                onClick={() => handleColorSelect(color)}
                                sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 1,
                                    backgroundColor: color,
                                    cursor: "pointer",
                                    border: "2px solid",
                                    borderColor:
                                        currentColor === color
                                            ? "primary.main"
                                            : "transparent",
                                    transition: "transform 0.12s ease, border-color 0.12s ease",
                                    "&:hover": {
                                        transform: "scale(1.1)",
                                    },
                                }}
                            />
                        ))}
                    </Box>

                    <Box
                        onClick={handleReset}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.7,
                            mt: 1.5,
                            px: 0.7,
                            py: 0.7,
                            borderRadius: 1,
                            cursor: "pointer",
                            color: "text.secondary",
                            transition: "background-color 0.12s ease",
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                        }}
                    >
                        <RestartAltIcon fontSize="small" />
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            Reset
                        </Typography>
                    </Box>
                </Box>
            </Menu>
        </>
    );
};

export default ColorPickerButton;