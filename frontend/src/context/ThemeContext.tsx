import { createContext, useState } from "react"

interface ThemeProviderProps {
    children: React.ReactNode
}

export type BackgroundTheme = "summer" | "night" | "beach"

interface ThemeContextType {
    theme: BackgroundTheme
    setTheme: React.Dispatch<React.SetStateAction<BackgroundTheme>>
    handleTheme: (value: BackgroundTheme) => void
    lightMode: "dark" | "light"
}

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextType | null>(null)
const ThemeProvider = ( {children}: ThemeProviderProps) => {
    const [theme, setTheme] = useState<BackgroundTheme>(() => (localStorage.getItem("theme") as BackgroundTheme) ?? "summer")
    const lightMode = theme === "night" ? "dark" : "light"

    const handleTheme = (value: BackgroundTheme) => {
        setTheme(value)
        localStorage.setItem("theme", value)
    }

    return (
        <ThemeContext.Provider value={{theme, setTheme, handleTheme, lightMode}}>
            {children}
        </ThemeContext.Provider>
    )
} 

export default ThemeProvider