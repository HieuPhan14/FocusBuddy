import type { SessionCreate, SessionResponse, SessionSchedule } from "../types/session";
import api from "./api";

const createSession = async (session: SessionCreate, isAuthenticated: boolean): Promise<SessionResponse | SessionSchedule> => {
    if (isAuthenticated){
        const response = await api.post<SessionResponse>(
            "/api/sessions",
            {
                session_planned_seconds: session.session_planned_seconds,
                mode: session.mode,
                cycle_focus_seconds: session.cycle_focus_seconds,
                cycle_break_seconds: session.cycle_break_seconds
            }
        )
        return response.data
    }
    else {
        const response = await api.post<SessionSchedule>(
            "/api/sessions/schedule",
            {
                session_planned_seconds: session.session_planned_seconds,
                mode: session.mode,
                cycle_focus_seconds: session.cycle_focus_seconds,
                cycle_break_seconds: session.cycle_break_seconds
            }
        )
        return response.data
    }
}

export default createSession;