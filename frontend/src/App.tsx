import { BrowserRouter, Routes, Route } from "react-router-dom";
import StatPage from "./pages/StatPage";
import TimerPage from "./pages/TimerPage";
import ProfilePage from "./pages/ProfilePage";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Layout from "./components/Layout";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<TimerPage />}/>
                        <Route path="stats" element={<ProtectedRoute><StatPage /></ProtectedRoute>}/>
                        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
                        <Route path="login" element={<LoginPage />}></Route>
                        <Route path="signup" element={<SignUpPage />}></Route>
                        <Route path="forgot-password" element={<ForgotPassword />}></Route>
                        <Route path="reset-password" element={<ResetPassword />}></Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}