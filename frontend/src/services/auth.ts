import api from "./api"

interface Token {
    access_token: string
    token_type: string
}

interface LoginCredentials {
    username: string
    password: string
}

const getToken = async (form: LoginCredentials): Promise<Token> => {
    const params = new URLSearchParams({username: form.username, password: form.password})

    const response = await api.post<Token>(
        "/users/token",
        params
    )
    return response.data
}

export default getToken;