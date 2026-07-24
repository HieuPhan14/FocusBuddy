export interface ChangePasswordRequest {
    current_password: string
    new_password: string
}

export interface ForgetPasswordRequest{
    email: string
}

export interface ResetPasswordRequest{
    token: string
    new_password: string
}