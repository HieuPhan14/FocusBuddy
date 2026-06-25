export interface PhaseInfo {
    phase: string
    currentCycleIndex: number   
    timeLeftInPhase: number
    percentSessionElapsed: number
    focusAccumulated: number
}

const handlePhase = (total_session_planned:number, elapsedTime: number, schedule: [number, number][]): PhaseInfo => {
    let runningTotal: number = 0
    let phase: string = ""
    let currentCycleIndex: number = 0
    let timeLeftInPhase: number = 0
    let focusAccumulated: number = 0
    
    for (let i = 0; i < schedule.length; i++) {
        const cycle = schedule[i]
        currentCycleIndex = i + 1

        if (elapsedTime < runningTotal + cycle[0]) {
            phase = `Focus ${i+1}`
            timeLeftInPhase = (runningTotal + cycle[0]) - elapsedTime
            focusAccumulated += elapsedTime - runningTotal
            break
        } else if (elapsedTime <  runningTotal + cycle[0] + cycle[1]) {
            phase = `Break ${i+1}`
            timeLeftInPhase = (runningTotal + cycle[0] + cycle[1]) - elapsedTime
            focusAccumulated += cycle[0]
            break
        }
        runningTotal += cycle[0] + cycle[1]
        focusAccumulated += cycle[0]
    }
    const percentSessionElapsed = parseFloat(((elapsedTime/total_session_planned)*100).toFixed(2))
    
    return {
        phase: phase,
        currentCycleIndex: currentCycleIndex,
        timeLeftInPhase: timeLeftInPhase,
        percentSessionElapsed: percentSessionElapsed,
        focusAccumulated: focusAccumulated
    }
}

export default handlePhase;