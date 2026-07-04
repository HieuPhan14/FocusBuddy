import Background from "./Background";
import NavBar from "./NavBar"
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex flex-col h-screen relative">
            <Background />

            <div className="relative z-10">
                <NavBar />
            </div>

            <main className="flex-1 h-full relative z-10">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;