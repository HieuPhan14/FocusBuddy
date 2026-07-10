import type { SessionSchedule } from "../types/session";
import { useEffect, useRef, useState } from "react";
import {handlePhase, formatTime, formatTimeRemaining} from "../lib/timer";
import type { PhaseInfo } from "../lib/timer";
import React from "react";
import clsx from "clsx"
import { useTimer } from "../hooks/useTimer";
import PixelIcon from "./PixelIcon";

interface TimerProps {
    session: SessionSchedule
    handleComplete: () => Promise<void>
}

const Timer = ( {session, handleComplete}: TimerProps ) => {
    const { isPaused, togglePause, endSession, isCompleted, setIsCompleted, startTimeRef, elapsedTimeRef, isPausedRef, accumulatedBeforeRef} = useTimer()

    const scrollRef = useRef<HTMLDivElement>(null)
    const [displayInfo, setDisplayInfo] = useState<PhaseInfo | null>(null)

    const total_session_planned: number = session.schedule.reduce((acc, [a, b]) => acc + a + b, 0)
    const isBreak = displayInfo?.phase.startsWith("Break")

    const handleScrollCycle = ():void => {
        scrollRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }   

    useEffect(() => {
        const phaseInfo = handlePhase(total_session_planned, Math.floor(elapsedTimeRef.current), session.schedule)
        setDisplayInfo(phaseInfo)

        const id = setInterval(() => {
            if(!isPausedRef.current){
                elapsedTimeRef.current = Math.min(
                    accumulatedBeforeRef.current + (Date.now() - startTimeRef.current) /1000,
                    total_session_planned
                )

                if (elapsedTimeRef.current >= total_session_planned){
                    setIsCompleted(true)
                    clearInterval(id)
                    
                } else {
                    const phaseInfo = handlePhase(total_session_planned, Math.floor(elapsedTimeRef.current), session.schedule)
                    setDisplayInfo(phaseInfo)
                }
            }
            
        }, 250)
        
        return () => {
            clearInterval(id)
        }
    }, [setIsCompleted, session.schedule, total_session_planned, accumulatedBeforeRef, elapsedTimeRef, isPausedRef, startTimeRef]);
    
    useEffect(() => {
        handleScrollCycle()
    }, [displayInfo?.currentCycleIndex])
    
    useEffect(() => {
        if (isCompleted)
            handleComplete()
    //eslint-disable-next-line
    }, [isCompleted])

    const handleBreakSkip = (): void => {
        if (displayInfo?.phase.startsWith("Break")){
            accumulatedBeforeRef.current = elapsedTimeRef.current + displayInfo.timeLeftInPhase
            startTimeRef.current = Date.now()
            elapsedTimeRef.current = accumulatedBeforeRef.current
            setDisplayInfo(handlePhase(total_session_planned, Math.floor(elapsedTimeRef.current), session.schedule))
        }
    }

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex flex-col h-3/5 items-center justify-between">
                    <div className="border-b-2">frame</div>

                    <div className="flex gap-2 mb-2">
                        <button
                            className="cursor-pointer hover:bg-input transition border-border px-2 py-1 rounded-sm border-2"
                            onClick={togglePause}
                        >
                            {isPaused 
                                ? <PixelIcon name="Play"/>
                                : <PixelIcon name="Pause"/>
                            }
                        </button>

                        <button
                            className="cursor-pointer hover:bg-input transition border-border px-2 py-1 rounded-sm border-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            disabled={!isBreak}
                            onClick={handleBreakSkip}
                        >
                            <PixelIcon name="Forward"/>
                        </button>
                    </div>
                </div>

                {
                displayInfo &&

                <div className="flex h-2/5 justify-around pb-2 min-h-[200px]">
                    
                    <div className="flex flex-col text-text body-text justify-between h-full">

                        <div className="inner-panel-row !py-1">
                            <div className="flex gap-2 items-center">
                                <div className="font-display">Time remaining</div>
                                <PixelIcon name="Clock" size="w-4 h-4"/>
                            </div>

                            <div>
                                <div className="text-accent text-2xl font-number">{formatTimeRemaining(displayInfo.timeLeftInPhase)}</div>
                            </div>
                        </div>

                        <div className="inner-panel-row !py-2">
                            <div className="flex gap-2 items-baseline">
                                <div className="font-display">Total focus</div>
                                <PixelIcon name="Heart" size="w-4 h-4"/>
                            </div>
                            <div>
                                {formatTime(displayInfo.focusAccumulated).match(/[a-zA-Z]+|[^a-zA-Z]+/g)?.map((chunk, i) => (
                                    <span key={i} className={/[a-zA-Z]/.test(chunk) ? "font-display" : "font-number text-xl"}>
                                        {chunk}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="inner-panel-row !py-2">
                            <div className="flex gap-2 items-baseline">
                                <div className="font-display">Session progress</div>
                                <PixelIcon name="Signal" size="w-4 h-4"/>
                            </div>
                            
                            <div className="font-number text-xl">
                                {displayInfo.percentSessionElapsed}
                                <span className="font-display text-sm ml-1">%</span>
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-col h-full inner-panel-row !p-2 !pt-0 font-display text-text">
                        <div className="border-b-2 border-border-light mb-1 gap-1 flex items-baseline justify-center">
                            <span>Cycle</span>
                            <span className="font-number text-xl">{displayInfo.currentCycleIndex}</span>
                            <span>of</span>
                            <span className="font-number text-xl">{session.schedule.length}</span>
                        </div>
                        
                        <div className="overflow-y-auto flex-1 overflow-x-hidden no-scrollbar">
                            {session.schedule.map((_, i) => (
                                <React.Fragment key={i}>
                                    <div className="flex items-baseline gap-1">
                                        <div className={clsx(
                                            "border-2 flex gap-1 flex items-baseline justify-center px-2",
                                            displayInfo.currentCycleIndex === i+1 ? "border-primary" : "border-transparent"
                                            )}>
                                            <span>Cycle</span>
                                            <span className="font-number text-xl">{i+1}</span>
                                            <span>:</span>

                                            {i+1 === displayInfo.currentCycleIndex && 
                                                <div 
                                                    ref={scrollRef}
                                                    className="w-18 text-center"
                                                >
                                                    {displayInfo.phase.startsWith("Focus") ? "focusing" : "on break"}
                                                </div>
                                            }
                                        </div>
                                        {i+1 < displayInfo.currentCycleIndex && 
                                            <PixelIcon name="Check" size="w-4 h-4"/>
                                        }
                                        {i+1 > displayInfo.currentCycleIndex && 
                                            <PixelIcon name="Dots" size="w-4 h-1"/>
                                        }
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>

                    </div>
                </div>
                }
            {isCompleted && 
                <button
                    onClick={endSession}
                >
                    Congratulation u nailed this focus session. Click to progress.
                </button>
            } 
            </div>
            
        </>
    )
}

export default Timer;

