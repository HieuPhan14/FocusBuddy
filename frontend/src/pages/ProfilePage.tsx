import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { changePassword, changeProfilePicture, changeUsernameEmail, deleteUser } from "../services/user";
import getErrorMessage from "../utils/errorUtils";
import passwordValidation from "../utils/passwordValidation";


const ProfilePage = () => {
    const { user, setUser, logout } = useAuth()
    const [isSuccessfulUpdateProfule, setIsSuccessfulUpdateProfule] = useState<boolean>(false)

    const [username, setUsername] = useState<string>(user?.username ?? "")
    const [email, setEmail] = useState<string>(user?.email ?? "")
    const [errorUsernameEmail, setErrorUsernameEmail] = useState<string>("")

    const [fileUpload, setFileUpload] = useState<FormData | null>(null)
    const [errorProfilePicture, setErrorProfilePicture] = useState<string>("")

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
            setIsSuccessfulUpdateProfule(true)
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
                setIsSuccessfulUpdateProfule(true)
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
            logout()
            
        } catch (error) {
            setErrorPassword([getErrorMessage(error)])
        }
    }

    const handleDeleteUser = async () => {
        try{
            await deleteUser(user.id)
            logout()
        } catch (error){
            setErrorDeleteUser(getErrorMessage(error))
        }
    }

    return (
    <>
        {user &&
        <div className="h-full flex flex-col justify-between">
            <div>Account Settings</div>

            <div className="flex flex-col">
                <img 
                    className="rounded-full"
                    src={user.image_path}
                    width={100}
                    height={100}
                    loading="lazy"
                    alt="Profile Picture"
                />
                <div>{user.username}</div>
                <div>{user.email}</div>
            </div>

            <form
                className=""
                onSubmit={handleChangeUsernameEmail}
            >
                <div>Update Profile</div>
                <div>
                    <label htmlFor="username">Username</label>
                    <input 
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

                <div>
                    <label htmlFor="email">Email</label>
                    <input 
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

                {isSuccessfulUpdateProfule && <div>Profile Update Successfully</div>}
                {errorUsernameEmail && <div>{errorUsernameEmail}</div>}

                <button 
                    className="border border-red-400"
                    type="submit"
                >
                    Update Profile
                </button>
            </form>

            <form
                className=""
                onSubmit={handleProfilePicture}
            >
                <div className="">Profile Picture</div>

                <div className="flex">
                    <input 
                        type="file"
                        accept="image/jpeg, image/png, image/gif, image/webp"
                        onChange={(e) => {
                            const form = new FormData()
                            const file = e.target.files?.[0]

                            if (!file)
                                return

                            form.append("file", file)
                            setFileUpload(form)
                        }}
                    />

                    <button 
                        className="border border-red-400"
                        type="submit"
                    >
                            Upload
                    </button>
                </div>

                <div>Maximum file size: 5MB. Supported formats: JPEG, PNG, GIF, WebP</div>

                {errorProfilePicture && <div>{errorProfilePicture}</div>}
            </form>

            <form
                className=""
                onSubmit={handlePasswordChange}
            >
                <div>Change Password</div>
                <div>
                    <label htmlFor="curPass">Current Password</label>
                    <input 
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

                <div>
                    <label htmlFor="newPass">New Password</label>
                    <input 
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

                <div>
                    <label htmlFor="confirmNewPass">Confirm New Password</label>
                    <input 
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

                {errorPassword.length > 0 && errorPassword.map((err, i) => 
                    <div key={i}>{err}</div>
                )}

                <button 
                    className="border border-red-400"
                    type="submit"
                >
                    Change Password
                </button>
            </form>
            
            <button 
                    className="border border-red-400"
                    type="submit"
                    onClick={logout}
                >
                    Logout
            </button>
            
            <div>
                <div>Once you delete your account, there is no going back. All your stats will also be deleted.</div>
                
                <button
                    className="border border-red-400"
                    onClick={() => setIsDeleting(true)}
                >
                    Delete Account
                </button>
                
                {isDeleting && 
                    <div>
                        <div>Are you sure you want to delete your account? This action cannot be undone. All your posts will be permanently deleted</div>

                        <button 
                            className="border border-red-400"
                            onClick={handleDeleteUser}
                        >
                            Delete Account
                        </button>

                        <button
                            className="border border-red-400"
                            onClick={() => setIsDeleting(false)}
                        >
                            Cancel
                        </button>
                    </div>
                
                }

                {errorDeleteUser && <div>{errorDeleteUser}</div>}
            </div>
        </div>
        }
    </>
    );
};

export default ProfilePage;