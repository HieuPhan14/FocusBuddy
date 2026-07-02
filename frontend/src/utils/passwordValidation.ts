const passwordValidation = (password: string, confirmPassword: string): string[] => {
    const errs: string[] = []
    if (password.length < 8 || password.length > 120){
        errs.push("Password length must be between (8-120) characters")
    }
    if (!/[A-Z]/.test(password)){
        errs.push("Password must contain at least one uppercase letter")
    }
    if (!/[0-9]/.test(password)){
        errs.push("Password must contain at least one number")
    }
    if (!/[!@#$%^&*]/.test(password)){
        errs.push("Password must contain at least one special character")
    }
    if (password !== confirmPassword){
        errs.push("Confirm password did not match")
    }
    return errs
}

export default passwordValidation;
