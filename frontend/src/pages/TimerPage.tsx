import { useState } from "react";
import SessionConfig from "../components/SessionConfig";
import Timer from "../components/Timer";
import type { SessionResponse } from "../types/session";


// const TimerPage = () => {
//     const [sessionInfo, setSessionInfo] = useState<SessionResponse | null>(null)
//     const handleOnSessionStart = (data: SessionResponse) => {
//         setSessionInfo(data)
//     }
    
//     return (
//     <>
//         {sessionInfo 
//         ?
//             <Timer session={sessionInfo}/>
//         :
//             <SessionConfig sessionStart={handleOnSessionStart}/>
//         }
//     </>
//     );
// };

// export default TimerPage;

const mockSession: SessionResponse = {
    schedule: [[3120, 1020], [3120, 1020], [3120, 0]],
    cycle_focus_seconds: 3120,
    cycle_break_seconds: 1020 
}

const TimerPage = () => {
    return (
    <>
        
            <Timer session={mockSession}/>
        
    </>
    );
};

export default TimerPage;