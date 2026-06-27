import { BrowserRouter, Routes, Route } from "react-router-dom";
import StatPage from "./pages/StatPage";
import TimerPage from "./pages/TimerPage";
import ProfilePage from "./pages/ProfilePage";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<TimerPage />}/>
                    <Route path="/stats" element={<ProtectedRoute><StatPage /></ProtectedRoute>}/>
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
                    <Route path="/login" element={<LoginPage />}></Route>
                    <Route path="/signup" element={<SignUpPage />}></Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}