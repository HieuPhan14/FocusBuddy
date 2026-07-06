import { useEffect, useRef, useState } from "react";
import Background from "./Background";
import NavBar from "./NavBar"
import { Outlet } from "react-router-dom";
import clsx from "clsx";

export type BackgroundTheme = "summer" | "night" | "beach"

const Layout = () => {
    const [theme, setTheme] = useState<BackgroundTheme>(() => (localStorage.getItem("theme") as BackgroundTheme) ?? "summer")
    
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [volume, setVolume] = useState<number>(() => {
        const stored = localStorage.getItem("volume")
        return stored ? Number(stored) : 0.5
    }) 

    const handleTheme = (value: BackgroundTheme) => {
        setTheme(value)
        localStorage.setItem("theme", value)
    }

    const toggleMusic = () => {
        if (!isPlaying){
            audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
        } else {
            audioRef.current?.pause()
            setIsPlaying(false)
        }
    }

    useEffect(() => {
        if (audioRef.current){
            audioRef.current.volume = volume
        }
        localStorage.setItem("volume", String(volume))
    }, [volume])

    const handleVolume = (value: number): void => {
        setVolume(value)
    }

    return (
        <div className={clsx("flex flex-col h-screen relative", theme === "night" ? "theme-night" : "")}>
            <audio ref={audioRef} src="/audio/background_music.mp3" loop/>
            <Background theme={theme}/>

            <div className="relative z-10">
                <NavBar themeOption={handleTheme} theme={theme} 
                        toggleMusic={toggleMusic} isPlaying={isPlaying} volume={volume} handleVolume={handleVolume}/>
            </div>

            <main className="flex-1 h-full relative z-10">
                <Outlet context={{ audioRef, setIsPlaying }}/>
            </main>
        </div>
    )
}

export default Layout;