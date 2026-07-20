import { useEffect, useRef, useState } from "react";
import getStats from "../services/stats";
import type { StatResponse } from "../types/stats";
import getErrorMessage from "../utils/errorUtils";
import { getAllSessions } from "../services/session";
import type { PaginatedSessionResponse } from "../types/session";
import { formatTime } from "../lib/timer";
import Loading from "../components/Loading";
import BigCard from "../components/BigCard";

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
                            className="flex flex-col font-display text-text text-lg mx-2"
                        >
                            <div>Total focus time: 
                                <span className="font-number text-2xl mx-2">
                                    {stat.total_focus_time}
                                </span> hours
                            </div>
                            
                            <div>Number of completed session: 
                                <span className="font-number text-2xl mx-2">
                                    {stat.number_of_completed_sessions}
                                </span>
                            </div>
                            
                            <div>Date of last session: 
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
                            </div>

                            <div>Longest streak: 
                                <span className="font-number text-2xl mx-2">
                                    {stat.longest_streak}   
                                </span>
                            </div>
                        </div>
                    }
                </div>
                }

                <div>
                    {sessionsInfoError && <div className="text-error body-text inner-panel-row mt-3">{sessionsInfoError}</div>}
                    {sessionInfo && 
                    <div className="flex flex-col font-display text-text text-lg mx-2">
                        {sessionInfo.sessions.map((session, i) =>
                            <div key={session.id} className="inner-panel-row m-3 mx-5">
                                <div>Session number: 
                                    <span className="font-number text-xl mx-2">
                                        {i+1}
                                    </span>
                                </div>

                                <div>Status: 
                                    <span className="mx-2">
                                        {session.status}
                                    </span>
                                </div>

                                <div>Started at: 
                                    {session.started_at
                                        ? 
                                        <span className="text-lg mx-2">
                                            {new Date(session.started_at).toLocaleString().match(/[a-zA-Z]+|[^a-zA-Z]+/g)?.map((chunk, i) => (
                                                <span key={i} className={/[a-zA-Z]/.test(chunk) ? "font-display" : "font-number text-xl"}>
                                                    {chunk}
                                                </span>
                                            ))} 
                                        </span>

                                        : "No date to show"
                                    }
                                    
                                </div>

                                <div>Ended at: 
                                    {session.ended_at 
                                        ? 
                                        <span className="text-lg mx-2">
                                            {new Date(session.ended_at).toLocaleString().match(/[a-zA-Z]+|[^a-zA-Z]+/g)?.map((chunk, i) => (
                                                <span key={i} className={/[a-zA-Z]/.test(chunk) ? "font-display" : "font-number text-xl"}>
                                                    {chunk}
                                                </span>
                                            ))} 
                                        </span>
                                        : "No date to show"
                                    }
                                </div>

                                <div>Mode: 
                                    <span className="mx-2">
                                        {session.mode}
                                    </span>
                                </div>

                                <div>Session planned time: 
                                    <span className="text-lg mx-2">
                                            {formatTime(session.session_planned_seconds).match(/[a-zA-Z]+|[^a-zA-Z]+/g)?.map((chunk, i) => (
                                                <span key={i} className={/[a-zA-Z]/.test(chunk) ? "font-display" : "font-number text-xl"}>
                                                    {chunk}
                                                </span>
                                            ))} 
                                        </span>
                                </div>
                            </div>   
                        )}

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
                    }

                    {isLoadMoreLoading && <div>Loading more sessions</div>}
                    
                </div>
                
            </div>
        </BigCard>
    </>
    );
};

export default StatPage;