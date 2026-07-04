import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { BackgroundTheme } from "./Layout";

interface NavBarProps {
    themeOption: (value: BackgroundTheme) => void;
}

const NavBar = () => {
    const {isAuthenticated} = useAuth()
    
    return (
    <>
        {!isAuthenticated 
            ?
            <div className="flex">
                <Link to="/">Timer</Link>
                <Link to="/login">Log in</Link>
                <Link to="/signup">Sign up</Link>
                <button>
                    
                </button>
            </div>

            :
            <div className="flex">
                <Link to="/">Timer</Link>
                <Link to="/stats">Stats</Link>
                <Link to="/profile">Profile</Link>
            </div>
        }
    </>
    )
}

export default NavBar;