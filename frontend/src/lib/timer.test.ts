import { describe, it, expect } from "vitest";
import handlePhase from "./timer";

const SCHEDULE: [number, number][] = [[3120, 1020], [3120, 1020], [3120, 0]] 
const TOTAL_SESSION_PLANNED: number = SCHEDULE.reduce((acc, [a, b]) => acc + a + b, 0)

describe("test_handle_phase_pure_function", () => {
    it("start of session when elapsed = 0", () => {
        const r = handlePhase(TOTAL_SESSION_PLANNED, 0, SCHEDULE)
        expect(r.phase).toBe("Focus 1")
        expect(r.timeLeftInPhase).toBe(3120)
        expect(r.focusAccumulated).toBe(0)
        expect(r.currentCycleIndex).toBe(1)
    })

    it("in the middle of a focus phase", () => {
        const r = handlePhase(TOTAL_SESSION_PLANNED, 4567, SCHEDULE)
        expect(r.phase).toBe("Focus 2")
        expect(r.timeLeftInPhase).toBe(2693)
        expect(r.focusAccumulated).toBe(3547)
        expect(r.currentCycleIndex).toBe(2)
    })

    it("in the middle of a break phase", () => {
        const r = handlePhase(TOTAL_SESSION_PLANNED, 3999, SCHEDULE)
        expect(r.phase).toBe("Break 1")
        expect(r.timeLeftInPhase).toBe(141)
        expect(r.focusAccumulated).toBe(3120)
        expect(r.currentCycleIndex).toBe(1)
    })

    it("at the end edge of a cycle (break phase) (1)", () => {
        const r = handlePhase(TOTAL_SESSION_PLANNED, 8279, SCHEDULE)
        expect(r.phase).toBe("Break 2")
        expect(r.timeLeftInPhase).toBe(1)
        expect(r.focusAccumulated).toBe(6240)
        expect(r.currentCycleIndex).toBe(2)
    })

    it("at the start of a cycle (focus phase) (1)", () => {
        const r = handlePhase(TOTAL_SESSION_PLANNED, 8280, SCHEDULE)
        expect(r.phase).toBe("Focus 3")
        expect(r.timeLeftInPhase).toBe(3120)
        expect(r.focusAccumulated).toBe(6240)
        expect(r.currentCycleIndex).toBe(3)
    })

    it("at the start of a cycle (focus phase)_2 (1)", () => {
        const r = handlePhase(TOTAL_SESSION_PLANNED, 8281, SCHEDULE)
        expect(r.phase).toBe("Focus 3")
        expect(r.timeLeftInPhase).toBe(3119)
        expect(r.focusAccumulated).toBe(6241)
        expect(r.currentCycleIndex).toBe(3)
    })

    it("boundary test transition from focus to break (focus) (2)", () => {
        const r = handlePhase(TOTAL_SESSION_PLANNED, 3119, SCHEDULE)
        expect(r.phase).toBe("Focus 1")
        expect(r.timeLeftInPhase).toBe(1)
        expect(r.focusAccumulated).toBe(3119)
        expect(r.currentCycleIndex).toBe(1)
    })

    it("boundary test transition from focus to break (break) (2)", () => {
        const r = handlePhase(TOTAL_SESSION_PLANNED, 3120, SCHEDULE)
        expect(r.phase).toBe("Break 1")
        expect(r.timeLeftInPhase).toBe(1020)
        expect(r.focusAccumulated).toBe(3120)
        expect(r.currentCycleIndex).toBe(1)
    })

    it("boundary test transition from focus to break (break)_2 (2)", () => {
        const r = handlePhase(TOTAL_SESSION_PLANNED, 3121, SCHEDULE)
        expect(r.phase).toBe("Break 1")
        expect(r.timeLeftInPhase).toBe(1019)
        expect(r.focusAccumulated).toBe(3120)
        expect(r.currentCycleIndex).toBe(1)
    })

    it("elapsed time at very end of session", () => {
        const r = handlePhase(TOTAL_SESSION_PLANNED, 11399, SCHEDULE)
        expect(r.phase).toBe("Focus 3")
        expect(r.timeLeftInPhase).toBe(1)
        expect(r.focusAccumulated).toBe(9359)
        expect(r.currentCycleIndex).toBe(3)
    })
})