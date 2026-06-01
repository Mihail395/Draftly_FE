import { useState, useCallback } from "react";
import userAPI from "../api/userAPI";
import type { UpdateUserRequest, ChangePasswordRequest } from "../api/types/user";
import useSnackbar from "./useSnackbar";
import { getErrorMessage } from "../api/utils";

interface UseProfileReturn {
    isUpdatingName: boolean;
    isChangingPassword: boolean;
    updateName: (request: UpdateUserRequest) => Promise<void>;
    changePassword: (request: ChangePasswordRequest) => Promise<void>;
}

// Hook for profile-related operations: name update and password change.
const useProfile = (onProfileUpdate?: () => void): UseProfileReturn => {
    const { showSnackbar } = useSnackbar();
    const [isUpdatingName, setIsUpdatingName] = useState<boolean>(false);
    const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

    const updateName = useCallback(async (request: UpdateUserRequest) => {
        setIsUpdatingName(true);
        try {
            await userAPI.updateUser(request);
            showSnackbar("Profile updated successfully.", "success");
            if (onProfileUpdate)
                await onProfileUpdate();

        } catch (err) {
            showSnackbar(getErrorMessage(err, "Failed to update profile."), "error");
            throw err;
        } finally {
            setIsUpdatingName(false);
        }
    }, [showSnackbar, onProfileUpdate]);

    const changePassword = useCallback(async (request: ChangePasswordRequest) => {
        setIsChangingPassword(true);
        try {
            await userAPI.changePassword(request);
            showSnackbar("Password changed successfully.", "success");
        } catch (err) {
            showSnackbar(getErrorMessage(err, "Failed to change password."), "error");
            throw err;
        } finally {
            setIsChangingPassword(false);
        }
    }, [showSnackbar]);

    return {
        isUpdatingName,
        isChangingPassword,
        updateName,
        changePassword,
    };
};

export default useProfile;