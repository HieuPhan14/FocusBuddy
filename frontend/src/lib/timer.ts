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

const formatTime = (seconds: number):string => {
    seconds = Math.floor(seconds)

    if (seconds < 60){
        return `${seconds}s`
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds/60)

        if (seconds%60 == 0)
            return `${minutes}m`
        else if (seconds%60 < 10)
            return `${minutes}m0${seconds%60}s`
        else return `${minutes}m${seconds%60}s`

    } else {
        const hours = Math.floor(seconds/3600)
        const minutes = Math.floor((seconds%3600)/60)

        if (minutes == 0){
            return `${hours}h`
        }
        else if (minutes < 10){
            if (seconds%60 == 0)
                return `${hours}h0${minutes}m`
            else if (seconds%60 < 10)
                return `${hours}h0${minutes}m0${seconds%60}s`
            else if (seconds%60 < 60)
                return `${hours}h0${minutes}m${seconds%60}s`
        } 
        else {
            if (seconds%60 == 0)
                return `${hours}h${minutes}m`
            else if (seconds%60 < 10)
                return `${hours}h${minutes}m0${seconds%60}s`
            else if (seconds%60 < 60)
                return `${hours}h${minutes}m${seconds%60}s`
        }
    }
    return ""
}

const formatTimeRemaining = (seconds: number):string => {
    seconds = Math.floor(seconds)

    if (seconds < 10){
        return `00:0${seconds}`
    } 
    else if (seconds < 60){
        return `00:${seconds}`
    }
    else if (seconds < 3600) {
        const minutes = Math.floor(seconds/60)

        if (minutes < 10){
            if (seconds%60 < 10){
                return `0${minutes}:0${seconds%60}`
            } else {
                return `0${minutes}:${seconds%60}`
            }
        } else {
            if (seconds%60 < 10){
                return `${minutes}:0${seconds%60}`
            } else {
                return `${minutes}:${seconds%60}`
            }
        }
    } else {
        const hours = Math.floor(seconds/3600)
        const minutes = Math.floor((seconds%3600)/60)

        if (minutes == 0){
            if (seconds%60 < 10)
                return `${hours}:00:0${seconds%60}`
            else if (seconds%60 < 60)
                return `${hours}:00:${seconds%60}`
        }
        else if (minutes < 10){
            if (seconds%60 < 10)
                return `${hours}:0${minutes}:0${seconds%60}`
            else if (seconds%60 < 60)
                return `${hours}:0${minutes}:${seconds%60}`
        } 
        else {
            if (seconds%60 == 0)
                return `${hours}:${minutes}:00`
            else if (seconds%60 < 10)
                return `${hours}:${minutes}:0${seconds%60}`
            else if (seconds%60 < 60)
                return `${hours}:${minutes}:${seconds%60}`
        }
    }
    return ""
}

export { handlePhase, formatTime, formatTimeRemaining };