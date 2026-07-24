import { useState } from "react";
import Card from "../components/Card";
import { useNavigate, useSearchParams } from "react-router-dom";
import getErrorMessage from "../utils/errorUtils";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import passwordValidation from "../utils/passwordValidation";
import { resetPassword } from "../services/user";

const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [isModal, setIsModal] = useState<boolean>(false)

    const [searchParam] = useSearchParams()
    const token = searchParam.get("token")

    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [passwordErr, setPasswordErr] = useState<string[]>([])

    const navigate = useNavigate()

    if (!token){
        return (
            <Card>
                <div>
                    <div>This reset link is invalid or missing.</div>
                    <button
                        onClick={() => navigate("/forgot-password")}
                        className="btn-primary"
                    >
                        Forgot Password Page  
                    </button>
                </div>
            </Card>
        )
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setError(null)
        setPasswordErr([])

        const passErr = passwordValidation(password, confirmPassword)
        if(passErr.length > 0){
            setPasswordErr(passErr)
            return
        }

        try{
            setIsLoading(true)
            await resetPassword({"token": token, "new_password": password})
            setIsModal(true)
            
        } catch (error) {
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

                        <h1 className="text-center text-2xl font-display text-text mt-1">Reset Password</h1>

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

                        {error && <div className="text-error body-text inner-panel-row mt-3">{error}</div>}
                        {passwordErr.length > 0 && passwordErr.map((msg, i) => 
                            <div key={i} className="text-error body-text inner-panel-row mt-3">{msg}</div>
                        )}

                        <button 
                            type="submit"
                            className="btn-primary mt-2"
                            disabled={isLoading}
                            >Reset Password
                        </button>
                        
                    </form>
                    
                    {isModal &&
                        <Modal title="Success" onClose={() => setIsModal(false)}>
                            <div className="flex flex-col items-center gap-3 text-center">
                                <p className="font-display text-text">Password changed successfully. 🥳🎉🎉</p>
                                <p className="body-text text-muted text-sm">
                                    Log in with your new password.
                                </p>

                                <button
                                    onClick={() => navigate("/login")}
                                    className="btn-primary"
                                >
                                    Log In  
                                </button>
                            </div>

                        </Modal>
                    }
                </div>
            }
        </Card>
    </>
    )
}

export default ResetPassword;