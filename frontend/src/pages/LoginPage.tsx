import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { LoginCredentials } from "../services/auth";
import getErrorMessage from "../utils/errorUtils";
import Loading from "../components/Loading";
import Card from "../components/Card";

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
        <Card>
            {isLoading ? <Loading /> :
                <div>
                    <form
                        className="flex flex-col gap-4 m-2"
                        onSubmit={handleSubmit}
                    >

                        <h1 className="text-center text-2xl font-display text-text mt-1">Log In</h1>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="font-display text-text text-lg">Email</label>
                            <input 
                                className="pr-6 py-1 text-text pl-2 w-full bg-input border-2 border-border-light rounded-md body-text"
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

                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="font-display text-text text-lg">Password</label>
                            <input 
                                className="pr-6 py-1 text-text pl-2 w-full bg-input border-2 border-border-light rounded-md body-text"
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

                        {error && <div className="text-error body-text inner-panel-row mt-3">{error}</div>}
                        <button
                            className="btn-primary mt-2"
                            type="submit"
                            disabled={isLoading}
                        >
                            Log In
                        </button>

                    </form>

                    <div className="flex flex-col body-text text-muted gap-1 mx-2 mt-4">
                        <Link to="/forgot-password" className="hover:text-primary transition">Forgot your password?</Link>
                        
                        <div className="flex">
                            <p>Don't have an account?</p>
                            <Link to="/signup" className="hover:text-primary transition ml-1"> Sign up</Link>
                        </div>

                        <Link to="/" className="hover:text-primary transition">Focus without log in</Link>
                    </div>
                </div>
            }
        </Card>  
    </>
    )
}

export default LoginPage;