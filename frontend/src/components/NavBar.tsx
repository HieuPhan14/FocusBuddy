import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { BackgroundTheme } from "./Layout";

interface NavBarProps {
    themeOption: (value: BackgroundTheme) => void;
    theme: BackgroundTheme
}

const NavBar = ({ themeOption, theme }: NavBarProps) => {
    const {isAuthenticated} = useAuth()

    return (
    <>
        {!isAuthenticated 
            ?
            <div className="flex">
                <Link to="/">Timer</Link>
                <Link to="/login">Log in</Link>
                <Link to="/signup">Sign up</Link>
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
            </div>

            :
            <div className="flex">
                <Link to="/">Timer</Link>
                <Link to="/stats">Stats</Link>
                <Link to="/profile">Profile</Link>
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
            </div>
        }
    </>
    )
}

export default NavBar;