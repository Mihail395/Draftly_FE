import { Box, Paper, Typography, Divider } from "@mui/material";
import type { ReactNode } from "react";

interface ProfileSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
}


const ProfileSection = ({ title, description, children }: ProfileSectionProps) => {
    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
            }}
        >
            <Box sx={{ px: 3, py: 2.5 }}>
                <Typography
                    sx={{
                        fontFamily: "'Merriweather', serif",
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: "text.primary",
                        mb: description ? 0.5 : 0,
                    }}
                >
                    {title}
                </Typography>
                {description && (
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                    >
                        {description}
                    </Typography>
                )}
            </Box>
            <Divider />
            <Box sx={{ p: 3 }}>{children}</Box>
        </Paper>
    );
};

export default ProfileSection;