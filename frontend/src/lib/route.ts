type RouteStop = {
    x: number
    y: number
    action: "idle" | "water"
    holdSeconds: number
}

type TimelineSegment = 
    | {start: number, end: number, type: "hold"; action: RouteStop["action"]} 
    | {start: number, end: number, type: "run"}

const DUCK_ROUTE: RouteStop[] = [
    { x: 63, y: 180, action: "idle", holdSeconds: 3 },
    { x: 63, y: 250, action: "idle", holdSeconds: 5 },
    { x: 63, y: 275, action: "idle", holdSeconds: 0 },
    { x: 28, y: 275, action: "water", holdSeconds: 20 },
    { x: 63, y: 275, action: "idle", holdSeconds: 0 },
    { x: 63, y: 307, action: "water", holdSeconds: 20 },
];

const calculateMoveTime = (total_session_planned: number, route: RouteStop[]): TimelineSegment[] => {
    let sumHoldSeconds = route[0].holdSeconds
    const distancePerLeg = [0]
    for (let i = 1; i < route.length; i++){
        distancePerLeg.push(Math.sqrt((route[i].x - route[i-1].x)**2 + (route[i].y - route[i-1].y)**2))
        sumHoldSeconds += route[i].holdSeconds
    }

    const runBudget = total_session_planned - sumHoldSeconds
    const totalRunDistance = distancePerLeg.reduce((sum, i) => sum + i, 0)

    const timeline: TimelineSegment[] = []
    let cursor = 0
    
    for (let i = 0; i < distancePerLeg.length; i++){
        const duration = runBudget * (distancePerLeg[i] / totalRunDistance)
        const holdDuration = route[i].holdSeconds

        if (duration > 0){
            timeline.push({start: cursor, end: cursor + duration, type: "run"})
            cursor += duration
        }
        

        if (route[i].holdSeconds > 0){
            timeline.push({start: cursor, end: cursor + holdDuration, type: "hold", action: route[i].action})
            cursor += holdDuration
        }
    }

    return timeline
}

export { DUCK_ROUTE, calculateMoveTime}