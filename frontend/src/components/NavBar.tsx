import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { BackgroundTheme } from "./Layout";

interface NavBarProps {
    themeOption: (value: BackgroundTheme) => void
    theme: BackgroundTheme
    toggleMusic: () => void
    isPlaying: boolean
    volume: number
    handleVolume: (value: number) => void
}

const NavBar = ({ themeOption, theme, toggleMusic, isPlaying, volume, handleVolume }: NavBarProps) => {
    const {isAuthenticated} = useAuth()
    const themeSelect = (
        <select
            value={theme}
            onChange={(e) => {
                themeOption(e.target.value as BackgroundTheme)
            }}
        >
            <option value="summer">Summer</option>
            <option value="beach">Beach</option>
            <option value="night">Night</option>
        </select>
    )

    return (
    <>
        <div className="flex">
            {!isAuthenticated 
                ?
                <div className="flex">
                    <Link to="/">Timer</Link>
                    <Link to="/login">Log in</Link>
                    <Link to="/signup">Sign up</Link>
                </div>

                :
                <div className="flex">
                    <Link to="/">Timer</Link>
                    <Link to="/stats">Stats</Link>
                    <Link to="/profile">Profile</Link>
                </div>
            }
            {themeSelect}
            
            <div className="group relative flex items-center">
                <button
                    className=""
                    onClick={toggleMusic}
                >
                    {isPlaying
                        ? <div>Mute Music </div>
                        : <div>Play Music</div>
                    }
                </button>

                <input 
                    className="hidden group-hover:block"
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={(e) => handleVolume(Number(e.target.value))}
                />
            </div>

            
        </div>
    </>
    )
}

export default NavBar;