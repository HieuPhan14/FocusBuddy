import React, { useState }  from "react";
import api from "../services/api";
import getErrorMessage from "../utils/errorUtils";
import type { SessionResponse } from "../types/session"

type SessionMode = "light" | "normal" | "custom" | "intense"

interface SessionStartProps {
    sessionStart: (data: SessionResponse) => void
}

const SessionConfig = ( { sessionStart }: SessionStartProps ) => {
    const [sessionLength, setSessionLength] = useState<string>("3600")
    const [mode, setMode] = useState<SessionMode>("light")
    const [cycleFocusTime, setCycleFocusTime] = useState<string>("")
    const [cycleBreakTime, setCycleBreakTime] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [customSessionHour, setcustomSessionHour] = useState<string>("")
    const [customSessionMinute, setcustomSessionMinute] = useState<string>("")
    const [selectedOption, setSelectedOption] = useState<string>("3600")
    
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

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()

        if (!sessionValidation(Number(sessionLength))) 
            return

        if (mode === "custom" && !customValidation(Number(cycleFocusTime)*60, Number(cycleBreakTime)*60))
            return

        try{
            setIsLoading(true)
            const response = await api.post<SessionResponse>(
                "/api/sessions/schedule",
                {
                    session_planned_seconds: Number(sessionLength),
                    mode: mode,
                    cycle_focus_seconds: mode === "custom" ? Number(cycleFocusTime)*60 : null,
                    cycle_break_seconds: mode === "custom" ? Number(cycleBreakTime)*60 : null
                }
            )
            sessionStart(response.data)
        } catch (error){
            setError(getErrorMessage(error))
        } finally {
            setIsLoading(false)
        }
    }

    return (
    <>
        {isLoading ? <p>Loading</p> :
        <div className="border border-red-400 min-h-screen">
            <form
                className=""
                onSubmit={handleSubmit}
            >
                <div className="">
                    <label htmlFor="session_length" className="">
                        Session Length 
                    </label>

                    <select
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

                    {selectedOption === "custom" && 
                        <div>
                            <input 
                                id="hours"
                                className=""
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
                            <label htmlFor="hours" className="">
                                hour(s) 
                            </label>

                            <input 
                                id="minutes"
                                className=""
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
                            <label htmlFor="minutes" className="">
                                minute(s) 
                            </label>
                        </div>
                    }
                </div>

                <div className="">
                    <label htmlFor="mode" className="">
                        Focus mode
                    </label>
                    <select
                        id="mode"
                        value={mode}
                        onChange={(e) => setMode(e.target.value as SessionMode)}
                    >
                        <option value="light">Light Mode</option>
                        <option value="normal">Normal Mode</option>
                        <option value="intense">Intense Mode</option>
                        <option value="custom">Custom Mode</option>
                    </select>
                </div>
    
                {mode === "custom" &&
                    <>
                        <div className="flex">
                            <label htmlFor="cycle_focus" className="">
                                Focus time in a cycle
                            </label>
                            <input 
                                id="cycle_focus"
                                className=""
                                type="number"
                                min={10}
                                max={180}
                                value={cycleFocusTime}
                                onChange={(e) => setCycleFocusTime(e.target.value)}
                                required
                            />
                            <div>minute(s)</div>
                        </div>

                        <div className="flex">
                            <label htmlFor="cycle_break" className="">
                                Break time in a cycle
                            </label>
                            <input 
                                id="cycle_break"
                                className=""
                                type="number"
                                min={1}
                                max={60}
                                value={cycleBreakTime}
                                onChange={(e) => setCycleBreakTime(e.target.value)}
                                required
                            />
                            <div>minute(s)</div>
                        </div>
                    </>
                }

                {error && <p>{error}</p>}

                <button 
                    type="submit"
                    className="border border-red-400"
                    disabled={isLoading}
                    >Let's Lock In
                </button>
            </form>
        </div>
        }
    </>
    );
};

export default SessionConfig;