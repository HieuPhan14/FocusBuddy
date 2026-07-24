import { useState } from "react";
import Card from "../components/Card";
import Loading from "../components/Loading";
import getErrorMessage from "../utils/errorUtils";
import { Link, useNavigate } from "react-router-dom";
import { forgetPassword } from "../services/user";
import Modal from "../components/Modal";

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>("")
    const [isModal, setIsModal] = useState<boolean>(false)

    const navigate = useNavigate()

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setError(null)

        try{
            setIsLoading(true)

            await forgetPassword({"email": email})
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

                        <h1 className="text-center text-2xl font-display text-text mt-1">Forgot Password</h1>

                        <p className="font-display text-text">Enter your email address and we'll send you a link to reset your password.</p>

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

                        {error && <div className="text-error body-text inner-panel-row mt-3">{error}</div>}
                        <button
                            className="btn-primary mt-2"
                            type="submit"
                            disabled={isLoading}
                        >
                            Send Reset Link
                        </button>

                        <div className="flex body-text text-muted gap-1 mx-2 mt-4">
                            <p>Remember your password?</p>
                            <Link to="/login" className="hover:text-primary transition ml-1"> Login here</Link>
                        </div>

                    </form>

                    {isModal &&
                        <Modal title="Success" onClose={() => setIsModal(false)}>
                            <div className="flex flex-col items-center gap-3 text-center">
                                <p className="font-display text-text">If an account exists with this email, you will receive password reset instructions shortly.</p>
                                <p className="body-text text-muted text-sm">
                                    Click to go to login page
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

export default ForgotPassword;