import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { changePassword, changeProfilePicture, changeUsernameEmail, deleteUser } from "../services/user";
import getErrorMessage from "../utils/errorUtils";
import passwordValidation from "../utils/passwordValidation";
import BigCard from "../components/BigCard";
import Modal from "../components/Modal";
import PixelIcon from "../components/PixelIcon";


const ProfilePage = () => {
    const { user, setUser, logout } = useAuth()
    const [isSuccessfulUpdateProfile, setIsSuccessfulUpdateProfile] = useState<boolean>(false)

    const [username, setUsername] = useState<string>(user?.username ?? "")
    const [email, setEmail] = useState<string>(user?.email ?? "")
    const [errorUsernameEmail, setErrorUsernameEmail] = useState<string>("")

    const [fileName, setFileName] = useState<string>("")
    const [fileUpload, setFileUpload] = useState<FormData | null>(null)
    const [errorProfilePicture, setErrorProfilePicture] = useState<string>("")

    const [isPasswordChangeSuccess, setIsPasswordChangeSuccess] = useState<boolean>(false)
    const [currentPassword, setCurrentPassword] = useState<string>("")
    const [newPassword, setNewPassword] = useState<string>("")
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("")
    const [errorPassword, setErrorPassword] = useState<string[]>([])

    const [errorDeleteUser, setErrorDeleteUser] = useState<string>("")
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    if (!user)
        return null

    const handleChangeUsernameEmail = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        
        try{
            const response = await changeUsernameEmail(
                user.id, 
                {username: username !== "" ? username : null, 
                email: email !== "" ? email : null}        
            )
            setUser(response)
            setUsername(response.username)
            setEmail(response.email)
            setIsSuccessfulUpdateProfile(true)
        }
        catch (error){
            setErrorUsernameEmail(getErrorMessage(error))
        }
    }
    
    const handleProfilePicture = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try{
            if (fileUpload){
                const response = await changeProfilePicture(user.id, fileUpload)
                setIsSuccessfulUpdateProfile(true)
                setUser(response)
            }
        } catch (error) {
            setErrorProfilePicture(getErrorMessage(error))
        }
    }

    const handlePasswordChange = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        const passErr = passwordValidation(newPassword, confirmNewPassword)

        if (passErr.length > 0){
            setErrorPassword(passErr)
            return
        }
        
        try{
            await changePassword({
                current_password: currentPassword, 
                new_password: newPassword
            })
            setIsPasswordChangeSuccess(true)
            
        } catch (error) {
            setErrorPassword([getErrorMessage(error)])
        }
    }

    const handleDeleteUser = async () => {
        try{
            await deleteUser(user.id)
            await logout()
        } catch (error){
            setErrorDeleteUser(getErrorMessage(error))
        }
    }

    return (
    <>
        <BigCard>    
            
            <div className="flex flex-col gap-5 mx-2 pb-5">
                <h1 className="text-center text-2xl font-display text-text mt-3">Account Settings</h1>

                <div className="flex items-center gap-4 mx-2 inner-panel-row">
                    <img 
                        className="rounded-md border-2 border-border"
                        src={user.image_path}
                        width={100}
                        height={100}
                        loading="lazy"
                        alt="Profile Picture"
                    />

                    <div className="flex flex-col gap-1">
                        <div className="font-display text-text text-lg">{user.username}</div>
                        <div className="text-muted body-text">{user.email}</div>
                    </div>
                </div>

                <form
                    className="flex flex-col gap-1 mx-2 inner-panel-row"
                    onSubmit={handleChangeUsernameEmail}
                >

                    <div className="font-display text-text text-xl">Update Profile</div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="username" className="font-display text-text text-lg">Username</label>
                        <input 
                            className="pr-6 py-1 text-text pl-2 w-full bg-input border-2 border-border-light rounded-md body-text"
                            type="text"
                            value={username}
                            id="username"
                            minLength={1}
                            maxLength={50}
                            onChange={(e) => {
                                setErrorUsernameEmail("")
                                setUsername(e.target.value)
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-display text-text text-lg">Email</label>
                        <input 
                            className="pr-6 py-1 text-text pl-2 w-full bg-input border-2 border-border-light rounded-md body-text"
                            type="email"
                            value={email}
                            id="email"
                            minLength={1}
                            maxLength={120}
                            onChange={(e) => {
                                setErrorUsernameEmail("")
                                setEmail(e.target.value)
                            }}
                        />
                    </div>

                    {isSuccessfulUpdateProfile && 
                    <Modal title="Profile Update" onClose={() => setIsSuccessfulUpdateProfile(false)}>
                        <div className="flex flex-col items-center gap-3 text-center">
                            
                            <div className="flex gap-1">
                                <p className="font-display text-text">
                                    Your profile was updated successfully
                                </p>
                                <PixelIcon name="Check"/>
                            </div>

                            <button
                                onClick={() => setIsSuccessfulUpdateProfile(false)}
                                className="btn-primary"
                                type="button"
                            >
                                Keep updating
                            </button>
                        </div>
                    </Modal>
                    }

                    {errorUsernameEmail && <div className="text-error body-text inner-panel-row mt-3">{errorUsernameEmail}</div>}

                    <button 
                        className="btn-primary my-4"
                        type="submit"
                    >
                        Update Profile
                    </button>
                </form>

                <form
                    className="flex flex-col gap-1 mx-2 inner-panel-row"
                    onSubmit={handleProfilePicture}
                >
                    <div className="font-display text-text text-xl">Profile Picture</div>

                    <div className="flex items-center gap-2">
                        <input 
                            id="fileUpload"
                            className="hidden"
                            type="file"
                            accept="image/jpeg, image/png, image/gif, image/webp"
                            onChange={(e) => {
                                const form = new FormData()
                                const file = e.target.files?.[0]

                                if (!file)
                                    return

                                form.append("file", file)
                                setFileUpload(form)
                                setFileName(file.name)
                            }}
                        />

                        <div>
                            <label htmlFor="fileUpload" className="btn-secondary cursor-pointer !rounded-r-none">
                                Choose File
                            </label>

                            <span 
                                className="text-text font-display bg-input border-2 border-l-0 border-border rounded-md rounded-l-none px-3 py-2"

                                >{fileName || "No file chosen"}
                            </span>
                        </div>

                        <button 
                            className="btn-primary"
                            type="submit"
                        >
                                Upload
                        </button>
                    </div>

                    <div className="text-text font-display">Maximum file size: <span className="mx-1 text-text text-lg font-number">5</span>MB. Supported formats: JPEG, PNG, GIF, WebP</div>

                    {errorProfilePicture && <div className="text-error body-text inner-panel-row mt-3">{errorProfilePicture}</div>}
                </form>

                <form
                    className="flex flex-col gap-1 mx-2 inner-panel-row"
                    onSubmit={handlePasswordChange}
                >
                    <div className="font-display text-text text-xl">Change Password</div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="curPass" className="font-display text-text text-lg">Current Password</label>
                        <input 
                            className="pr-6 py-1 text-text pl-2 w-full bg-input border-2 border-border-light rounded-md body-text"
                            id="curPass"
                            value={currentPassword}
                            type="password"
                            autoComplete="off"
                            minLength={8}
                            required
                            onChange={(e) => {
                                setErrorPassword([])
                                setCurrentPassword(e.target.value)
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="newPass" className="font-display text-text text-lg">New Password</label>
                        <input 
                            className="pr-6 py-1 text-text pl-2 w-full bg-input border-2 border-border-light rounded-md body-text"
                            id="newPass"
                            value={newPassword}
                            type="password"
                            minLength={8}
                            autoComplete="new-password"
                            required
                            onChange={(e) => {
                                setErrorPassword([])
                                setNewPassword(e.target.value)
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="confirmNewPass" className="font-display text-text text-lg">Confirm New Password</label>
                        <input 
                            className="pr-6 py-1 text-text pl-2 w-full bg-input border-2 border-border-light rounded-md body-text"
                            id="confirmNewPass"
                            value={confirmNewPassword}
                            type="password"
                            autoComplete="new-password"
                            required
                            onChange={(e) => {
                                setErrorPassword([])
                                setConfirmNewPassword(e.target.value)
                            }}
                        />
                    </div>

                    {isPasswordChangeSuccess && 
                    <Modal title="Password Update">
                        <div className="flex flex-col items-center gap-3 text-center">
                            
                            <div className="flex gap-1">
                                <p className="font-display text-text">
                                    Your password was changed. Please log in again.
                                </p>
                                <PixelIcon name="Check"/>
                            </div>

                            <button
                                onClick={logout}
                                className="btn-primary"
                                type="button"
                            >
                                Log In
                            </button>
                        </div>
                    </Modal>
                    }


                    {errorPassword.length > 0 && errorPassword.map((err, i) => 
                        <div key={i} className="text-error body-text inner-panel-row mt-3">{err}</div>
                    )}

                    <button 
                        className="btn-primary my-4"
                        type="submit"
                    >
                        Change Password
                    </button>
                </form>
                
                <div className="flex flex-col gap-1 mx-2 inner-panel-row">
                    <div className="font-display text-text text-xl">Danger Zone</div>

                    <div className="text-text font-display">Once you delete your account, there is no going back. All your stats will also be deleted.</div>
                    
                    <button
                        className="btn-danger my-4"
                        type="button"
                        onClick={() => setIsDeleting(true)}
                    >
                        Delete Account
                    </button>
                    
                    {isDeleting && 
                        <Modal title="Delete account" onClose={() => setIsDeleting(false)}>
                            <div className="flex flex-col items-center gap-3 text-center">
                                <p className="font-display text-text">
                                    You want to delete your account? 😢😭
                                </p>
                                <p className="font-display text-text">
                                    This action can't go back.
                                </p>
                                <button
                                    onClick={handleDeleteUser}
                                    className="btn-primary"
                                >
                                    Delete
                                </button>
                            </div>
                        </Modal>
                    }

                    {errorDeleteUser && <div className="text-error body-text inner-panel-row mt-3">{errorDeleteUser}</div>}
                </div>
                
                <div className="flex flex-col mx-2">
                    <button 
                            className="btn-secondary"
                            type="button"
                            onClick={logout}
                        >
                            Logout
                    </button>
                </div>
                
            </div>
            
        </BigCard>
    </>
    );
};

export default ProfilePage;