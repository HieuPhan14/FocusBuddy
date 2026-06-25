import type { SessionResponse } from "../types/session";
import { useEffect, useRef, useState } from "react";

interface TimerProps {
    session: SessionResponse
}

interface PhaseInfo {
    phase: string
    currentCycleIndex: number   
    timeLeftInPhase: number
    percentSessionElapsed: number
    focusAccumulated: number
}

const handlePhase = (total_session_planned:number, elapsedTime: number, schedule: [number, number][]): PhaseInfo => {
    let runningTotal: number = 0
    let phase: string = ""
    let currentCycleIndex: number = 0
    let timeLeftInPhase: number = 0
    let focusAccumulated: number = 0
    
    for (let i = 0; i < schedule.length; i++) {
        const cycle = schedule[i]
        currentCycleIndex = i

        if (elapsedTime < runningTotal + cycle[0]) {
            phase = `Focus ${i+1}`
            timeLeftInPhase = (runningTotal + cycle[0]) - elapsedTime
            focusAccumulated += elapsedTime - runningTotal
            break
        } else if (elapsedTime <=  runningTotal + cycle[0] + cycle[1]) {
            phase = `Break ${i+1}`
            timeLeftInPhase = (runningTotal + cycle[0] + cycle[1]) - elapsedTime
            focusAccumulated += cycle[0]
            break
        }
        runningTotal += cycle[0] + cycle[1]
        focusAccumulated += cycle[0]
    }
    const percentSessionElapsed = parseFloat(((elapsedTime/total_session_planned)*100).toFixed(2))
    
    return {
        phase: phase,
        currentCycleIndex: currentCycleIndex,
        timeLeftInPhase: timeLeftInPhase,
        percentSessionElapsed: percentSessionElapsed,
        focusAccumulated: focusAccumulated
    }
}

// startTimeRef.current += (Date.now() - accumulatedBefore)/1000

const Timer = ( {session}: TimerProps ) => {
    const startTimeRef = useRef<number>(0)
    const elapsedTimeRef = useRef<number>(0)
    const isPausedRef = useRef<boolean>(false)
    const isCompletedRef = useRef<boolean>(false)
    const accumulatedBeforeRef = useRef<number>(0)
    const [displayInfo, setDisplayInfo] = useState<PhaseInfo | null>(null)
    const total_session_planned: number = session.schedule.reduce((acc, [a, b]) => acc + a + b, 0)
    
    useEffect(() => {
        startTimeRef.current = Date.now()
        const id = setInterval(() => {
            if (!isCompletedRef.current){
                if (!isPausedRef.current){
                    elapsedTimeRef.current = accumulatedBeforeRef.current + (Date.now() - startTimeRef.current) / 1000
                    const phase_info = handlePhase(total_session_planned, elapsedTimeRef.current, session.schedule)
                    setDisplayInfo(phase_info)
                } 
            }

            if (elapsedTimeRef.current >= total_session_planned){
                isCompletedRef.current = true
                clearInterval(id)
            }
        }, 250)

        return () => clearInterval(id)
    }, [session.schedule, total_session_planned]);

    const togglePause = () => {
        if (!isPausedRef.current){
            accumulatedBeforeRef.current = elapsedTimeRef.current
            isPausedRef.current = true
        } else {
            startTimeRef.current = Date.now()
            isPausedRef.current = false
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="border border-red-400 flex flex-col w-[400px] h-[600px]">
                <div className="border border-yellow-400 h-3/5">
                    <div>This is top 60%</div>
                    <button
                        className="border border-yellow-400"
                        onClick={togglePause}
                    >Pause test
                    </button>
                </div>

                {
                displayInfo &&

                <div className="flex border border-black-400 h-2/5 justify-between">
                    
                    <div className="flex flex-col justify-around border border-red-400">

                        <div className="border border-brown-400">
                            <div>Time remaining</div>
                            <div>
                                <div>{displayInfo.timeLeftInPhase}</div>
                                <div>Current cycle index {displayInfo.currentCycleIndex}</div>
                            </div>
                        </div>

                        <div className="border border-brown-400">
                            <div>Total focus</div>
                            <div>{displayInfo.focusAccumulated}</div>
                        </div>

                        <div className="border border-brown-400">
                            <div>Overall session progress</div>
                            <div>{displayInfo.percentSessionElapsed}%</div>
                        </div>

                    </div>

                    <div className="border border-red-400">
                        <div>Current phrase</div>
                        <div>{displayInfo.phase}</div>
                    </div>
                </div>
                }

            </div>
        </div>
    )
}

export default Timer;