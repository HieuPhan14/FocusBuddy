const MAP_WIDTH = 640
const MAP_HEIGHT = 672
export const SCALE = 2

const camera = ({x, y}: {x: number, y: number}, cameraWidth: number, cameraHeight:number): {tx: number, ty: number} => {
    // which map coordinates sitting at camera top left corner
    const cameraTopLeftX = x - (cameraWidth / 2) / SCALE
    const cameraTopLeftY = y - (cameraHeight / 2) / SCALE
    // ----------------------------

    const cameraX = Math.max(0, Math.min(MAP_WIDTH - cameraWidth / SCALE, cameraTopLeftX))
    const cameraY = Math.max(0, Math.min(MAP_HEIGHT - cameraHeight / SCALE, cameraTopLeftY))

    //cameraTopLeftX + shift = 0 => shift = negative
    return {tx: -cameraX, ty: -cameraY}
}

export default camera;