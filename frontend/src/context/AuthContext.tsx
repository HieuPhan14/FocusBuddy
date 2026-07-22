import { createContext, useState, useEffect } from 'react'
import { getUser, getToken, revokeRefreshToken } from "../services/auth"
import type { LoginCredentials } from "../services/auth"
import type { UserPrivate } from '../types/user'
import getErrorMessage from '../utils/errorUtils'

interface AuthProviderProps {
    children: React.ReactNode
}

interface AuthContextType {
    user: UserPrivate | null
    token: string | null
    login: (credentials: LoginCredentials) => Promise<void>
    logout: () => Promise<void>
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    isRestoring: boolean
    setUser: React.Dispatch<React.SetStateAction<UserPrivate | null>>
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);
const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<UserPrivate | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isRestoring, setIsRestoring] = useState<boolean>(true)

    useEffect(() => {
        const restore = async () => {
            const token_str = localStorage.getItem("token")
            if (token_str) {
                try{
                    const user = await getUser()
                    setToken(token_str)
                    setUser(user)
                } catch {
                    localStorage.removeItem("token")
                }
            } 
            setIsRestoring(false)
        }
        restore()
    }, [])


    const isAuthenticated = token !== null

    const login = async (credentials: LoginCredentials): Promise<void> => {
        try{
            setError(null)
            setIsLoading(true)
            const token = await getToken(credentials)
            localStorage.setItem("token", token.access_token)
            localStorage.setItem("refresh_token", token.refresh_token)
            const user = await getUser()
            setToken(token.access_token)
            setUser(user)
        }
        catch (error) {
            setError(getErrorMessage(error))
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async (): Promise<void> => {
        const refresh_token = localStorage.getItem("refresh_token")

        try{
            if (refresh_token)
                await revokeRefreshToken(refresh_token)
        } catch {
            // logout should still succeed even if this fails, placeholder only
        }
            setError(null)
            setToken(null)
            setUser(null)
            localStorage.removeItem("token")
            localStorage.removeItem("refresh_token")
    }

    return (
        <AuthContext.Provider value={{user, token, login, logout, isAuthenticated, isLoading, error, isRestoring, setUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider