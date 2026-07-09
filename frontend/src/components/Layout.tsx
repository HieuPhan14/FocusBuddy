import { useEffect, useRef, useState } from "react";
import Background from "./Background";
import NavBar from "./NavBar"
import { Outlet } from "react-router-dom";
import clsx from "clsx";
import { useTheme } from "../hooks/useTheme";

const Layout = () => {
    const { theme } = useTheme()
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [volume, setVolume] = useState<number>(() => {
        const stored = localStorage.getItem("volume")
        return stored ? Number(stored) : 0.5
    }) 

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
            <Background />

            <div className="relative z-20">
                <NavBar toggleMusic={toggleMusic} isPlaying={isPlaying} volume={volume} handleVolume={handleVolume}/>
            </div>

            <main className="flex-1 h-full relative z-10">
                <Outlet context={{ audioRef, setIsPlaying }}/>
            </main>
        </div>
    )
}

export default Layout;