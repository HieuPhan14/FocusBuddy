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
    const [cycleFocusTime, setCycleFocusTime] = useState<number>(0)
    const [cycleBreakTime, setCycleBreakTime] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [customSessionHour, setcustomSessionHour] = useState<string>("")
    const [customSessionMinute, setcustomSessionMinute] = useState<string>("")
    const [selectedOption, setSelectedOption] = useState<string>("3600")
    

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try{
            setIsLoading(true)
            const response = await api.post<SessionResponse>(
                "/api/sessions/schedule",
                {
                    session_planned_seconds: Number(sessionLength),
                    mode: mode,
                    cycle_focus_seconds: mode === "custom" ? cycleFocusTime : null,
                    cycle_break_seconds: mode === "custom" ? cycleBreakTime : null
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
                            setSelectedOption(e.target.value)
                            if (e.target.value != "custom"){
                                setSessionLength(e.target.value)
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
                {/* fix seconds input thing */}
                {mode === "custom" &&
                    <>
                        <div className="">
                            <label htmlFor="cycle_focus" className="">
                                Focus time in 1 cycle
                            </label>
                            <input 
                                id="cycle_focus"
                                className=""
                                type="number"
                                min={600}
                                max={10800}
                                value={cycleFocusTime}
                                onChange={(e) => setCycleFocusTime(Number(e.target.value))}
                                required
                            />
                        </div>

                        <div className="">
                            <label htmlFor="cycle_break" className="">
                                Break time in 1 cycle
                            </label>
                            <input 
                                id="cycle_break"
                                className=""
                                type="number"
                                min={60}
                                max={3600}
                                value={cycleBreakTime}
                                onChange={(e) => setCycleBreakTime(Number(e.target.value))}
                                required
                            />
                        </div>
                    </>
                }

                {error && <p>{error}</p>}

                <button className="border border-red-400">
                    Let's Lock In
                </button>
            </form>
        </div>
        }
    </>
    );
};

export default SessionConfig;