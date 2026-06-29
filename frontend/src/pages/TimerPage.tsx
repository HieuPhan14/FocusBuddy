import { useState } from "react";
import SessionConfig from "../components/SessionConfig";
import Timer from "../components/Timer";
import type { SessionResponse } from "../types/session";
import NavBar from "../components/NavBar";


const TimerPage = () => {
    const [sessionInfo, setSessionInfo] = useState<SessionResponse | null>(null)
    const handleOnSessionStart = (data: SessionResponse) => {
        setSessionInfo(data)
    }
    
    return (
    <>
        <NavBar />
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
