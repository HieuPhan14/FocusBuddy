import { createContext, useRef, useState } from "react"
import type { SessionResponse, SessionSchedule } from "../types/session"

interface TimerProviderProps {
    children: React.ReactNode
}

interface TimerContextType {
    sessionInfo: SessionSchedule | SessionResponse | null
    startTimeRef: React.RefObject<number>
    elapsedTimeRef: React.RefObject<number>
    isPausedRef: React.RefObject<boolean>
    accumulatedBeforeRef: React.RefObject<number>
    setSessionInfo: React.Dispatch<React.SetStateAction<SessionSchedule | SessionResponse | null>>
    endSession: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const TimerContext = createContext<TimerContextType | null>(null)
const TimerProvider = ( { children }: TimerProviderProps) => {
    const [sessionInfo, setSessionInfo] = useState<SessionSchedule | SessionResponse | null>(null)
    
    const startTimeRef = useRef<number>(0)
    const elapsedTimeRef = useRef<number>(0)
    const isPausedRef = useRef<boolean>(false)
    const accumulatedBeforeRef = useRef<number>(0)

    const endSession = () => {
        startTimeRef.current = Date.now()
        accumulatedBeforeRef.current = 0
        isPausedRef.current = false
        elapsedTimeRef.current = 0
        setSessionInfo(null)
    }
    
    return (
        <TimerContext.Provider 
            value={{endSession, sessionInfo, startTimeRef, elapsedTimeRef, isPausedRef, accumulatedBeforeRef,
                setSessionInfo
            }}
        >
            {children}
        </TimerContext.Provider>
    )
}

export default TimerProvider