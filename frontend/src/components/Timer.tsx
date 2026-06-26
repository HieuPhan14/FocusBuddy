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
    const accumulatedBeforeRef = useRef<number>(0)
    const scrollRef = useRef<HTMLDivElement>(null)

    const [displayInfo, setDisplayInfo] = useState<PhaseInfo | null>(null)
    const [isCompleted, setIsCompleted] = useState<boolean>(false)
    const total_session_planned: number = session.schedule.reduce((acc, [a, b]) => acc + a + b, 0)

    const handleScrollCycle = ():void => {
        scrollRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }   

    useEffect(() => {
        startTimeRef.current = Date.now()
        const id = setInterval(() => {
            if (!isPausedRef.current) {
                elapsedTimeRef.current = Math.min(
                    accumulatedBeforeRef.current + (Date.now() - startTimeRef.current) / 1000, 
                    total_session_planned)
            
                if (elapsedTimeRef.current >= total_session_planned){
                    setIsCompleted(true)
                    clearInterval(id)
    
                } else {
                    const phase_info = handlePhase(total_session_planned, elapsedTimeRef.current, session.schedule)
                    setDisplayInfo(phase_info)
                    console.log(session.schedule)
                    console.log(total_session_planned)
                } 
            }
        }, 250)

        return () => clearInterval(id)
    }, [session.schedule, total_session_planned]);

    useEffect(() => {
        handleScrollCycle()
    }, [displayInfo?.currentCycleIndex])

    const togglePause = (): void => {
        if (!isPausedRef.current){
            accumulatedBeforeRef.current = elapsedTimeRef.current
            isPausedRef.current = true
        } else {
            startTimeRef.current = Date.now()
            isPausedRef.current = false
        }
    }

    return (
        <>
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

                    <div className="border border-red-400 flex flex-col h-full">
                        <div>{`Cycle ${displayInfo.currentCycleIndex} of ${session.schedule.length}`}</div>
                        
                        <div className="overflow-y-auto flex-1 overflow-x-hidden">
                            {session.schedule.map((_, i) => (
                                <React.Fragment key={i}>
                                    <div className="flex">
                                        <div className={clsx(displayInfo.currentCycleIndex === i+1 && "border")}>
                                            {`Cycle ${i+1}`}
                                        </div>
                                        {i+1 < displayInfo.currentCycleIndex && 
                                            <div>Checked</div>
                                        }
                                        {i+1 === displayInfo.currentCycleIndex && 
                                            <div ref={scrollRef}>
                                                {displayInfo.phase.startsWith("Focus") ? "Focusing" : "On Break"}
                                            </div>
                                        }
                                        {i+1 > displayInfo.currentCycleIndex && 
                                            <div>...</div>
                                        }
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>

                    </div>
                </div>
                }

            </div> 
        </div>

        {isCompleted && <div>Finish</div>}
        </>
    )
}

export default Timer;

