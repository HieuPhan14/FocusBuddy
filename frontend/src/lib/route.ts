export type RouteStop = {
    x: number
    y: number
    action?: "idle" | "water" | "fight"
    holdSeconds: number
    direction?: "left" | "right" | "front" | "back"
}

type TimelineSegment = 
    | {start: number, end: number, type: "hold"; action: RouteStop["action"], direction: "left" | "right" | "front" | "back", x: number, y: number} 
    | {start: number, end: number, type: "run", direction: "left" | "right" | "front" | "back", fromX: number, fromY: number, toX: number, toY: number}

const DUCK_ROUTE: RouteStop[] = [
    // { x: 63, y: 180, action: "idle", holdSeconds: 3, direction: "front" },
    // { x: 63, y: 250, action: "idle", holdSeconds: 5 , direction: "left"},
    // { x: 63, y: 275, holdSeconds: 0 },
    // { x: 28, y: 275, action: "water", holdSeconds: 20, direction: "front" },
    // { x: 63, y: 275, holdSeconds: 0 },
    // { x: 63, y: 307, action: "water", holdSeconds: 20, direction: "left" },
    // { x: 63, y: 385, holdSeconds: 0},
    // { x: 158, y: 385, action: "idle", holdSeconds: 5 , direction: "right"},
    // { x: 150, y: 385, holdSeconds: 0},
    // { x: 150, y: 528, holdSeconds: 0},
    // { x: 28, y: 528, action: "idle", holdSeconds: 3 , direction: "left"},
    // { x: 50, y: 528, action: "idle", holdSeconds: 10 , direction: "back"},
    // { x: 150, y: 528, holdSeconds: 0},
    // { x: 150, y: 407, holdSeconds: 0},
    // { x: 215, y: 407, action: "idle", holdSeconds: 3 , direction: "front"},
    // { x: 218, y: 407, action: "idle", holdSeconds: 10 , direction: "right"},
    { x: 335, y: 407, holdSeconds: 0},
    { x: 335, y: 438, action: "fight", holdSeconds: 12, direction: "right"},
    { x: 335, y: 545, holdSeconds: 0},
    { x: 363, y: 545, holdSeconds: 0},
    { x: 363, y: 558, action: "idle", holdSeconds: 10, direction: "front"},
    { x: 413, y: 558, holdSeconds: 0},
    { x: 413, y: 567, holdSeconds: 0},
    { x: 504, y: 567, action: "idle", holdSeconds: 10, direction: "right"},
];

export interface DuckInfo {
    start: number
    x: number
    y: number
    type: "run" | "hold"
    direction: "left" | "right" | "front" | "back"
    action?: RouteStop["action"]
}

const calculateMoveTime = (total_session_planned: number, route: RouteStop[]): TimelineSegment[] => {
    let sumHoldSeconds = route[0].holdSeconds
    const distancePerLeg = [0]
    let lastDirection: "left" | "right" | "front" | "back" = "front"

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

        
        if (duration > 0 && i > 0){
            if (route[i].y > route[i-1].y)
                lastDirection = "front"
            else if (route[i].y < route[i-1].y)
                lastDirection = "back"
            else if (route[i].x < route[i-1].x)
                lastDirection = "left"
            else if (route[i].x > route[i-1].x)
                lastDirection = "right"

            timeline.push({start: cursor, end: cursor + duration, type: "run", direction: lastDirection, fromX: route[i-1].x, fromY: route[i-1].y, toX: route[i].x, toY: route[i].y})
            cursor += duration
        }
        
        if (route[i].holdSeconds > 0){
            const direction = route[i].direction ?? lastDirection
            timeline.push({start: cursor, end: cursor + holdDuration, type: "hold", action: route[i].action, x: route[i].x, y: route[i].y, direction: direction})
            cursor += holdDuration
        }
    }

    return timeline
}

const duckLookupPosition = (timeline: TimelineSegment[], elapsedSeconds: number): DuckInfo => {
    const segment = timeline.find((obj) => elapsedSeconds <= obj.end) ?? timeline[timeline.length - 1]

    if (segment.type === "hold")
        return {start: segment.start, x: segment.x, y: segment.y, type: segment.type, direction: segment.direction, action: segment.action}
    else {
        const portion = (elapsedSeconds - segment.start) / (segment.end - segment.start)
        const x = segment.fromX + (segment.toX - segment.fromX)*portion
        const y = segment.fromY + (segment.toY - segment.fromY)*portion
        return {start: segment.start, x: x, y: y, type: segment.type, direction: segment.direction}
    }
}

export { DUCK_ROUTE, calculateMoveTime, duckLookupPosition}