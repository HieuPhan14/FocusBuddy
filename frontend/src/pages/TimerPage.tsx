import { useState } from "react";
import SessionConfig from "../components/SessionConfig";
import Timer from "../components/Timer";
import type { SessionResponse, SessionSchedule } from "../types/session";
import { useAuth } from "../hooks/useAuth";
import { markCompleted } from "../services/session";
import Card from "../components/Card";
import { useTimer } from "../hooks/useTimer";

const TimerPage = () => {
    const { isAuthenticated } = useAuth()
    const { sessionInfo, setSessionInfo, startTimeRef, accumulatedBeforeRef, isPausedRef, elapsedTimeRef } = useTimer()
    const [completedResponse, setCompletedResponse] = useState<SessionResponse | null>(null)

    const handleOnSessionStart = (data: SessionSchedule | SessionResponse) => {
        setSessionInfo(data)
        startTimeRef.current = Date.now()
        accumulatedBeforeRef.current = 0
        isPausedRef.current = false
        elapsedTimeRef.current = 0
    }

    const handleOnComplete = async () => {
        if (isAuthenticated && sessionInfo && 'id' in sessionInfo){
            const completedResponse = await markCompleted(sessionInfo.id, {status: "completed"})
            setCompletedResponse(completedResponse)
        }
    }

    return (
    <>
    <div className="flex flex-col h-full">
        <Card>
            {sessionInfo 
            ?
                <Timer session={sessionInfo} handleComplete={handleOnComplete}/>
            
            :
                <SessionConfig sessionStart={handleOnSessionStart} isAuth={isAuthenticated}/>
            }
            {completedResponse && <div>Congratulation</div>}
        </Card>
    </div>
    </>
    );
};

export default TimerPage;
