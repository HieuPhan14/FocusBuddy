import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const ProtectedRoute = ({ children }: { children: React.ReactNode }): React.ReactNode => {
    const auth = useAuth()

    if (!auth)
        return null

    const { isAuthenticated } = auth
    if (!isAuthenticated) 
        return  <Navigate to="/"/>
    
    return children 
}

export default ProtectedRoute