import React, { useState }  from "react";
import getErrorMessage from "../utils/errorUtils";
import type { SessionCreate, SessionResponse, SessionSchedule } from "../types/session"
import {createSession} from "../services/session";
import PixelIcon from "./PixelIcon";
import InfoTooltip from "./InfoTooltip";
import modeInfo from "../lib/modeInfo";
import Loading from "./Loading";

export type SessionMode = "light" | "normal" | "custom" | "intense"

interface SessionStartProps {
    sessionStart: (data: SessionSchedule | SessionResponse) => void
    isAuth: boolean
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
    audioRef: React.RefObject<HTMLAudioElement | null>
}

const SessionConfig = ( { sessionStart, isAuth, setIsPlaying, audioRef }: SessionStartProps ) => {
    const [sessionLength, setSessionLength] = useState<string>("3600")
    const [mode, setMode] = useState<SessionMode>("light")
    const [cycleFocusTime, setCycleFocusTime] = useState<string>("")
    const [cycleBreakTime, setCycleBreakTime] = useState<string>("")
    const [customSessionHour, setcustomSessionHour] = useState<string>("")
    const [customSessionMinute, setcustomSessionMinute] = useState<string>("")
    const [selectedOption, setSelectedOption] = useState<string>("3600")
    
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);

    const sessionValidation = (sessionLength: number): boolean => {
        if (sessionLength === 0){
            setError("Please enter at least hours or minutes for your session length.")
            return false
        }
        if (sessionLength < 600){
            setError("Please enter a session with at least 10 minutes length.")
            return false
        }
        if (sessionLength > 36000){
            setError("Sessions are capped at 10 hours to align with healthy focus limits.")
            return false
        }
        return true
    }

    const customValidation = (cycle_focus_seconds: number, cycle_break_seconds:number): boolean => {
        if (cycle_focus_seconds < 600 || cycle_focus_seconds > 10800){
            setError("Please enter valid focus duration (10-180 mins).")
            return false
        }
        if (cycle_break_seconds < 60 || cycle_break_seconds > 3600){
            setError("Please enter valid break duration (1-60 mins).")
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.SyntheticEvent): Promise<boolean> => {
        e.preventDefault()

        if (!sessionValidation(Number(sessionLength))) 
            return false

        if (mode === "custom" && !customValidation(Number(cycleFocusTime)*60, Number(cycleBreakTime)*60))
            return false

        try{
            setIsLoading(true)
            const session: SessionCreate = {
                session_planned_seconds: Number(sessionLength),
                mode: mode,
                cycle_focus_seconds: mode === "custom" ? Number(cycleFocusTime)*60 : null,
                cycle_break_seconds: mode === "custom" ? Number(cycleBreakTime)*60 : null
            }

            const response = await createSession(session, isAuth)
            sessionStart(response)
            return true

        } catch (error){
            setError(getErrorMessage(error))
            return false

        } finally {
            setIsLoading(false)
        }
    }

    return (
    <>
        {isLoading ? <Loading /> :
        <>
            <form
                className="flex flex-col gap-4 m-2"
                onSubmit={async (e) => {
                    const success = await handleSubmit(e)
                    if (success){
                        audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
                    }
                }}
            >
                <h1 className="text-center text-2xl font-display text-text my-1">Create Session</h1>

                <div className="flex flex-col gap-1">
                    <label htmlFor="session_length" className="font-display text-text text-lg">
                        Session Length 
                    </label>

                    <div className="relative">
                        <select
                            className="pr-6 text-text pl-2 w-full bg-input border-2 border-border-light rounded-md body-text [appearance:none]"
                            id="session_length"
                            value={selectedOption}
                            onChange={(e) => {
                                setError(null)
                                setSelectedOption(e.target.value)
                                if (e.target.value != "custom"){
                                    setSessionLength(e.target.value)
                                } else {
                                    setSessionLength("0")
                                }
                            }}
                        >
                            <option value="1500">25 minutes</option>
                            <option value="3000">50 minutes</option>
                            <option value="3600">1 hour</option>
                            <option value="7200">2 hours</option>
                            <option value="14400">4 hours</option>
                            <option value="28800">8 hours</option>
                            <option value="custom">Custom</option>
                        </select>

                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                            <PixelIcon name="Chevron-Arrow-Down" size="w-2 h-[5px]"/>
                        </div>
                    </div>

                    {selectedOption === "custom" && 
                    <div className="flex gap-2 inner-panel-row">
                        <div className="flex gap-2">
                            <input 
                                className="text-text w-14 text-center bg-input border-2 border-border-light rounded-md body-text"
                                id="hours"
                                type="number"
                                min={0}
                                max={9}
                                value={customSessionHour}
                                onChange={(e) => {
                                    setError(null)
                                    const newHour = Number(e.target.value) * 3600
                                    setcustomSessionHour(e.target.value)
                                    setSessionLength(String(newHour + Number(customSessionMinute) * 60))
                                }}
                            />
                            <label htmlFor="hours" className="font-display text-text">
                                hour(s) 
                            </label>
                        </div>

                        <div className="flex gap-2">
                            <input 
                                className="text-text w-14 text-center bg-input border-2 border-border-light rounded-md body-text"
                                id="minutes"
                                type="number"
                                min={0}
                                max={59}
                                value={customSessionMinute}
                                onChange={(e) => {
                                    setError(null)
                                    const newMinute = Number(e.target.value) * 60
                                    setcustomSessionMinute(e.target.value)
                                    setSessionLength(String(newMinute + Number(customSessionHour) * 3600))
                                }}
                            />
                            <label htmlFor="minutes" className="font-display text-text">
                                minute(s) 
                            </label>
                        </div>
                    </div>
                    
                    }
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="mode" className="font-display text-text text-lg">
                            Focus mode
                        </label>

                        <div className="relative">
                            <select
                                className="pr-6 text-text pl-2 w-full bg-input border-2 border-border-light rounded-md body-text [appearance:none]"
                                id="mode"
                                value={mode}
                                onChange={(e) => setMode(e.target.value as SessionMode)}
                            >
                                <option value="light">Light Mode</option>
                                <option value="normal">Normal Mode</option>
                                <option value="intense">Intense Mode</option>
                                <option value="custom">Custom Mode</option>
                            </select>

                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <PixelIcon name="Chevron-Arrow-Down" size="w-2 h-[5px]"/>
                            </div>
                        </div>
                    </div>

                    <div className="text-text body-text inner-panel-row">

                        <div className="flex items-center justify-between mb-1">
                            {modeInfo[mode].title}
                            <InfoTooltip 
                                trigger={<PixelIcon name="Info" size="w-2 h-4 inline align-baseline" />}
                                children={modeInfo[mode].detail}
                            />
                        </div>

                        <p className="body-text text-sm text-text">{modeInfo[mode].summary}</p>
                    </div>
                    
                    {mode === "custom" &&
                    <div className="inner-panel-row">
                        <div className="flex gap-2">
                            <label htmlFor="cycle_focus" className="font-display text-text">
                                Focus time in a cycle
                            </label>
                            <input 
                                className="text-text w-14 text-center bg-input border-2 border-border-light rounded-md body-text"
                                id="cycle_focus"
                                type="number"
                                min={10}
                                max={180}
                                value={cycleFocusTime}
                                onChange={(e) => setCycleFocusTime(e.target.value)}
                                required
                                />
                            <div className="font-display text-text">minute(s)</div>
                        </div>

                        <div className="flex gap-2">
                            <label htmlFor="cycle_break" className="font-display text-text">
                                Break time in a cycle
                            </label>
                            <input 
                                className="text-text w-14 text-center bg-input border-2 border-border-light rounded-md body-text"
                                id="cycle_break"
                                type="number"
                                min={1}
                                max={60}
                                value={cycleBreakTime}
                                onChange={(e) => setCycleBreakTime(e.target.value)}
                                required
                                />
                            <div className="font-display text-text">minute(s)</div>
                        </div>
                    </div>
                    }
                </div>

                {error && <div className="text-error body-text inner-panel-row mt-3">{error}</div>}

                <button 
                    type="submit"
                    className="btn-primary mt-2"
                    disabled={isLoading}
                    >Let's Lock In
                </button>

            </form>
        </>
        }
    </>
    );
};

export default SessionConfig;