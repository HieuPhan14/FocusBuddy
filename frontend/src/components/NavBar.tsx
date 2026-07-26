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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

    const popoverRef = useRef<HTMLDivElement>(null)
    const mobileMenuRef = useRef<HTMLDivElement>(null)

    const location = useLocation()

    const themeSelect = (
        <div className="relative">
            <select
                id="theme-select"
                value={theme}
                className="[appearance:none] border-2 border-transparent hover:border-border transition hover:bg-input rounded-sm px-2 py-1 text-text pr-6"
                onChange={(e) => {
                    handleTheme(e.target.value as BackgroundTheme)
                }}
            >
                <option value="summer" className="bg-surface text-text">Summer</option>
                <option value="beach" className="bg-surface text-text">Beach</option>
                <option value="night" className="bg-surface text-text">Night</option>
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

    useEffect(() => {
        if (!isMobileMenuOpen) return
        const handleClickOutside = (e: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)){
                setIsMobileMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)

        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isMobileMenuOpen])


    return (
        <div className="relative flex bg-surface border-b-4 border-border font-display items-center justify-between px-2 nav:px-6 py-1 h-12">
            <div className="flex items-center gap-2 nav:gap-6 h-full">
                <div className="flex-shrink-0">
                    <NavLink 
                        to="/"
                        className="flex flex-col xs:flex-row items-center leading-none xs:leading-normal text-accent xs:text-xl tracking-wide xs:gap-1"
                    >
                        <span>Focus</span>
                        <span>Ducky</span>
                    </NavLink>
                </div>

                <div className="flex items-center gap-4 text-text hidden nav:flex">
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

                    <NavLink to="/about" className={({isActive}) => isActive ? "text-accent" : "hover:text-accent transition"}>About</NavLink>
                </div>

                <div
                    ref={mobileMenuRef}
                    className="relative h-full flex items-center"
                >
                    <button 
                        className="flex nav:hidden cursor-pointer px-2 py-1 transition hover:bg-input rounded-sm border-2 border-transparent hover:border-border"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <PixelIcon name="Bulleted-List"/>
                    </button>

                    {isMobileMenuOpen &&
                    <div
                        className="w-max mt-1 absolute top-full left-1/2 -translate-x-1/2 flex flex-col items-center text-text bg-surface border-x-2 border-border border-b-2 gap-1 nav:hidden px-4 pb-2 pt-1"
                    >
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

                        <NavLink to="/about" className={({isActive}) => isActive ? "text-accent" : "hover:text-accent transition"}>About</NavLink>
                    </div>
                    }

                </div> 
                
            </div>
            
            <div className="flex items-center gap-1 nav:gap-3">
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