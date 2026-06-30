import { useState } from "react";
import SessionConfig from "../components/SessionConfig";
import Timer from "../components/Timer";
import type { SessionResponse, SessionSchedule } from "../types/session";
import NavBar from "../components/NavBar";
import { useAuth } from "../hooks/useAuth";
import { markCompleted } from "../services/session";


const TimerPage = () => {
    const { isAuthenticated } = useAuth()
    const [sessionInfo, setSessionInfo] = useState<SessionSchedule | SessionResponse | null>(null)
    const [completedResponse, setCompletedResponse] = useState<SessionResponse | null>(null)

    const handleOnSessionStart = (data: SessionSchedule | SessionResponse) => {
        setSessionInfo(data)
    }

    const handleOnComplete = async () => {
        if (isAuthenticated && sessionInfo && 'id' in sessionInfo){
            const completedResponse = await markCompleted(sessionInfo.id, {status: "completed"})
            setCompletedResponse(completedResponse)
        }
    }

    return (
    <>
    <div className="flex flex-col h-screen">
        <NavBar />
        {sessionInfo 
        ?
            <Timer session={sessionInfo} handleComplete={handleOnComplete}/>
        :
            <SessionConfig sessionStart={handleOnSessionStart} isAuth={isAuthenticated}/>
        }
        {completedResponse && <div>Congratulation</div>}
    </div>
    </>
    );
};

export default TimerPage;
