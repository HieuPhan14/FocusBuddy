import { createContext, useState, useEffect } from 'react'
import { getUser, getToken } from "../services/auth"
import type { LoginCredentials, UserPrivate } from "../services/auth"
import { AxiosError } from 'axios'

interface AuthProviderProps {
    children: React.ReactNode
}

interface AuthContextType {
    user: UserPrivate | null
    token: string | null
    login: (credentials: LoginCredentials) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}

const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        return error.response?.data?.detail ?? "Something went wrong"
    } else if (error instanceof Error) {
        return error.message
    } else {
        return "Something went wrong"
    }
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);
const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<UserPrivate | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const restore = async () => {
            setIsLoading(true)
            const token_str = localStorage.getItem("token")
            if (token_str) {
                try{
                    const user = await getUser(token_str)
                    setToken(token_str)
                    setUser(user)
                } catch {
                    localStorage.removeItem("token")
                }
            } 
            setIsLoading(false)
        }
        restore()
    }, [])


    const isAuthenticated = token !== null

    const login = async (credentials: LoginCredentials): Promise<void> => {
        try{
            setError(null)
            setIsLoading(true)
            const token = await getToken(credentials)
            const user = await getUser(token.access_token)
            setToken(token.access_token)
            setUser(user)
            localStorage.setItem("token", token.access_token)
        }
        catch (error) {
            setError(getErrorMessage(error))
        } finally {
            setIsLoading(false)
        }
    }

    const logout = (): void => {
            setToken(null)
            setUser(null)
            localStorage.removeItem("token")
    }

    return (
        <AuthContext.Provider value={{user, token, login, logout, isAuthenticated, isLoading, error}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider