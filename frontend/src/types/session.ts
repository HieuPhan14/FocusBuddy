import type { UserPublic } from "./user"

export interface SessionSchedule {
    schedule: [number, number][]
    cycle_focus_seconds: number
    cycle_break_seconds: number
}

export interface SessionResponse extends SessionSchedule {
    id: string
    status: "completed" | "abandoned" | "in_progress"
    started_at: string 
    ended_at?: string
    owner: UserPublic
    mode: "light" | "normal" | "intense" | "custom"
    session_planned_seconds: number
}

export interface SessionCreate {
    session_planned_seconds: number
    mode: "light" | "normal" | "intense" | "custom"
    cycle_focus_seconds: number | null
    cycle_break_seconds: number | null
}

export interface SessionUpdate {
    status: "completed" | "abandoned"
}

export interface PaginatedSessionResponse {
    sessions: SessionResponse[]
    total: number
    skip: number
    limit: number
    has_more: boolean
}