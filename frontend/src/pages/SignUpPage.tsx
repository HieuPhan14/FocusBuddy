import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { UserPrivate } from "../types/user";
import api from "../services/api";
import getErrorMessage from "../utils/errorUtils";
import { useAuth } from "../hooks/useAuth";
import type { LoginCredentials } from "../services/auth";

const SignUpPage = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [email, setEmail] = useState<string>("")

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);

    const { login, error: authError } = useAuth()
    const navigate = useNavigate()

    const passwordValidation = (password: string, confirmPassword: string): boolean => {
        if (password.length < 8 || password.length > 120){
            setError("Password length must be between (8-120) characters")
            return false
        }
        if (!/[A-Z]/.test(password)){
            setError("Password must contain at least one uppercase letter")
            return false
        }
        if (!/[0-9]/.test(password)){
            setError("Password must contain at least one number")
            return false
        }
        if (!/[!@#$%^&*]/.test(password)){
            setError("Password must contain at least one special character")
            return false
        }
        if (password !== confirmPassword){
            setError("Confirm password did not match.")
            return false
        }
        return true
    }

    const inputValidation = (username: string, email: string): boolean => {
        if (username.length < 1 || username.length > 50){
            setError("Please enter an username between (1-50) characters.")
            return false
        }
        
        if (email.length < 1 || email.length > 120){
            setError("Please enter an email between (1-120) characters.")
            return false
        }
        return true
    } 

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setError(null)

        if (!inputValidation(username, email))
            return

        if(!passwordValidation(password, confirmPassword))
            return

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
        {isLoading ? <p>Loading</p> :
        <div className="flex flex-col">
            <form
                className=""
                onSubmit={handleSubmit}
            >
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        className=""
                        value={username}
                        id="username"
                        type="text"
                        minLength={1}
                        maxLength={50}
                        onChange={(e) => {
                            setError(null)
                            setUsername(e.target.value)
                        }}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input 
                        className=""
                        value={email}
                        id="email"
                        type="email"
                        minLength={1}
                        maxLength={120}
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
                        minLength={8}
                        maxLength={120}
                        onChange={(e) => {
                            setError(null)
                            setPassword(e.target.value)
                        }}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input 
                        className=""
                        value={confirmPassword}
                        id="confirmPassword"
                        type="password"
                        minLength={8}
                        maxLength={120}
                        onChange={(e) => {
                            setError(null)
                            setConfirmPassword(e.target.value)
                        }}
                        required
                    />
                </div>

                {error && error.split("\n").map((msg, i) => 
                    <div key={i}>{msg}</div>)}

                {authError && authError.split("\n").map((msg, i) => 
                    <div key={i}>{msg}</div>)}

                <button 
                    type="submit"
                    className="border border-red-400"
                    disabled={isLoading}
                    >Submit
                </button>
            </form>

            <Link to="/login">Already have an account? Log in</Link>
            <Link to="/">Focus without sign up</Link>

        </div>
        }
    </>
    )
}

export default SignUpPage;