import NavBar from "./NavBar"
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex flex-col h-screen">
            <NavBar />
            <main className="flex-1 h-full">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;