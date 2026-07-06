import SessionConfig from "../components/SessionConfig";
import Timer from "../components/Timer";
import type { SessionResponse, SessionSchedule } from "../types/session";
import { useAuth } from "../hooks/useAuth";
import { markCompleted } from "../services/session";
import Card from "../components/Card";
import { useTimer } from "../hooks/useTimer";
import { useOutletContext } from "react-router-dom";

const TimerPage = () => {
    const { isAuthenticated } = useAuth()
    const { sessionInfo, setSessionInfo, startTimeRef} = useTimer()
    const { audioRef, setIsPlaying } = useOutletContext<{audioRef: React.RefObject<HTMLAudioElement | null>; setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>}>()
    const handleOnSessionStart = (data: SessionSchedule | SessionResponse) => {
        setSessionInfo(data)
        startTimeRef.current = Date.now()
    }

    const handleOnComplete = async () => {
        if (isAuthenticated && sessionInfo && 'id' in sessionInfo){
            await markCompleted(sessionInfo.id, {status: "completed"})
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
                <SessionConfig sessionStart={handleOnSessionStart} isAuth={isAuthenticated} audioRef={audioRef} setIsPlaying={setIsPlaying}/>
            }
        </Card>
    </div>
    </>
    );
};

export default TimerPage;
