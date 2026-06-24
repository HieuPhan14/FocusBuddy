import { useState } from "react";
import SessionConfig from "../components/SessionConfig";
import Timer from "../components/Timer";
import type { SessionResponse } from "../types/session";

const TimerPage = () => {
    const [sessionInfo, setSessionInfo] = useState<SessionResponse | null>(null)
    const handleOnSessionStart = (data: SessionResponse) => {
        setSessionInfo(data)
    }
    
    return (
    <>
        {sessionInfo 
        ?
            <Timer session={sessionInfo}/>
        :
            <SessionConfig sessionStart={handleOnSessionStart}/>
        }
    </>
    );
};

export default TimerPage;