import type { ChangePasswordRequest } from "../types/password";
import type { UserPrivate, UserUpdate } from "../types/user";
import api from "./api";

const changeUsernameEmail = async (user_id: string, userUpdateInfo: UserUpdate): Promise<UserPrivate> => {
    const response = await api.patch<UserPrivate>(
        `/api/users/${user_id}`,
        userUpdateInfo
    )
    return response.data    
}

const changeProfilePicture = async (user_id: string, formData: FormData): Promise<UserPrivate> => {
    const response = await api.patch<UserPrivate>(
        `/api/users/${user_id}/picture`,
        formData,
        { headers: { "Content-Type": "multipart/form-data"}}
    )
    return response.data
}

const changePassword = async (password_data: ChangePasswordRequest) => {
    await api.patch(
        "/api/users/me/password",
        password_data
    )
}

const deleteUser = async (user_id: string) => {
    await api.delete(
        `/api/users/${user_id}`
    )
}

export {changeUsernameEmail, changeProfilePicture, changePassword, deleteUser};

