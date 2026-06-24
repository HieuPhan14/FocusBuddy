import type { SessionResponse } from "../types/session";

interface TimerProps {
    session: SessionResponse
}

const Timer = ( {session}: TimerProps ) => {
    return (
        <div>This is timer</div>
    )
}

export default Timer;