import type { SessionResponse } from "../types/session";
import { useEffect, useRef, useState } from "react";
import {handlePhase, formatTime} from "../lib/timer";
import type { PhaseInfo } from "../lib/timer";
import React from "react";
import clsx from "clsx"

interface TimerProps {
    session: SessionResponse
}

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
            if (!isPausedRef.current) {
                elapsedTimeRef.current = Math.min(
                    accumulatedBeforeRef.current + (Date.now() - startTimeRef.current) / 1000, 
                    total_session_planned)
            
                if (elapsedTimeRef.current >= total_session_planned){
                    isCompletedRef.current = true
                    clearInterval(id)
    
                } else {
                    const phase_info = handlePhase(total_session_planned, elapsedTimeRef.current, session.schedule)
                    setDisplayInfo(phase_info)
                } 
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
                                <div>{formatTime(Math.floor(displayInfo.timeLeftInPhase))}</div>
                                <div>Current cycle index {displayInfo.currentCycleIndex}</div>
                            </div>
                        </div>

                        <div className="border border-brown-400">
                            <div>Total focus</div>
                            <div>{formatTime(Math.floor(displayInfo.focusAccumulated))}</div>
                        </div>

                        <div className="border border-brown-400">
                            <div>Overall session progress</div>
                            <div>{displayInfo.percentSessionElapsed}%</div>
                        </div>

                    </div>

                    <div className="border border-red-400">
                        <div>Current phase</div>
                        {session.schedule.map((cycle, i) => (
                            <React.Fragment key={i}>
                                {cycle[0] != 0 && 
                                    <div className={clsx(`Focus ${i+1}` === displayInfo.phase && "text-red-400")}>
                                        {`Focus ${i+1}`} 
                                    </div>}
                                {cycle[1] != 0 && 
                                    <div className={clsx(`Break ${i+1}` === displayInfo.phase && "text-red-400")}> 
                                        {`Break ${i+1}`} 
                                    </div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                }

            </div>
        </div>
    )
}

export default Timer;