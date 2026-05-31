import { Box, Typography, Button } from "@mui/material";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import AddIcon from "@mui/icons-material/Add";

interface EmptyStateProps {
    onCreateClick: () => void;
    searchQuery?: string;
    filterLabel?: string;
}

const EmptyState = ({ onCreateClick, searchQuery, filterLabel }: EmptyStateProps) => {
    // Different message based on context
    const isSearching = !!searchQuery;
    const isFiltered = !!filterLabel && filterLabel !== "All";

    let title = "Your canvas is blank";
    let subtitle = "Start your first document and let your ideas take shape.";
    let showCreateButton = true;

    if (isSearching) {
        title = "No documents match your search";
        subtitle = `We couldn't find anything matching "${searchQuery}". Try a different keyword.`;
        showCreateButton = false;
    } else if (isFiltered) {
        title = `No documents in ${filterLabel}`;
        subtitle = "Switch filters or create a new document to get started.";
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                py: 6,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 520,
                    px: 4,
                    py: 6,
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 4,
                    textAlign: "center",
                    backgroundColor: "background.paper",
                    transition: "border-color 0.2s ease, transform 0.2s ease",
                    "&:hover": {
                        borderColor: "primary.light",
                    },
                }}
            >
                {/* Icon with subtle glow */}
                <Box
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        backgroundColor: "rgba(43, 87, 154, 0.08)",
                        mb: 3,
                        animation: "softGlow 3s ease-in-out infinite",
                        "@keyframes softGlow": {
                            "0%, 100%": {
                                boxShadow: "0 0 0 0 rgba(43, 87, 154, 0.15)",
                            },
                            "50%": {
                                boxShadow: "0 0 0 12px rgba(43, 87, 154, 0)",
                            },
                        },
                    }}
                >
                    <AutoStoriesOutlinedIcon
                        sx={{ color: "primary.main", fontSize: 36 }}
                    />
                </Box>

                <Typography
                    variant="h5"
                    sx={{
                        fontFamily: "'Merriweather', serif",
                        fontWeight: 700,
                        color: "text.primary",
                        mb: 1,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 3, maxWidth: 400, mx: "auto" }}
                >
                    {subtitle}
                </Typography>

                {showCreateButton && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onCreateClick}
                        sx={{
                            px: 3,
                            py: 1.1,
                            fontSize: "0.95rem",
                        }}
                    >
                        Create your first document
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default EmptyState;