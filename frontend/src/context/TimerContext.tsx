import { createContext, useRef, useState } from "react"
import type { SessionResponse, SessionSchedule } from "../types/session"

interface TimerProviderProps {
    children: React.ReactNode
}

interface TimerContextType {
    sessionInfo: SessionSchedule | SessionResponse | null
    setSessionInfo: React.Dispatch<React.SetStateAction<SessionSchedule | SessionResponse | null>>
    
    isCompleted: boolean
    setIsCompleted: React.Dispatch<React.SetStateAction<boolean>>

    startTimeRef: React.RefObject<number>
    elapsedTimeRef: React.RefObject<number>
    isPausedRef: React.RefObject<boolean>
    accumulatedBeforeRef: React.RefObject<number>
    endSession: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const TimerContext = createContext<TimerContextType | null>(null)
const TimerProvider = ( { children }: TimerProviderProps) => {
    const [sessionInfo, setSessionInfo] = useState<SessionSchedule | SessionResponse | null>(null)
    const [isCompleted, setIsCompleted] = useState<boolean>(false)
    const startTimeRef = useRef<number>(0)
    const elapsedTimeRef = useRef<number>(0)
    const isPausedRef = useRef<boolean>(false)
    const accumulatedBeforeRef = useRef<number>(0)

    const endSession = () => {
        setIsCompleted(false)
        setSessionInfo(null)
        startTimeRef.current = Date.now()
        accumulatedBeforeRef.current = 0
        isPausedRef.current = false
        elapsedTimeRef.current = 0
    }
    
    return (
        <TimerContext.Provider 
            value={{isCompleted, setIsCompleted, endSession, sessionInfo, startTimeRef, elapsedTimeRef, isPausedRef, accumulatedBeforeRef,
                setSessionInfo
            }}
        >
            {children}
        </TimerContext.Provider>
    )
}

export default TimerProvider