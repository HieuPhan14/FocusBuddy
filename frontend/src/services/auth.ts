import api from "./api"

export interface Token {
    access_token: string
    token_type: string
}

export interface LoginCredentials {
    username: string
    password: string
}

export interface UserPrivate {
    id: string
    username: string
    email: string
    image_file: string | null
    image_path: string
}

const getToken = async (form: LoginCredentials): Promise<Token> => {
    const params = new URLSearchParams({username: form.username, password: form.password})

    const response = await api.post<Token>(
        "/api/users/token",
        params
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