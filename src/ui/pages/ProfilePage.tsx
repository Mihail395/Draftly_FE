import { Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileSection from "../components/profile/ProfileSection";
import ProfileInfoForm from "../components/profile/ProfileInfoForm";
import ProfileAccountInfo from "../components/profile/ProfileAccountInfo";
import ProfileSecurityForm from "../components/profile/ProfileSecurityForm";
import ProfileDangerZone from "../components/profile/ProfileDangerZone";

import useAuth from "../../hooks/useAuth";
import useProfile from "../../hooks/useProfile";

const ProfilePage = () => {
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();
    const { isUpdatingName, isChangingPassword, updateName, changePassword } =
        useProfile(refreshUser);


    if (!user) {
        return null; // ProtectedRoute should handle this case
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
            {/* Page header */}
            <Box sx={{ mb: { xs: 4, md: 5 } }}>
                <Typography
                    sx={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        letterSpacing: "2.5px",
                        color: "primary.main",
                        textTransform: "uppercase",
                        mb: 1,
                    }}
                >
                    Account
                </Typography>
                <Typography
                    sx={{
                        fontFamily: "'Merriweather', serif",
                        fontSize: { xs: "2rem", md: "2.5rem" },
                        fontWeight: 700,
                        color: "text.primary",
                        letterSpacing: "-0.5px",
                        lineHeight: 1.2,
                    }}
                >
                    Profile & settings
                </Typography>
            </Box>

            {/* Two-column layout */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
                    gap: { xs: 3, md: 4 },
                    alignItems: "start",
                }}
            >
                {/* Left: sidebar */}
                <ProfileSidebar user={user} />

                {/* Right: stacked sections */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <ProfileSection
                        title="Profile information"
                        description="Update how your name appears across Draftly."
                    >
                        <ProfileInfoForm
                            user={user}
                            isUpdating={isUpdatingName}
                            onSubmit={updateName}
                        />
                    </ProfileSection>

                    <ProfileSection
                        title="Account"
                        description="Your email address used for signing in."
                    >
                        <ProfileAccountInfo user={user} />
                    </ProfileSection>

                    <ProfileSection
                        title="Security"
                        description="Change your password. You'll be asked for your current password."
                    >
                        <ProfileSecurityForm
                            isChanging={isChangingPassword}
                            onSubmit={changePassword}
                        />
                    </ProfileSection>

                    <ProfileSection title="Session">
                        <ProfileDangerZone onLogout={handleLogout} />
                    </ProfileSection>
                </Box>
            </Box>
        </Container>
    );
};

export default ProfilePage;