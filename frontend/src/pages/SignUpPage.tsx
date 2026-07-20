import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { UserPrivate } from "../types/user";
import api from "../services/api";
import getErrorMessage from "../utils/errorUtils";
import { useAuth } from "../hooks/useAuth";
import type { LoginCredentials } from "../services/auth";
import passwordValidation from "../utils/passwordValidation";
import Loading from "../components/Loading";
import Card from "../components/Card";

const SignUpPage = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [email, setEmail] = useState<string>("")

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [passwordErr, setPasswordErr] = useState<string[]>([])

    const { login } = useAuth()
    const navigate = useNavigate()

    const inputValidation = (username: string, email: string): boolean => {
        if (username.length < 1 || username.length > 50){
            setError("Please enter an username between (1-50) characters")
            return false
        }
        
        if (email.length < 1 || email.length > 120){
            setError("Please enter an email between (1-120) characters")
            return false
        }
        return true
    } 

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setError(null)
        setPasswordErr([])

        if (!inputValidation(username, email))
            return

        const passErr = passwordValidation(password, confirmPassword)
        if(passErr.length > 0){
            setPasswordErr(passErr)
            return
        }

        try{
            setIsLoading(true)
            await api.post<UserPrivate>(
                "/api/users",
                {
                    username: username,
                    email: email,
                    password: password
                }
            ) 

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
            <div className="flex flex-col">
                <form
                    className="flex flex-col gap-4 m-2"
                    onSubmit={handleSubmit}
                >
                    <h1 className="text-center text-2xl font-display text-text mt-1">Sign Up</h1>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="username" className="font-display text-text text-lg">Username</label>
                        <input
                            className="pr-6 py-1 text-text pl-2 w-full bg-input border-2 border-border-light rounded-md body-text"
                            value={username}
                            id="username"
                            type="text"
                            autoComplete="off"
                            minLength={1}
                            maxLength={50}
                            onChange={(e) => {
                                setError(null)
                                setUsername(e.target.value)
                            }}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-display text-text text-lg">Email</label>
                        <input 
                            className="pr-6 py-1 text-text pl-2 w-full bg-input border-2 border-border-light rounded-md body-text"
                            value={email}
                            id="email"
                            type="email"
                            autoComplete="email"
                            minLength={1}
                            maxLength={120}
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
                            autoComplete="new-password"
                            minLength={8}
                            maxLength={120}
                            onChange={(e) => {
                                setError(null)
                                setPasswordErr([])
                                setPassword(e.target.value)
                            }}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="confirmPassword" className="font-display text-text text-lg">Confirm password</label>
                        <input 
                            className="pr-6 py-1 text-text pl-2 w-full bg-input border-2 border-border-light rounded-md body-text"
                            value={confirmPassword}
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            maxLength={120}
                            onChange={(e) => {
                                setError(null)
                                setPasswordErr([])
                                setConfirmPassword(e.target.value)
                            }}
                            required
                        />
                    </div>

                    {error && error.split("\n").map((msg, i) => 
                        <div key={i} className="text-error body-text inner-panel-row mt-3">{msg}</div>)}

                    {passwordErr.length > 0 && passwordErr.map((msg, i) => 
                        <div key={i} className="text-error body-text inner-panel-row mt-3">{msg}</div>)}

                    <button 
                        type="submit"
                        className="btn-primary mt-2"
                        disabled={isLoading}
                        >Submit
                    </button>
                </form>

                <div className="flex flex-col body-text text-muted gap-1 mx-2 mt-4">
                    <div className="flex">
                        <p>Already have an account?</p>
                        <Link to="/login" className="hover:text-primary transition ml-1">Log in</Link>
                    </div>

                    <Link to="/" className="hover:text-primary transition">Focus without sign up</Link>
                </div>

            </div>
            }
        </Card>
    </>
    )
}

export default SignUpPage;