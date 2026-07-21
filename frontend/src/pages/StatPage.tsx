import { useEffect, useRef, useState } from "react";
import getStats from "../services/stats";
import type { StatResponse } from "../types/stats";
import getErrorMessage from "../utils/errorUtils";
import { getAllSessions } from "../services/session";
import type { PaginatedSessionResponse } from "../types/session";
import { formatTime } from "../lib/timer";
import Loading from "../components/Loading";
import BigCard from "../components/BigCard";
import PixelIcon from "../components/PixelIcon";
import clsx from "clsx";

const statusBadgeClass: Record<string, string> = {
    completed: "badge-completed",
    abandoned: "badge-abandoned",
    in_progress: "badge-progress",
}


const StatPage = () => {
    
    const [isLoading, setIsLoading] = useState<boolean>(true)
    
    const [stat, setStat] = useState<StatResponse | null>(null)
    const [statError, setStatError] = useState<string>("")
    
    const skipRef = useRef<number>(0)
    const [sessionInfo, setSessions] = useState<PaginatedSessionResponse | null>(null)
    const [sessionsInfoError, setSessionsInfoError] = useState<string>("")
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState<boolean>(false)
    
    const loadSession = async () => {
        setIsLoadMoreLoading(true)
        setSessionsInfoError("")

        try {
            const sessionsResponse = await getAllSessions(skipRef.current)
            setSessions(prev => {
                const oldSession = prev?.sessions ?? []
                const newSession = sessionsResponse.sessions
                const mergeSession = [...oldSession, ...newSession]

                return {
                    ...sessionsResponse,
                    sessions: mergeSession
                }
            })

        } catch (error) {
            setSessionsInfoError(getErrorMessage(error))

        } finally {
            setIsLoadMoreLoading(false)
        }
    }
    
    useEffect(() => {
        let ignore = false 

        const load = async () => {
            const statPromise = getStats()
            const sessionsPromise = getAllSessions(skipRef.current)

            try {
                const statResponse = await statPromise
                if (!ignore) setStat(statResponse)
            } catch (error) {
                if (!ignore) setStatError(getErrorMessage(error))
            } finally {
                setIsLoading(false)
            }

            try {
                const sessionsResponse = await sessionsPromise
                if (!ignore) setSessions(sessionsResponse)
            } catch (error) {
                if (!ignore) setSessionsInfoError(getErrorMessage(error))
            } finally {
                setIsLoadMoreLoading(false)
            }

        }

        load()
        return () => { ignore = true }
    }, [])

    return (
    <>
        <BigCard>  
            <div className="flex flex-col gap-2">
                {isLoading ? <Loading /> :
                <div className="flex flex-col gap-4 m-2">
                    {statError && <div className="text-error body-text inner-panel-row mt-3">{statError}</div>}
                    <h1 className="text-center text-2xl font-display text-text mt-1">Statistic</h1>
                    
                    {stat &&
                        <div
                            className="grid grid-cols-2 gap-3"
                        >
                            <div className="inner-panel-row flex flex-col items-center gap-1 p-3">
                                <PixelIcon name="Clock" /> 
                                <span className="font-number text-3xl text-accent">
                                    {stat.total_focus_time}
                                </span> 
                                
                                <span className="font-display text-sm text-muted">
                                    hours focused
                                </span>
                            </div>

                            <div className="inner-panel-row flex flex-col items-center gap-1 p-3">
                                <PixelIcon name="Check" /> 
                                <span className="font-number text-3xl text-accent">
                                    {stat.number_of_completed_sessions}
                                </span> 
                                
                                <span className="font-display text-sm text-muted">
                                    sessions done
                                </span>
                            </div>

                            <div className="inner-panel-row flex flex-col items-center gap-1 p-3">
                                <PixelIcon name="Calendar" /> 
                                <span className="font-number text-3xl text-accent">
                                    {stat.last_session_date 
                                    ?   
                                    <span className="text-lg mx-2">
                                        {new Date(stat.last_session_date).toLocaleString().match(/[a-zA-Z]+|[^a-zA-Z]+/g)?.map((chunk, i) => (
                                            <span key={i} className={/[a-zA-Z]/.test(chunk) ? "font-display" : "font-number text-2xl"}>
                                                {chunk}
                                            </span>
                                        ))} 
                                    </span>
                                    :   "No sessions yet"
                                    }
                                </span> 
                                
                                <span className="font-display text-sm text-muted">
                                    last session date and time
                                </span>
                            </div>
                        
                            <div className="inner-panel-row flex flex-col items-center gap-1 p-3">
                                <PixelIcon name="Star" /> 
                                <span className="font-number text-3xl text-accent">
                                    {stat.longest_streak}
                                </span> 
                                
                                <span className="font-display text-sm text-muted">
                                    days streak
                                </span>
                            </div>
                        </div>
                    }
                </div>
                }

                <div>
                    {sessionsInfoError && <div className="text-error body-text inner-panel-row mt-3">{sessionsInfoError}</div>}
                    
                    {sessionInfo && 
                    <>
                        {sessionInfo.sessions.length === 0 && <div className="flex justify-center text-text mt-10 text-lg font-display">No sessions yet - start your first focus session!</div>} 
                        <div className="flex flex-col font-display text-text text-lg mx-2">
                            {sessionInfo.sessions.map((session) => {
                                const durationSeconds = session.ended_at ? (new Date(session.ended_at).getTime() - new Date(session.started_at).getTime())/1000 : 0

                                return(
                                    <div key={session.id} className="inner-panel-row m-2 mx-5">
                                        <div className="flex items-center justify-between gap-2">
                                            <div>Status: 
                                                <span className={clsx("ml-1", statusBadgeClass[session.status])}>
                                                    {session.status === "in_progress" ? "In Progress" : session.status}
                                                </span>
                                            </div>

                                            <div className="flex text-sm items-center text-muted">
                                                <div className="h-5">Mode: 
                                                    <span className="ml-1">
                                                        {session.mode}
                                                    </span>
                                                </div>

                                                <span className="mx-1">·</span>

                                                <div className="h-5">Planned time: 
                                                    <span className="ml-1">
                                                            {formatTime(session.session_planned_seconds).match(/[a-zA-Z]+|[^a-zA-Z]+/g)?.map((chunk, i) => (
                                                                <span key={i} className={/[a-zA-Z]/.test(chunk) ? "font-display" : "font-number"}>
                                                                    {chunk}
                                                                </span>
                                                            ))} 
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {session.status === "abandoned" && 
                                            <div>Completion:                                         
                                                <span className="ml-2 font-number">{Math.min(100, (durationSeconds / session.session_planned_seconds)*100).toFixed(2)}</span>    
                                                <span>%</span>   
                                            </div>
                                        }

                                        <div>Started at: 
                                            {session.started_at
                                                ? 
                                                <span className="text-lg ml-2">
                                                    {new Date(session.started_at).toLocaleString().match(/[a-zA-Z]+|[^a-zA-Z]+/g)?.map((chunk, i) => (
                                                        <span key={i} className={/[a-zA-Z]/.test(chunk) ? "font-display" : "font-number text-xl"}>
                                                            {chunk}
                                                        </span>
                                                    ))} 
                                                </span>

                                                : "No date to show"
                                            }
                                            
                                        </div>
                                    </div>                  
                                )
                            })}

                            {sessionInfo.has_more &&
                                <button
                                    className="btn-secondary m-5"
                                    disabled={isLoadMoreLoading}
                                    onClick={() => {
                                        skipRef.current += 10
                                        loadSession()
                                    }}
                                >
                                    Load More
                                </button>
                            }
                        </div>
                    </>
                    }

                    {isLoadMoreLoading && <div className="mb-5 flex justify-center text-muted text-sm font-display">Loading more sessions</div>}
                    
                </div>
                
            </div>
        </BigCard>
    </>
    );
};

export default StatPage;