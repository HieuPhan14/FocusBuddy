import { BrowserRouter, Routes, Route } from "react-router-dom";
import StatPage from "./pages/StatPage";
import TimerPage from "./pages/TimerPage";
import ProfilePage from "./pages/ProfilePage";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<TimerPage />}/>
                    <Route path="/stats" element={<ProtectedRoute><StatPage /></ProtectedRoute>}/>
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}