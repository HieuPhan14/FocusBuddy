import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { UserPrivate } from "../types/user";
import api from "../services/api";
import getErrorMessage from "../utils/errorUtils";
import { useAuth } from "../hooks/useAuth";
import type { LoginCredentials } from "../services/auth";
import passwordValidation from "../utils/passwordValidation";

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

                <div>
                    <label htmlFor="email">Email</label>
                    <input 
                        className=""
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

                <div>
                    <label htmlFor="password">Password</label>
                    <input 
                        className=""
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

                <div>
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input 
                        className=""
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
                    <div key={i}>{msg}</div>)}

                {passwordErr.length > 0 && passwordErr.map((msg, i) => 
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