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

// const mockSession: SessionResponse = {
//     schedule: [[3120, 1020], [3120, 1020], [3120, 0]],
//     cycle_focus_seconds: 3120,
//     cycle_break_seconds: 1020 
// }

// const mockSession2: SessionResponse = {
//     schedule: [[5,3], [5,3], [5,3], [5,3], [5,3], [5,3], [5,3], [5,3], [5,3], [5,3], [5,3]],
//     cycle_focus_seconds: 5,
//     cycle_break_seconds: 3 
// }

// const TimerPage = () => {
//     return (
//     <>
        
//             <Timer session={mockSession2}/>
        
//     </>
//     );
// };

// export default TimerPage;