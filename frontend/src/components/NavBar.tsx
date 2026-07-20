import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PixelIcon from "./PixelIcon";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import type { BackgroundTheme } from "../context/ThemeContext";

interface NavBarProps {
    toggleMusic: () => void
    isPlaying: boolean
    volume: number
    handleVolume: (value: number) => void
    isCardHiding: boolean
    toggleCardHide: () => void
}

const NavBar = ({ toggleMusic, isPlaying, volume, handleVolume, isCardHiding, toggleCardHide }: NavBarProps) => {
    const { theme, handleTheme} = useTheme()

    const {isAuthenticated} = useAuth()
    const [isVolumeOpen, setIsVolumeOpen] = useState<boolean>(false)
    const popoverRef = useRef<HTMLDivElement>(null)

    const location = useLocation()

    const themeSelect = (
        <div className="relative">
            <select
                value={theme}
                className="[appearance:none] border-2 border-transparent hover:border-border transition hover:bg-input rounded-sm px-2 py-1 text-text pr-6"
                onChange={(e) => {
                    handleTheme(e.target.value as BackgroundTheme)
                }}
            >
                <option value="summer">Summer</option>
                <option value="beach">Beach</option>
                <option value="night">Night</option>
            </select>

            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <PixelIcon name="Chevron-Arrow-Down" size="w-2 h-[5px]"/>
            </div>
        </div>
    )

    const volumeAdjust = () => {
        setIsVolumeOpen(!isVolumeOpen)
    }
    
    useEffect(() => {
        if (!isVolumeOpen) return
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)){
                setIsVolumeOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)

        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isVolumeOpen])
    
    return (
        <div className="flex bg-surface border-b-4 border-border font-display items-center justify-between px-6 py-1">
            <div className="flex items-center gap-6">
                <div className="text-xl text-accent tracking-wide">
                    <NavLink to="/">Focus Ducky</NavLink>
                </div>


                <div className="flex items-center gap-4 text-text">
                    <NavLink to="/" className={({isActive}) => isActive ? "text-accent" : "hover:text-accent transition"}>Timer</NavLink>
                    {!isAuthenticated 
                        ?
                        <>
                            <NavLink to="/login" className={({isActive}) => isActive ? "text-accent" : "hover:text-accent transition"}>Log in</NavLink>
                            <NavLink to="/signup" className={({isActive}) => isActive ? "text-accent" : "hover:text-accent transition"}>Sign up</NavLink>
                        </>

                        :
                        <>
                            <NavLink to="/stats" className={({isActive}) => isActive ? "text-accent" : "hover:text-accent transition"}>Stats</NavLink>
                            <NavLink to="/profile" className={({isActive}) => isActive ? "text-accent" : "hover:text-accent transition"}>Profile</NavLink>
                        </>
                    }
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                {location.pathname === "/" &&
                <button
                        className="cursor-pointer px-2 py-1 transition hover:bg-input rounded-sm border-2 border-transparent hover:border-border"
                        onClick={toggleCardHide}
                    >
                        {isCardHiding 
                            ? <PixelIcon name="Magnifying-Glass"/> 
                            : <PixelIcon name="Magnifying-Glass-Reduce"/> 
                        }
                </button>
                }

                <div 
                    className="group relative flex items-center rounded-sm border-2 border-transparent hover:border-border transition"
                    ref={popoverRef}
                >
                    <button
                        className="cursor-pointer px-2 py-1 group-hover:border-r-2 group-hover:border-border transition hover:bg-input"
                        onClick={toggleMusic}
                    >
                        {isPlaying 
                            ? <PixelIcon name="Speaker-Crossed"/> 
                            : <PixelIcon name="Speaker-0"/> 
                        }
                    </button>
                        
                    <button
                        className="px-1 py-1 flex items-center justify-center hover:bg-input [align-self:stretch]"
                        onClick={volumeAdjust}
                    >
                        <PixelIcon name="Chevron-Arrow-Down" size="w-2 h-[5px]"/>
                    </button> 

                    {isVolumeOpen && 
                        <input 
                            className="absolute top-full -left-3 mt-3 accent-accent"
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={volume}
                            onChange={(e) => handleVolume(Number(e.target.value))}
                        />
                    }
                </div>


                {themeSelect}
            </div>

            
        </div>
    )
}

export default NavBar;