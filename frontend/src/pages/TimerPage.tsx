import SessionConfig from "../components/SessionConfig";
import Timer from "../components/Timer";
import type { SessionResponse, SessionSchedule } from "../types/session";
import { useAuth } from "../hooks/useAuth";
import { markCompleted } from "../services/session";
import Card from "../components/Card";
import { useTimer } from "../hooks/useTimer";
import { useOutletContext } from "react-router-dom";
import MiniMap from "../components/MiniMap";
import clsx from "clsx";

export type LayoutOutletContext = {
    audioRef: React.RefObject<HTMLAudioElement | null>
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
    isHideCard: boolean
}

const fakeSession: SessionSchedule = {
      schedule: [
          [8, 25],
      ],
      cycle_focus_seconds: 8,
      cycle_break_seconds: 25,
}

const TimerPage = () => {
    const { isAuthenticated } = useAuth()
    const { sessionInfo, setSessionInfo, startTimeRef} = useTimer()
    const { audioRef, setIsPlaying, isHideCard } = useOutletContext<LayoutOutletContext>()
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
    <div className="flex justify-center items-center h-full">
        <div className={clsx("relative w-[400px] max-h-[600px] h-full", isHideCard && "hidden")}>
            <Card>
                {sessionInfo 
                ?
                    // <Timer session={sessionInfo} handleComplete={handleOnComplete}/>
                    <Timer session={fakeSession} handleComplete={handleOnComplete}/>
                :
                    <SessionConfig sessionStart={handleOnSessionStart} isAuth={isAuthenticated} audioRef={audioRef} setIsPlaying={setIsPlaying}/>
                }
            </Card>

            {sessionInfo && <MiniMap />}
        </div>
    </div>
    </>
    );
};

export default TimerPage;
