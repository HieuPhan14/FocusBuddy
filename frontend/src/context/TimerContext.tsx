import { createContext, useRef, useState } from "react"
import type { SessionResponse, SessionSchedule } from "../types/session"
import type { DuckInfo } from "../lib/route"

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

    isPaused: boolean
    setIsPaused: React.Dispatch<React.SetStateAction<boolean>>
    togglePause: () => void

    duckState: DuckInfo | null
    setDuckState: React.Dispatch<React.SetStateAction<DuckInfo | null>>

    isBatAlive: boolean
    setIsBatAlive: React.Dispatch<React.SetStateAction<boolean>>
    batAnimation: string
    setBatAnimation: React.Dispatch<React.SetStateAction<string>>
    isBatOnMap: boolean
    setIsBatOnMap: React.Dispatch<React.SetStateAction<boolean>>

    isChestOpen: boolean
    setIsChestOpen: React.Dispatch<React.SetStateAction<boolean>>

    cameraWidth: number
    setCameraWidth: React.Dispatch<React.SetStateAction<number>>
    cameraHeight: number
    setCameraHeight: React.Dispatch<React.SetStateAction<number>>

    manualCameraCenter: {x: number, y: number} | null
    setManualCameraCenter: React.Dispatch<React.SetStateAction<{x: number, y: number} | null>>
}

// eslint-disable-next-line react-refresh/only-export-components
export const TimerContext = createContext<TimerContextType | null>(null)
const TimerProvider = ( { children }: TimerProviderProps) => {
    const [sessionInfo, setSessionInfo] = useState<SessionSchedule | SessionResponse | null>(null)
    const [isCompleted, setIsCompleted] = useState<boolean>(false)
    const [isPaused, setIsPaused] = useState<boolean>(false)
    const startTimeRef = useRef<number>(0)
    const elapsedTimeRef = useRef<number>(0)
    const isPausedRef = useRef<boolean>(false)
    const accumulatedBeforeRef = useRef<number>(0)

    const [duckState, setDuckState] = useState<DuckInfo | null>(null)
    const [isBatAlive, setIsBatAlive] = useState<boolean>(true)
    const [batAnimation, setBatAnimation] = useState<string>("animate-bat-idle-left bg-[url('/frame/animals/bat/Bat_Idle.png')]")
    const [isBatOnMap, setIsBatOnMap ] = useState<boolean>(true)
    const [isChestOpen, setIsChestOpen] = useState<boolean>(false)

    const [cameraWidth, setCameraWidth] = useState<number>(0)
    const [cameraHeight, setCameraHeight] = useState<number>(0)

    const [manualCameraCenter, setManualCameraCenter] = useState<{x: number, y: number} | null>(null)

    const togglePause = (): void => {
        if (!isPausedRef.current){
            accumulatedBeforeRef.current = elapsedTimeRef.current
            isPausedRef.current = true
            setIsPaused(true)
        } else {
            startTimeRef.current = Date.now()
            isPausedRef.current = false
            setIsPaused(false)
        }
    }

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
            value={{manualCameraCenter, setManualCameraCenter, cameraHeight, cameraWidth, setCameraHeight, setCameraWidth, isChestOpen, setIsChestOpen, isBatAlive, setIsBatAlive, batAnimation, setBatAnimation, isBatOnMap, setIsBatOnMap, duckState, setDuckState, isPaused, setIsPaused, togglePause, isCompleted, setIsCompleted, endSession, sessionInfo, startTimeRef, elapsedTimeRef, isPausedRef, accumulatedBeforeRef,
                setSessionInfo
            }}
        >
            {children}
        </TimerContext.Provider>
    )
}

export default TimerProvider