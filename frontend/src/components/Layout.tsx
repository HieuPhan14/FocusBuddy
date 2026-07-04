import { useState } from "react";
import Background from "./Background";
import NavBar from "./NavBar"
import { Outlet } from "react-router-dom";

export type BackgroundTheme = "summer" | "night" | "beach"

const Layout = () => {
    const [theme, setTheme] = useState<BackgroundTheme>("summer")

    const handleTheme = (value: BackgroundTheme) => {
        setTheme(value)
    }
    return (
        <div className="flex flex-col h-screen relative">
            <Background />

            <div className="relative z-10">
                <NavBar themeOption={handleTheme}/>
            </div>

            <main className="flex-1 h-full relative z-10">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;