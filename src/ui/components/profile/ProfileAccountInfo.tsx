import { Box, Typography } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import type { UserResponse } from "../../../api/types/user";

interface ProfileAccountInfoProps {
    user: UserResponse;
}

const ProfileAccountInfo = ({ user }: ProfileAccountInfoProps) => {
    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "rgba(43, 87, 154, 0.04)",
                    border: "1px solid",
                    borderColor: "rgba(43, 87, 154, 0.10)",
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "rgba(43, 87, 154, 0.10)",
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <EmailOutlinedIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: "text.secondary",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            display: "block",
                            mb: 0.3,
                        }}
                    >
                        Email
                    </Typography>
                    <Typography
                        sx={{
                            color: "text.primary",
                            fontWeight: 600,
                            wordBreak: "break-word",
                        }}
                    >
                        {user.email}
                    </Typography>
                </Box>
                <LockOutlinedIcon
                    sx={{
                        fontSize: 18,
                        color: "text.secondary",
                        opacity: 0.5,
                        flexShrink: 0,
                    }}
                />
            </Box>
            <Typography
                variant="caption"
                sx={{
                    color: "text.secondary",
                    fontSize: "0.78rem",
                    display: "block",
                    mt: 1.5,
                    lineHeight: 1.5,
                }}
            >
                Your email is used to sign in to your account and cannot be changed.
            </Typography>
        </Box>
    );
};

export default ProfileAccountInfo;