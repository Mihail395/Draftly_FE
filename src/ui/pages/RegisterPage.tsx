import React, { useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Link,
    CircularProgress,
    InputAdornment,
    IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import authAPI from "../../api/authAPI";
import { getErrorMessage } from "../../api/utils";
import useAuth from "../../hooks/useAuth";
import useSnackbar from "../../hooks/useSnackbar";
import type { RegisterRequest } from "../../api/types/auth";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const { showSnackbar } = useSnackbar();
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const {
        register,
        handleSubmit,
        setError,
        resetField,
        clearErrors,
        formState: { errors },
    } = useForm<RegisterRequest>();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data: RegisterRequest) => {
        setIsLoading(true);
        try {
            const response = await authAPI.register(data);
            login(response.token, {
                email: response.email,
                firstName: response.firstName,
                lastName: response.lastName,
            });
            navigate("/dashboard", { replace: true });
        } catch (err) {
            const message = getErrorMessage(err, "Registration failed. Please try again.");

            if (message.toLowerCase().includes("email is already registered")) {
                // Clear the email value first
                resetField("email");
                // Then set the error after a tiny delay so React Hook Form
                // processes the resetField first, otherwise the error gets cleared
                setTimeout(() => {
                    setError("email", {
                        type: "manual",
                        message: "This email is already registered",
                    });
                }, 0);
            } else {
                showSnackbar(message, "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                background: `
                    radial-gradient(ellipse at 20% 50%, rgba(43, 87, 154, 0.12) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 20%, rgba(68, 114, 196, 0.10) 0%, transparent 55%),
                    radial-gradient(ellipse at 60% 80%, rgba(24, 90, 189, 0.08) 0%, transparent 50%),
                    #F5F7FB
                `,
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                        radial-gradient(ellipse at 70% 30%, rgba(43, 87, 154, 0.10) 0%, transparent 60%),
                        radial-gradient(ellipse at 30% 70%, rgba(68, 114, 196, 0.12) 0%, transparent 55%),
                        radial-gradient(ellipse at 80% 60%, rgba(24, 90, 189, 0.09) 0%, transparent 50%)
                    `,
                    opacity: 0,
                    animation: "fadeGradient 12s ease-in-out infinite alternate",
                    pointerEvents: "none",
                },
                "@keyframes fadeGradient": {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
                p: 2,
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    maxWidth: 460,
                    borderRadius: 3,
                    boxShadow: "0px 8px 40px rgba(43, 87, 154, 0.12)",
                    borderTop: "3px solid",
                    borderColor: "primary.main",
                    position: "relative",
                    zIndex: 1,
                    animation: "cardEntrance 0.4s ease forwards",
                    "@keyframes cardEntrance": {
                        "0%": {
                            opacity: 0,
                            transform: "translateY(16px)",
                        },
                        "100%": {
                            opacity: 1,
                            transform: "translateY(0)",
                        },
                    },
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    {/* Logo */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            mb: 3,
                        }}
                    >
                        <EditNoteIcon sx={{ color: "primary.main", fontSize: 30 }} />
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: "'Merriweather', serif",
                                fontWeight: 700,
                                color: "text.primary",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Draftly
                        </Typography>
                    </Box>

                    {/* Heading */}
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: "'Merriweather', serif",
                            fontWeight: 700,
                            color: "text.primary",
                            textAlign: "center",
                            mb: 0.5,
                        }}
                    >
                        Create your account
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                            textAlign: "center",
                            mb: 3,
                        }}
                    >
                        Start writing and collaborating today
                    </Typography>

                    {/* Form */}
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        {/* First and Last name on same row */}
                        <Grid container spacing={1.5}>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    label="First Name"
                                    fullWidth
                                    autoComplete="given-name"
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                    {...register("firstName", {
                                        required: "First name is required",
                                    })}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    label="Last Name"
                                    fullWidth
                                    autoComplete="family-name"
                                    error={!!errors.lastName}
                                    helperText={errors.lastName?.message}
                                    {...register("lastName", {
                                        required: "Last name is required",
                                    })}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            autoComplete="email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: "Must be a valid email address",
                                },
                                // Clear the "already registered" error when user starts typing
                                // Other errors (required, pattern) will be re-validated on next submit
                                onChange: () => {
                                    if (errors.email?.type === "manual") {
                                        clearErrors("email");
                                    }
                                },
                            })}
                        />

                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            autoComplete="new-password"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                edge="end"
                                                size="small"
                                            >
                                                {showPassword
                                                    ? <VisibilityOffOutlinedIcon fontSize="small" />
                                                    : <VisibilityOutlinedIcon fontSize="small" />
                                                }
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters",
                                },
                            })}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isLoading}
                            sx={{
                                mt: 1,
                                py: 1.2,
                                fontSize: "0.95rem",
                            }}
                        >
                            {isLoading
                                ? <CircularProgress size={22} color="inherit" />
                                : "Create Account"
                            }
                        </Button>
                    </Box>

                    {/* Login link */}
                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: "center",
                            mt: 3,
                            color: "text.secondary",
                        }}
                    >
                        Already have an account?{" "}
                        <Link
                            component={RouterLink}
                            to="/login"
                            sx={{
                                color: "primary.main",
                                fontWeight: 600,
                                textDecoration: "none",
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            Sign in
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default RegisterPage;