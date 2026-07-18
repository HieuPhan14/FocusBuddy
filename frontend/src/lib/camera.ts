import type { DuckInfo } from "./route"

const camera = (MAP_WIDTH: number, MAP_HEIGHT: number, duckState: DuckInfo | null, cameraWidth: number, cameraHeight:number, SCALE: number): {tx: number, ty: number} => {
    // which map coordinates sitting at camera top left corner
    const cameraTopLeftX = ((duckState?.x ?? 0) + 24) - (cameraWidth / 2) / SCALE
    const cameraTopLeftY = ((duckState?.y ?? 0) + 24) - (cameraHeight / 2) / SCALE
    // ----------------------------

    const cameraX = Math.max(0, Math.min(MAP_WIDTH - cameraWidth / SCALE, cameraTopLeftX))
    const cameraY = Math.max(0, Math.min(MAP_HEIGHT - cameraHeight / SCALE, cameraTopLeftY))

    //cameraTopLeftX + shift = 0 => shift = negative
    return {tx: -cameraX, ty: -cameraY}
}

export default camera;