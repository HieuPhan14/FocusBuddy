import { createContext, useState, useContext, useEffect } from 'react';

interface AuthProviderProps {
    children: React.ReactNode
}

interface User {
    id: string
    username: string
    email: string
    image_file: string | null
    image_path: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null);
const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);


    return (
        <AuthContext.Provider value={{user, token, login, logout, isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;