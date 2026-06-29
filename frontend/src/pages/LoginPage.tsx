import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { LoginCredentials } from "../services/auth";
import getErrorMessage from "../utils/errorUtils";

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const { login } = useAuth()
    const navigate = useNavigate()
    
    const validateFields = (email: string, password: string): boolean => {
        if (email.length === 0 || password.length === 0){
            setError("Please enter email and password")
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setError(null)

        if (!validateFields(email, password))
            return

        try {
            setIsLoading(true)

            const login_cre: LoginCredentials = {
                username: email,
                password: password
            }

            await login(login_cre)
            navigate("/")

        } catch (error){
            setError(getErrorMessage(error))

        } finally {
            setIsLoading(false)
        }
    }

    return (
    <>  
    {isLoading ? <p>Loading</p> :
        <div className="flex flex-col">
            <form
                className=""
                onSubmit={handleSubmit}
            >
                <div>
                    <label htmlFor="email">Email</label>
                    <input 
                        className=""
                        value={email}
                        type="email"
                        autoComplete="email"
                        id="email"
                        onChange={(e) => {
                            setError(null)
                            setEmail(e.target.value)
                        }}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input 
                        className=""
                        value={password}
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        onChange={(e) => {
                            setError(null)
                            setPassword(e.target.value)
                        }}
                        required
                    />
                </div>

                {error && <div>{error}</div>}
                <button
                    className="border border-black-400"
                    type="submit"
                    disabled={isLoading}
                >
                    Log in
                </button>

            </form>

            <Link to="/forgot-password">Forgot your password?</Link>
            <Link to="/signup">Don't have an account? Sign up</Link>
            <Link to="/">Focus without log in</Link>
        </div>
    }
    </>
    )
}

export default LoginPage;