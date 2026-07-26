import type { SessionSchedule } from "../types/session";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {handlePhase, formatTime, formatTimeRemaining} from "../lib/timer";
import type { PhaseInfo } from "../lib/timer";
import React from "react";
import clsx from "clsx"
import { useTimer } from "../hooks/useTimer";
import PixelIcon from "./PixelIcon";
import { calculateMoveTime, DUCK_ROUTE, duckLookupPosition, type DuckInfo } from "../lib/route";
import camera, { SCALE } from "../lib/camera";
import MapScene from "./MapScene";
import Modal from "./Modal";

interface TimerProps {
    session: SessionSchedule
    handleComplete: () => Promise<void>
    handleAbandoned: () => Promise<void>
}

const Timer = ( {session, handleComplete, handleAbandoned}: TimerProps ) => {
    const {manualCameraCenter, setManualCameraCenter, cameraWidth, cameraHeight, setCameraWidth, setCameraHeight, setIsChestOpen, setIsBatAlive, setBatAnimation, setIsBatOnMap, duckState, setDuckState, isPaused, togglePause, endSession, isCompleted, setIsCompleted, startTimeRef, elapsedTimeRef, isPausedRef, accumulatedBeforeRef} = useTimer()

    const scrollRef = useRef<HTMLDivElement>(null)
    const cameraRef = useRef<HTMLDivElement>(null)

    const [displayInfo, setDisplayInfo] = useState<PhaseInfo | null>(null)
    const [isAbandoned, setIsAbandoned] = useState<boolean>(false)

    const BAT_HIT_DURATION = 6
    const BAT_HIT_DELAY = 0.75
    const BAT_DEATH_DURATION = 2
    const BAT_HIDDEN_DELAY = 4
    const fightStartRef = useRef<number | null>(null)
    
    const total_session_planned: number = session.schedule.reduce((acc, [a, b]) => acc + a + b, 0)
    const isBreak = displayInfo?.phase.startsWith("Break")
    
    const duckTimeline = useMemo(() => {
        return calculateMoveTime(total_session_planned, DUCK_ROUTE)
    },[total_session_planned])
    
    const cameraCoordinates = camera(manualCameraCenter ?? {x: (duckState?.x ?? 0) + 24, y: (duckState?.y ?? 0) + 24}, cameraWidth, cameraHeight)
    const [hasPositioned, setHasPositioned] = useState(false)

    const [syncError, setSyncError] = useState<string | null>(null)

    const handleScrollCycle = ():void => {
        scrollRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }   

    const handleBatAnimation = useCallback((currentDuck: DuckInfo, fightStart: number | null): void => {
        if (fightStart === null) return

        if (currentDuck.type === "hold" && currentDuck.action === "fight") {
            const timeSinceFightStart = elapsedTimeRef.current - fightStart

            if (timeSinceFightStart < BAT_HIT_DELAY)
                setBatAnimation("animate-bat-idle-left bg-[url('/frame/animals/bat/Bat_Idle.png')]")
            else if (timeSinceFightStart < BAT_HIT_DURATION + BAT_HIT_DELAY){
                setBatAnimation("animate-bat-hit-left bg-[url('/frame/animals/bat/Bat_Hit.png')]")
            } else 
                setBatAnimation("animate-bat-dead bg-[url('/frame/animals/bat/Bat_Death.png')]")
            
        }
    }, [elapsedTimeRef, setBatAnimation])

    //-------TICKING LOGIC----------------------------------
    useEffect(() => {
        const phaseInfo = handlePhase(total_session_planned, Math.floor(elapsedTimeRef.current), session.schedule)
        setDisplayInfo(phaseInfo)
        setDuckState(duckLookupPosition(duckTimeline, elapsedTimeRef.current))

        const id = setInterval(() => {
            if(!isPausedRef.current){
                elapsedTimeRef.current = Math.min(
                    accumulatedBeforeRef.current + (Date.now() - startTimeRef.current) /1000,
                    total_session_planned
                )
                const currentDuck = duckLookupPosition(duckTimeline, elapsedTimeRef.current)
                setDuckState(currentDuck)

                // BAT RENDERING-----------
                if (currentDuck.type === "hold" && currentDuck.action === "fight" && fightStartRef.current === null)
                    fightStartRef.current = currentDuck.start

                handleBatAnimation(currentDuck, fightStartRef.current)

                if (fightStartRef.current !== null && elapsedTimeRef.current - fightStartRef.current >= BAT_HIT_DURATION + BAT_HIT_DELAY)
                    setIsBatAlive(false)

                if (fightStartRef.current !== null && elapsedTimeRef.current - fightStartRef.current >= BAT_HIT_DURATION + BAT_DEATH_DURATION + BAT_HIDDEN_DELAY + BAT_HIT_DELAY)
                    setIsBatOnMap(false)

                // -------------------------

                // CHECK FINAL CHEST OPEN-----------
                if (currentDuck.x === DUCK_ROUTE[DUCK_ROUTE.length - 1].x && currentDuck.y === DUCK_ROUTE[DUCK_ROUTE.length - 1].y )
                    setIsChestOpen(true)

                // ---------------------------------

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
    }, [setIsBatAlive, setIsBatOnMap, setIsChestOpen, setDuckState, handleBatAnimation, setIsCompleted, session.schedule, total_session_planned, accumulatedBeforeRef, elapsedTimeRef, isPausedRef, startTimeRef, duckTimeline]);
    
    useEffect(() => {
        if (!cameraRef.current) return
        
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setCameraWidth(entry.contentRect.width)
                setCameraHeight(entry.contentRect.height)
            }
        })

        observer.observe(cameraRef.current)

        return () => observer.disconnect()

    }, [setCameraHeight, setCameraWidth])

    useEffect(() => {
        handleScrollCycle()
    }, [displayInfo?.currentCycleIndex])
    
    useEffect(() => {
        if (isCompleted)
            handleComplete().catch(() => setSyncError("Failed to save your session"))
    //eslint-disable-next-line
    }, [isCompleted])

    useEffect(() => {
        if (cameraWidth > 0 && cameraHeight > 0 && duckState != null){
            //eslint-disable-next-line
            setHasPositioned(true)
        }
    }, [cameraWidth, cameraHeight, duckState, setHasPositioned])

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
                <div className="flex flex-col h-3/5 items-center justify-between gap-2">
                    <div 
                        className="w-full flex-1 min-h-0 overflow-hidden relative border-b-2 border-border-light"
                        ref={cameraRef}
                    >
                        <div                           
                            style={{
                                transform: `scale(${SCALE}) 
                                            translate(
                                                ${cameraCoordinates.tx}px, 
                                                ${cameraCoordinates.ty}px
                                            )`
                                            ,
                                transition: hasPositioned ? "transform 250ms linear" : "none",
                                transformOrigin: "top left"
                            }}
                        >   
                            <MapScene />
                        </div>
                    </div>

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

                        <button
                            className="cursor-pointer hover:bg-input transition border-border px-2 py-1 rounded-sm border-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            disabled={!manualCameraCenter}
                            onClick={() => setManualCameraCenter(null)}
                        >
                            <PixelIcon name="Cursor"/>
                        </button>

                        <button
                            className="cursor-pointer hover:bg-input transition border-border px-2 py-1 rounded-sm border-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            onClick={() => {
                                setIsAbandoned(true)
                                setSyncError(null)
                            }}
                        >
                            <PixelIcon name="Exit"/>
                        </button>
                    </div>
                </div>

                {
                displayInfo &&

                <div className="flex h-2/5 justify-around pb-2 min-h-[220px]">
                    
                    
                    <div className="flex flex-col text-text body-text justify-between">

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

                    <div className="flex flex-col inner-panel-row !p-2 !pt-0 font-display text-text">
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
                <Modal title="Session Complete">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <p className="font-display text-text">
                            You nailed this session. 🎉🎉🎉
                        </p>
                        <p className="body-text text-muted text-sm">
                            Nice focus! Ready for the next one?
                        </p>
                        <button
                            onClick={endSession}
                            className="btn-primary"
                        >
                            Continue
                        </button>
                    </div>
                    
                    {syncError && <div className="text-error body-text inner-panel-row mt-3">{syncError}</div>}
                </Modal>
            } 

            {isAbandoned && 
                <Modal title="Session abandon" onClose={() => setIsAbandoned(false)}>
                    <div className="flex flex-col items-center gap-3 text-center">
                        <p className="font-display text-text">
                            You want to give up this session? 😢😭
                        </p>
                        <p className="font-display text-text">
                            This action can't go back.
                        </p>
                        <button
                            onClick={async () => {
                                try{
                                    await handleAbandoned(); 
                                    endSession()
                                } catch {
                                    setSyncError("Failed to save your sessions")
                                }
                            }}
                            className="btn-primary"
                        >
                            End session
                        </button>
                    </div>
                    
                    {syncError && <div className="text-error body-text inner-panel-row mt-3">{syncError}</div>}
                </Modal>
            } 
            </div>
            
        </>
    )
}

export default Timer;

