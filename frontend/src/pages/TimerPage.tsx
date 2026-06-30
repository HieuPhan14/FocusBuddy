import { useState } from "react";
import SessionConfig from "../components/SessionConfig";
import Timer from "../components/Timer";
import type { SessionResponse, SessionSchedule } from "../types/session";
import NavBar from "../components/NavBar";
import { useAuth } from "../hooks/useAuth";


const TimerPage = () => {
    const { isAuthenticated } = useAuth()
    const [sessionInfo, setSessionInfo] = useState<SessionSchedule | SessionResponse | null>(null)
    const handleOnSessionStart = (data: SessionSchedule | SessionResponse) => {
        setSessionInfo(data)
    }
    
    return (
    <>
    <div className="flex flex-col h-screen">
        <NavBar />
        {sessionInfo 
        ?
            <Timer session={sessionInfo}/>
        :
            <SessionConfig sessionStart={handleOnSessionStart} isAuth={isAuthenticated}/>
        }
    </div>
    </>
    );
};

export default TimerPage;
