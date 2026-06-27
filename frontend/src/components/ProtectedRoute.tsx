import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const ProtectedRoute = ({ children }: { children: React.ReactNode }): React.ReactNode => {
    const { isAuthenticated, isLoading } = useAuth()
    
    if (isLoading)
        return null

    if (!isAuthenticated) 
        return <Navigate to="/"/>
    
    return children 
}

export default ProtectedRoute;