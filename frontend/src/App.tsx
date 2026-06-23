import { BrowserRouter, Routes, Route } from "react-router-dom";
import StatPage from "./pages/StatPage";
import TimerPage from "./pages/TimerPage";
import ProfilePage from "./pages/ProfilePage";
import AuthProvider from "./context/AuthContext";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<TimerPage />}/>
                    <Route path="/stats" element={<StatPage />}/>
                    <Route path="/profile" element={<ProfilePage />}/>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}