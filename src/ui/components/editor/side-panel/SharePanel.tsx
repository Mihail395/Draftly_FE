import { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Avatar,
    InputAdornment,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import useDebounce from "../../../../hooks/useDebounce";
import { useEffect } from "react";
import userAPI from "../../../../api/userAPI";
import type { UserResponse } from "../../../../api/types/user";
import type { ShareDocumentRequest } from "../../../../api/types/collaborator";

interface SharePanelProps {
    existingCollaboratorEmails: string[];
    onShare: (request: ShareDocumentRequest) => Promise<void>;
}

const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const SharePanel = ({ existingCollaboratorEmails, onShare }: SharePanelProps) => {
    const [searchInput, setSearchInput] = useState<string>("");
    const [results, setResults] = useState<UserResponse[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [permission, setPermission] = useState<"EDIT" | "VIEW">("EDIT");
    const [isSharing, setIsSharing] = useState<boolean>(false);

    const debouncedSearch = useDebounce(searchInput, 300);

    // Search users when debounced query changes
    useEffect(() => {
        if (!debouncedSearch.trim()) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setResults([]);
            return;
        }

        let cancelled = false;

        const search = async () => {
            setIsSearching(true);
            try {
                const data = await userAPI.searchUsersByEmail(debouncedSearch);
                if (!cancelled) {
                    // Filter out users who are already collaborators
                    const filtered = data.content.filter(
                        (u) => !existingCollaboratorEmails.includes(u.email)
                    );
                    setResults(filtered);
                }
            } catch {
                if (!cancelled) setResults([]);
            } finally {
                if (!cancelled) setIsSearching(false);
            }
        };

        void search();

        return () => {
            cancelled = true;
        };
    }, [debouncedSearch, existingCollaboratorEmails]);

    const handleShare = async () => {
        if (!selectedUser) return;
        setIsSharing(true);
        try {
            await onShare({
                email: selectedUser.email,
                permission,
            });
            // Reset form on success
            setSearchInput("");
            setResults([]);
            setSelectedUser(null);
            setPermission("EDIT");
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <Box sx={{ p: 2.5 }}>
            {/* Permission toggle */}
            <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontWeight: 600, mb: 1, display: "block" }}
            >
                Permission level
            </Typography>
            <ToggleButtonGroup
                value={permission}
                exclusive
                onChange={(_, value: "EDIT" | "VIEW" | null) => {
                    if (value) setPermission(value);
                }}
                size="small"
                fullWidth
                sx={{
                    mb: 2.5,
                    "& .MuiToggleButton-root": {
                        border: "1px solid",
                        borderColor: "divider",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        "&.Mui-selected": {
                            backgroundColor: "rgba(43, 87, 154, 0.10)",
                            color: "primary.main",
                            "&:hover": {
                                backgroundColor: "rgba(43, 87, 154, 0.15)",
                            },
                        },
                    },
                }}
            >
                <ToggleButton value="EDIT">Can edit</ToggleButton>
                <ToggleButton value="VIEW">Can view</ToggleButton>
            </ToggleButtonGroup>

            {/* Search input */}
            <TextField
                fullWidth
                placeholder="Search by email…"
                value={searchInput}
                onChange={(e) => {
                    setSearchInput(e.target.value);
                    setSelectedUser(null);
                }}
                size="small"
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{ mb: 1.5 }}
            />

            {/* Search results */}
            {isSearching && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <CircularProgress size={20} />
                </Box>
            )}

            {!isSearching && debouncedSearch.trim() && results.length === 0 && (
                <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", display: "block", textAlign: "center", py: 2 }}
                >
                    No users found
                </Typography>
            )}

            {!isSearching && results.length > 0 && (
                <Box
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        overflow: "hidden",
                        mb: 1.5,
                    }}
                >
                    {results.map((user) => {
                        const isSelected = selectedUser?.email === user.email;
                        return (
                            <Box
                                key={user.email}
                                onClick={() => setSelectedUser(user)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    px: 1.5,
                                    py: 1.2,
                                    cursor: "pointer",
                                    backgroundColor: isSelected
                                        ? "rgba(43, 87, 154, 0.08)"
                                        : "transparent",
                                    transition: "background-color 0.12s ease",
                                    borderLeft: "3px solid",
                                    borderColor: isSelected ? "primary.main" : "transparent",
                                    "&:hover": {
                                        backgroundColor: isSelected
                                            ? "rgba(43, 87, 154, 0.10)"
                                            : "rgba(0, 0, 0, 0.03)",
                                    },
                                    "&:not(:last-child)": {
                                        borderBottom: "1px solid",
                                        borderBottomColor: "divider",
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 30,
                                        height: 30,
                                        backgroundColor: "primary.main",
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                    }}
                                >
                                    {getInitials(user.firstName, user.lastName)}
                                </Avatar>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                            color: "text.primary",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "text.secondary",
                                            fontSize: "0.7rem",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            display: "block",
                                        }}
                                    >
                                        {user.email}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}

            {/* Share button */}
            <Button
                fullWidth
                variant="contained"
                onClick={() => void handleShare()}
                disabled={!selectedUser || isSharing}
                startIcon={
                    isSharing
                        ? <CircularProgress size={16} color="inherit" />
                        : <PersonAddOutlinedIcon />
                }
                sx={{ mt: 1 }}
            >
                {isSharing ? "Sharing…" : "Share document"}
            </Button>
        </Box>
    );
};

export default SharePanel;