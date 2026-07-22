import api from "./api"
import type { UserPrivate } from "../types/user"

export interface Token {
    access_token: string
    token_type: string
    refresh_token: string
}

export interface LoginCredentials {
    username: string
    password: string
}

const getToken = async (form: LoginCredentials): Promise<Token> => {
    const params = new URLSearchParams({username: form.username, password: form.password})

    const response = await api.post<Token>(
        "/api/users/token",
        params,
        {headers: {"Content-Type" : "application/x-www-form-urlencoded"}}
    )
    return response.data
}

const revokeRefreshToken = async (refresh_token: string): Promise<void> => {
    await api.post<void>(
        "/api/users/token/revoke",
        {"token": refresh_token}
    )
}

const getUser = async (): Promise<UserPrivate> => {
    const response = await api.get<UserPrivate>(
        "/api/users/me",
    )
    return response.data
}

export { getToken, getUser, revokeRefreshToken }