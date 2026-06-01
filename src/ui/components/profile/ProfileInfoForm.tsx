import { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, TextField, Button, Stack, CircularProgress } from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import type { UserResponse, UpdateUserRequest } from "../../../api/types/user";

interface ProfileInfoFormProps {
    user: UserResponse;
    isUpdating: boolean;
    onSubmit: (request: UpdateUserRequest) => Promise<void>;
}

interface FormValues {
    firstName: string;
    lastName: string;
}

const ProfileInfoForm = ({ user, isUpdating, onSubmit }: ProfileInfoFormProps) => {
    const [submitting, setSubmitting] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
        },
    });

    const watchedFirstName = watch("firstName");
    const watchedLastName = watch("lastName");
    const isDirty =
        watchedFirstName !== user.firstName || watchedLastName !== user.lastName;

    const onValidSubmit = async (values: FormValues) => {
        setSubmitting(true);
        try {
            await onSubmit({
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
            });
            // Reset form's "default" to the new values so isDirty becomes false
            reset({
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
            });
        } catch {
            // Errors handled in the hook via snackbar
        } finally {
            setSubmitting(false);
        }
    };

    const busy = submitting || isUpdating;

    return (
        <Box component="form" onSubmit={handleSubmit(onValidSubmit)} noValidate>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <TextField
                    label="First name"
                    fullWidth
                    disabled={busy}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    {...register("firstName", {
                        required: "First name is required",
                        maxLength: {
                            value: 50,
                            message: "First name cannot exceed 50 characters",
                        },
                    })}
                />
                <TextField
                    label="Last name"
                    fullWidth
                    disabled={busy}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    {...register("lastName", {
                        required: "Last name is required",
                        maxLength: {
                            value: 50,
                            message: "Last name cannot exceed 50 characters",
                        },
                    })}
                />
            </Stack>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={!isDirty || busy}
                    startIcon={
                        busy ? (
                            <CircularProgress size={16} thickness={5} sx={{ color: "white" }} />
                        ) : (
                            <SaveOutlinedIcon />
                        )
                    }
                    sx={{
                        fontWeight: 700,
                        textTransform: "none",
                        px: 3,
                    }}
                >
                    {busy ? "Saving..." : "Save changes"}
                </Button>
            </Box>
        </Box>
    );
};

export default ProfileInfoForm;