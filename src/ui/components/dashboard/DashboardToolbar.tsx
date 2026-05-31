import {
    Box,
    InputAdornment,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
    Tabs,
    Tab,
    MenuItem,
    Select,
    FormControl,
    Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import type { DocumentFilter, SortField } from "../../../api/types/common";

export type ViewMode = "grid" | "list";

interface DashboardToolbarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    filter: DocumentFilter;
    onFilterChange: (filter: DocumentFilter) => void;
    sort: SortField;
    onSortChange: (sort: SortField) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

const DashboardToolbar = ({
                              searchQuery,
                              onSearchChange,
                              filter,
                              onFilterChange,
                              sort,
                              onSortChange,
                              viewMode,
                              onViewModeChange,
                          }: DashboardToolbarProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mb: 3,
            }}
        >
            {/* Top row — search + view toggle */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <TextField
                    placeholder="Search documents…"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    size="small"
                    sx={{
                        flex: 1,
                        minWidth: 240,
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "background.paper",
                            "& fieldset": { borderColor: "divider" },
                        },
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon
                                        fontSize="small"
                                        sx={{ color: "text.secondary" }}
                                    />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <FormControl
                    size="small"
                    sx={{
                        minWidth: 180,
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "background.paper",
                        },
                    }}
                >
                    <Select
                        value={sort}
                        onChange={(e) => onSortChange(e.target.value as SortField)}
                        displayEmpty
                    >
                        <MenuItem value="UPDATED_AT">Last modified</MenuItem>
                        <MenuItem value="CREATED_AT">Date created</MenuItem>
                        <MenuItem value="TITLE">Title (A–Z)</MenuItem>
                    </Select>
                </FormControl>

                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, value: ViewMode | null) => {
                        if (value) onViewModeChange(value);
                    }}
                    size="small"
                    sx={{
                        "& .MuiToggleButton-root": {
                            border: "1px solid",
                            borderColor: "divider",
                            backgroundColor: "background.paper",
                            "&.Mui-selected": {
                                backgroundColor: "rgba(43, 87, 154, 0.08)",
                                color: "primary.main",
                                "&:hover": {
                                    backgroundColor: "rgba(43, 87, 154, 0.12)",
                                },
                            },
                        },
                    }}
                >
                    <ToggleButton value="grid">
                        <Tooltip title="Grid view">
                            <GridViewIcon fontSize="small" />
                        </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="list">
                        <Tooltip title="List view">
                            <ViewListIcon fontSize="small" />
                        </Tooltip>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Filter tabs */}
            <Tabs
                value={filter}
                onChange={(_, value: DocumentFilter) => onFilterChange(value)}
                sx={{
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    minHeight: 40,
                    "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        minHeight: 40,
                        py: 1,
                        color: "text.secondary",
                        "&.Mui-selected": {
                            color: "primary.main",
                        },
                    },
                    "& .MuiTabs-indicator": {
                        height: 3,
                        borderRadius: "3px 3px 0 0",
                    },
                }}
            >
                <Tab label="All" value="ALL" />
                <Tab label="Owned by me" value="OWNED" />
                <Tab label="Shared with me" value="SHARED" />
            </Tabs>
        </Box>
    );
};

export default DashboardToolbar;