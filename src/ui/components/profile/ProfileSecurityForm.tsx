import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Box,
    TextField,
    Button,
    Stack,
    IconButton,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";
import type { ChangePasswordRequest } from "../../../api/types/user";

interface ProfileSecurityFormProps {
    isChanging: boolean;
    onSubmit: (request: ChangePasswordRequest) => Promise<void>;
}

interface FormValues {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

const ProfileSecurityForm = ({ isChanging, onSubmit }: ProfileSecurityFormProps) => {
    const [showCurrent, setShowCurrent] = useState<boolean>(false);
    const [showNew, setShowNew] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const newPasswordValue = watch("newPassword");

    const onValidSubmit = async (values: FormValues) => {
        setSubmitting(true);
        try {
            await onSubmit(values);
            reset({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });
        } catch {
            // Errors handled in the hook via snackbar
        } finally {
            setSubmitting(false);
        }
    };

    const busy = submitting || isChanging;

    const visibilityAdornment = (visible: boolean, toggle: () => void) => (
        <InputAdornment position="end">
            <IconButton
                onClick={toggle}
                edge="end"
                size="small"
                disabled={busy}
                tabIndex={-1}
            >
                {visible ? (
                    <VisibilityOffOutlinedIcon fontSize="small" />
                ) : (
                    <VisibilityOutlinedIcon fontSize="small" />
                )}
            </IconButton>
        </InputAdornment>
    );

    return (
        <Box component="form" onSubmit={handleSubmit(onValidSubmit)} noValidate>
            <Stack spacing={2.5} sx={{ mb: 3 }}>
                <TextField
                    label="Current password"
                    type={showCurrent ? "text" : "password"}
                    fullWidth
                    disabled={busy}
                    autoComplete="current-password"
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword?.message}
                    slotProps={{
                        input: {
                            endAdornment: visibilityAdornment(showCurrent, () =>
                                setShowCurrent(!showCurrent)
                            ),
                        },
                    }}
                    {...register("currentPassword", {
                        required: "Current password is required",
                    })}
                />

                <TextField
                    label="New password"
                    type={showNew ? "text" : "password"}
                    fullWidth
                    disabled={busy}
                    autoComplete="new-password"
                    error={!!errors.newPassword}
                    helperText={
                        errors.newPassword?.message ?? "At least 8 characters"
                    }
                    slotProps={{
                        input: {
                            endAdornment: visibilityAdornment(showNew, () =>
                                setShowNew(!showNew)
                            ),
                        },
                    }}
                    {...register("newPassword", {
                        required: "New password is required",
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                        },
                        maxLength: {
                            value: 100,
                            message: "Password cannot exceed 100 characters",
                        },
                        validate: (value, formValues) =>
                            value !== formValues.currentPassword ||
                            "New password must differ from current password",
                    })}
                />

                <TextField
                    label="Confirm new password"
                    type={showConfirm ? "text" : "password"}
                    fullWidth
                    disabled={busy}
                    autoComplete="new-password"
                    error={!!errors.confirmNewPassword}
                    helperText={errors.confirmNewPassword?.message}
                    slotProps={{
                        input: {
                            endAdornment: visibilityAdornment(showConfirm, () =>
                                setShowConfirm(!showConfirm)
                            ),
                        },
                    }}
                    {...register("confirmNewPassword", {
                        required: "Please confirm your new password",
                        validate: (value) =>
                            value === newPasswordValue || "Passwords do not match",
                    })}
                />
            </Stack>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={busy}
                    startIcon={
                        busy ? (
                            <CircularProgress size={16} thickness={5} sx={{ color: "white" }} />
                        ) : (
                            <LockResetIcon />
                        )
                    }
                    sx={{
                        fontWeight: 700,
                        textTransform: "none",
                        px: 3,
                    }}
                >
                    {busy ? "Changing..." : "Change password"}
                </Button>
            </Box>
        </Box>
    );
};

export default ProfileSecurityForm;