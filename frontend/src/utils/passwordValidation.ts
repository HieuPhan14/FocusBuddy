const passwordValidation = (password: string, confirmPassword: string): string[] => {
    const errs: string[] = []
    
    const missing: string[] = []
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*]/.test(password)

    if(!hasUppercase)
        missing.push("one uppercase letter [A-Z]")

    if(!hasNumber)
        missing.push("one number [0-9]")

    if(!hasSpecialChar)
        missing.push("one special character [!@#$%^&*]")

    if (missing.length > 0){
        const joined = missing.length === 1
            ? missing[0]
            : missing.slice(0, -1).join(", ") + (missing.length === 2 ? " and " : ", and ") + missing[missing.length - 1]

        errs.push(`Password must contain at least ${joined}`)
    }

    if (password !== confirmPassword){
        errs.push("Confirm password did not match")
    }

    return errs
}

export default passwordValidation;
