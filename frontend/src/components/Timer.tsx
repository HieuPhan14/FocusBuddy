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
                <div className="flex flex-col h-3/5 items-center justify-between gap-2">
                    <div className="w-full flex-1 min-h-0 overflow-hidden relative border-b-2 border-border-light">
                        <div
                            className=""
                            style={{
                                transform: `translate(-${0}px, -${0}px) scale(.5)`,
                                transformOrigin: "top left"
                            }}
                        >
                            <img
                                src="/frame/map_v3.png"
                                className="absolute inset-0 max-w-none [image-rendering:pixelated]"
                                
                            />

                            {/* campfire */}
                            <div 
                                className="absolute w-[16px] h-[32px] left-[361px] top-[570px] bg-[url('/frame/spriteObj/Campfire.png')] animate-campfire"    
                            >
                            </div>
                            {/* - */}

                            {/* boats */}
                            <div 
                                className="absolute w-[32px] h-[16px] left-[119px] top-[595px] bg-[url('/frame/spriteObj/Boat.png')] animate-boat-right"    
                            >
                            </div>

                            <div 
                                className="absolute w-[32px] h-[16px] left-[149px] top-[610px] bg-[url('/frame/spriteObj/Boat.png')] animate-boat-right"    
                            >
                            </div>

                            <div 
                                className="absolute w-[16px] h-[32px] left-[489px] top-[620px] bg-[url('/frame/spriteObj/Boat.png')] animate-boat-up"    
                            >
                            </div>

                            <div 
                                className="absolute w-[32px] h-[16px] left-[449px] top-[496px] bg-[url('/frame/spriteObj/Boat.png')] animate-boat-left"    
                            >
                            </div>

                            <div 
                                className="absolute w-[32px] h-[16px] left-[141px] top-[120px] bg-[url('/frame/spriteObj/Boat.png')] animate-boat-right"    
                            >
                            </div>

                            <div 
                                className="absolute w-[32px] h-[16px] left-[419px] top-[78px] bg-[url('/frame/spriteObj/Boat.png')] animate-boat-left"    
                            >
                            </div>
                            {/* - */}

                            {/* fountain */}
                            <div
                                className="absolute w-[64px] h-[64px] left-[384px] top-[294px] bg-[url('/frame/spriteObj/Fountain.png')] animate-fountain"
                            >
                            </div>
                            {/* - */}

                            {/* calf eat left*/}
                            <div className="absolute w-[16px] h-[16px] left-[544px] top-[387px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[529px] top-[370px] bg-[url('/frame/animals/calf/Calf_Eat.png')] animate-calf-eat-left"
                            >
                            </div>

                            <div className="absolute w-[16px] h-[16px] left-[185px] top-[561px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[171px] top-[544px] bg-[url('/frame/animals/calf/Calf_Eat.png')] animate-calf-eat-left"
                            >
                            </div>
                            {/* - */}

                            {/* calf eat down*/}
                            <div className="absolute w-[16px] h-[16px] left-[521px] top-[373px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[505px] top-[356px] bg-[url('/frame/animals/calf/Calf_Eat.png')] animate-calf-eat-down"
                            >
                            </div>
                            {/* - */}

                            {/* calf idle*/}
                            <div className="absolute w-[16px] h-[16px] left-[513px] top-[397px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[495px] top-[380px] bg-[url('/frame/animals/calf/Calf_Idle.png')] animate-calf-idle-right"
                            >
                            </div>
                            {/* - */}

                            {/* calf sleep right*/}
                            <div className="absolute w-[16px] h-[16px] left-[509px] top-[351px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[491px] top-[334px] bg-[url('/frame/animals/calf/Calf_Sleep.png')] animate-calf-sleep-right"
                            >
                            </div>
                            {/* - */}

                            {/* chicks eat right */}
                            <div className="absolute w-[16px] h-[16px] left-[275px] top-[167px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[259px] top-[150px] bg-[url('/frame/animals/chicken/Chick_Peck.png')] animate-chick-peck-right"
                            >
                            </div>
                            {/* - */}

                            {/* chicks sleep left */}
                            <div className="absolute w-[16px] h-[16px] left-[279px] top-[131px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[263px] top-[114px] bg-[url('/frame/animals/chicken/Chick_Sleep.png')] animate-chick-sleep-left"
                            >
                            </div>
                            {/* - */}

                            {/* chicks eat down */}
                            <div className="absolute w-[16px] h-[16px] left-[295px] top-[157px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[279px] top-[140px] bg-[url('/frame/animals/chicken/Chick_Idle.png')] animate-chick-idle-front"
                            >
                            </div>
                            {/* - */}

                            {/* chickens eat left */}
                            <div className="absolute w-[16px] h-[16px] left-[323px] top-[164px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[307px] top-[146px] bg-[url('/frame/animals/chicken/Chicken_Peck.png')] animate-chicken-peck-left"
                            >
                            </div>
                            {/* - */}

                            {/* chickens sleep front */}
                            <div className="absolute w-[16px] h-[16px] left-[310px] top-[139px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[294px] top-[122px] bg-[url('/frame/animals/chicken/Chicken_Sleep.png')] animate-chicken-sleep-front"
                            >
                            </div>
                            {/* - */}

                            {/* goat eat left */}
                            <div className="absolute w-[16px] h-[16px] left-[20px] top-[500px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[4px] top-[482px] bg-[url('/frame/animals/goat/Goat_Eat.png')] animate-goat-eat-left"
                            >
                            </div>
                            {/* - */}

                            {/* goat idle left */}
                            <div className="absolute w-[16px] h-[16px] left-[121px] top-[426px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[105px] top-[408px] bg-[url('/frame/animals/goat/Goat_Idle.png')] animate-goat-idle-left"
                            >
                            </div>
                            {/* - */}

                            {/* goat eat front */}
                            <div className="absolute w-[16px] h-[16px] left-[143px] top-[464px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[127px] top-[446px] bg-[url('/frame/animals/goat/Goat_Eat.png')] animate-goat-eat-front"
                            >
                            </div>
                            {/* - */}

                            {/* babygoat eat right */}
                            <div className="absolute w-[16px] h-[16px] left-[1px] top-[488px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[-15px] top-[470px] bg-[url('/frame/animals/goat/BabyGoat_Eat.png')] animate-babygoat-eat-right"
                            >
                            </div>
                            {/* - */}

                            {/* babygoat idle right */}
                            <div className="absolute w-[16px] h-[16px] left-[138px] top-[380px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[123px] top-[362px] bg-[url('/frame/animals/goat/BabyGoat_Idle.png')] animate-babygoat-idle-right"
                            >
                            </div>
                            {/* - */}

                            {/* mallardduckling idle right */}
                            <div className="absolute w-[16px] h-[16px] left-[499px] top-[465px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[483px] top-[448px] bg-[url('/frame/animals/duck/MallardDuckling_Idle.png')] animate-mallardduckling-idle-right"
                            >
                            </div>

                            <div className="absolute w-[16px] h-[16px] left-[479px] top-[463px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[463px] top-[446px] bg-[url('/frame/animals/duck/MallardDuckling_Idle.png')] animate-mallardduckling-idle-right"
                            >
                            </div>
                            {/* - */}

                            {/* mallardduck idle right */}
                            <div className="absolute w-[16px] h-[16px] left-[519px] top-[461px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[503px] top-[444px] bg-[url('/frame/animals/duck/MallardDuck_Idle.png')] animate-mallardduck-idle-right"
                            >
                            </div>
                            {/* - */}

                            {/* mallardduck sleep front */}
                            <div className="absolute w-[16px] h-[16px] left-[589px] top-[453px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[573px] top-[436px] bg-[url('/frame/animals/duck/MallardDuck_Sleep.png')] animate-mallardduck-sleep-front"
                            >
                            </div>
                            {/* - */}

                            {/* mallardduckling sleep front */}
                            <div className="absolute w-[16px] h-[16px] left-[601px] top-[461px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[585px] top-[444px] bg-[url('/frame/animals/duck/MallardDuckling_Sleep.png')] animate-mallardduckling-sleep-front"
                            >
                            </div>
                            {/* - */}

                            {/* cow idle right */}
                            <div className="absolute w-[16px] h-[16px] left-[123px] top-[564px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[103px] top-[546px] bg-[url('/frame/animals/calf/Cow_Idle.png')] animate-cow-idle-right"
                            >
                            </div>
                            {/* - */}

                            {/* lamb eat left */}
                            <div className="absolute w-[16px] h-[16px] left-[504px] top-[297px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[489px] top-[280px] bg-[url('/frame/animals/lamb/Lamb_Eat.png')] animate-lamb-eat-left"
                            >
                            </div>
                            {/* - */}

                            {/* lamb eat front */}
                            <div className="absolute w-[16px] h-[16px] left-[527px] top-[301px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[511px] top-[285px] bg-[url('/frame/animals/lamb/Lamb_Eat.png')] animate-lamb-eat-front"
                            >
                            </div>
                            {/* - */}

                            {/* lamb sleep front */}
                            <div className="absolute w-[16px] h-[16px] left-[593px] top-[237px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[577px] top-[220px] bg-[url('/frame/animals/lamb/Lamb_Sleep.png')] animate-lamb-sleep-front"
                            >
                            </div>
                            {/* - */}

                            {/* lamb eat right */}
                            <div className="absolute w-[16px] h-[16px] left-[598px] top-[271px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[581px] top-[254px] bg-[url('/frame/animals/lamb/Lamb_Eat.png')] animate-lamb-eat-right"
                            >
                            </div>
                            {/* - */}

                            {/* sheep eat right */}
                            <div className="absolute w-[16px] h-[16px] left-[600px] top-[577px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[581px] top-[560px] bg-[url('/frame/animals/sheep/Sheep_Eat.png')] animate-sheep-eat-right"
                            >
                            </div>
                            {/* - */}

                            {/* sheep eat left */}
                            <div className="absolute w-[16px] h-[16px] left-[575px] top-[562px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[561px] top-[545px] bg-[url('/frame/animals/sheep/Sheep_Eat.png')] animate-sheep-eat-left"
                            >
                            </div>
                            {/* - */}

                            {/* sheep idle back */}
                            <div className="absolute w-[16px] h-[16px] left-[549px] top-[548px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[533px] top-[530px] bg-[url('/frame/animals/sheep/Sheep_Eat.png')] animate-sheep-eat-back"
                            >
                            </div>
                            {/* - */}

                            {/* sheep sleep left */}
                            <div className="absolute w-[16px] h-[16px] left-[556px] top-[580px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[543px] top-[562px] bg-[url('/frame/animals/sheep/Sheep_Sleep.png')] animate-sheep-sleep-left"
                            >
                            </div>
                            {/* - */}

                            {/* sheep idle front */}
                            <div className="absolute w-[16px] h-[16px] left-[605px] top-[553px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[589px] top-[535px] bg-[url('/frame/animals/sheep/Sheep_Idle.png')] animate-sheep-idle-front"
                            >
                            </div>
                            {/* - */}

                            {/* slime idle front */}
                            <div className="absolute w-[16px] h-[16px] left-[368px] top-[609px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[352px] top-[593px] bg-[url('/frame/animals/slime/Slime_Idle.png')] animate-slime-idle-front"
                            >
                            </div>
                            {/* - */}

                            {/* slime idle right */}
                            <div className="absolute w-[16px] h-[16px] left-[352px] top-[602px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[336px] top-[586px] bg-[url('/frame/animals/slime/Slime_Idle.png')] animate-slime-idle-right"
                            >
                            </div>
                            {/* - */}

                            {/* bat idle left */}
                            <div className="absolute w-[16px] h-[16px] left-[373px] top-[459px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[357px] top-[436px] bg-[url('/frame/animals/bat/Bat_Idle.png')] animate-bat-idle-left"
                            >
                            </div>
                            {/* - */}

                            {/* monkey idle front */}
                            <div className="absolute w-[16px] h-[16px] left-[67px] top-[522px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[51px] top-[504px] bg-[url('/frame/characters/monkey/Idle_monkey.png')] animate-monkey-idle-front"
                            >
                            </div>
                            {/* - */}

                            {/* lion idle front */}
                            <div className="absolute w-[16px] h-[16px] left-[253px] top-[416px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[237px] top-[398px] bg-[url('/frame/characters/lion/Idle_lion.png')] animate-lion-idle-left"
                            >
                            </div>
                            {/* - */}

                            {/* base idle right */}
                            <div className="absolute w-[16px] h-[16px] left-[402px] top-[267px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[386px] top-[249px] bg-[url('/frame/characters/base/Base_Idle.png')] animate-base-idle-right"
                            >
                            </div>

                            <div className="absolute w-[16px] h-[16px] left-[239px] top-[457px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[223px] top-[438px] bg-[url('/frame/characters/base/Base_Idle.png')] animate-base-idle-right"
                            >
                            </div>
                            {/* - */}

                            {/* base idle front */}
                            <div className="absolute w-[16px] h-[16px] left-[221px] top-[253px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[205px] top-[234px] bg-[url('/frame/characters/base/Base_Idle.png')] animate-base-idle-front"
                            >
                            </div>
                            {/* - */}

                            {/* base idle back */}
                            <div className="absolute w-[16px] h-[16px] left-[23px] top-[551px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[7px] top-[533px] bg-[url('/frame/characters/base/Base_Idle.png')] animate-base-idle-back"
                            >
                            </div>
                            {/* - */}

                            {/* bunny idle left */}
                            <div className="absolute w-[16px] h-[16px] left-[425px] top-[270px] bg-[url('/frame/shadow.png')]"></div>
                            <div
                                className="absolute w-[48px] h-[48px] left-[409px] top-[252px] bg-[url('/frame/characters/bunny/Bunny_Idle.png')] animate-bunny-idle-left"
                            >
                            </div>
                            {/* - */}

                            {/* DUCK - MAIN CHARACTER */}
                            <div className="absolute" style={{ left: 63, top: 180 }}>
                                <div className="absolute w-[16px] h-[16px] left-[15px] top-[18px] bg-[url('/frame/shadow.png')]"></div>
                                <div
                                    className="absolute w-[48px] h-[48px] left-0 top-0 bg-[url('/frame/characters/duck_main/Duck_Run.png')] animate-duck-run-front"
                                ></div>
                            </div>
                            
                            {/* - */}
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

