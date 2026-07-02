import { useEffect, useRef, useState } from "react";
import getStats from "../services/stats";
import type { StatResponse } from "../types/stats";
import getErrorMessage from "../utils/errorUtils";
import { getAllSessions } from "../services/session";
import type { PaginatedSessionResponse } from "../types/session";
import { formatTime } from "../lib/timer";

const StatPage = () => {
    
    const [isLoading, setIsLoading] = useState<boolean>(true)
    
    const [stat, setStat] = useState<StatResponse | null>(null)
    const [statError, setStatError] = useState<string>("")
    
    const skipRef = useRef<number>(0)
    const [sessionInfo, setSessions] = useState<PaginatedSessionResponse | null>(null)
    const [sessionsInfoError, setSessionsInfoError] = useState<string>("")
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState<boolean>(true)
    
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
        <div>
            {isLoading ? <div>Loading</div> :
            <div>
                {statError && <div>{statError}</div>}
                {stat &&
                    <div
                        className="flex flex-col"
                    >
                        <div>Total focus time: {stat.total_focus_time} hours</div>
                        <div>Number of completed session: {stat.number_of_completed_sessions}</div>
                        <div>Date of last session: 
                            {stat.last_session_date 
                                ?   new Date(stat.last_session_date).toLocaleString()
                                :   "No sessions yet"
                            }
                        </div>
                        <div>Longest streak: {stat.longest_streak}</div>
                    </div>
                }
            </div>
            }

            <div>
                {sessionsInfoError && <div>{sessionsInfoError}</div>}
                {sessionInfo && 
                <div>
                    {sessionInfo.sessions.map((session, i) =>
                        <div key={i} className="border border-red-400 m-10">
                            <div>Session ID: {session.id}</div>
                            <div>Status: {session.status}</div>

                            <div>Stated at: 
                                {session.started_at ? 
                                    new Date(session.started_at).toLocaleString()
                                    : "No date to show"
                                }
                            </div>

                            <div>Ended at: 
                                {session.ended_at ? 
                                    new Date(session.ended_at).toLocaleString()
                                    : "No date to show"
                                }
                            </div>
                            <div>Mode: {session.mode}</div>
                            <div>Session planned time: {formatTime(session.session_planned_seconds)}</div>
                        </div>   
                    )}

                    {sessionInfo.has_more &&
                        <button
                            className="border border-red-400"
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
    </>
    );
};

export default StatPage;