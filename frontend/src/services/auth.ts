import api from "./api"
import type { UserPrivate } from "../types/user"

export interface Token {
    access_token: string
    token_type: string
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

const getUser = async (token: string): Promise<UserPrivate> => {
    const response = await api.get<UserPrivate>(
        "/api/users/me",
        {headers: {Authorization: `Bearer ${token}`}}
    )
    return response.data
}

export { getToken, getUser }