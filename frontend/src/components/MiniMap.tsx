import { useCallback, useEffect, useRef, useState } from "react";
import { useTimer } from "../hooks/useTimer";
import camera, { SCALE } from "../lib/camera";
import MapScene from "./MapScene";

const MiniMap = () => {
    const { manualCameraCenter, setManualCameraCenter, duckState, cameraHeight, cameraWidth } = useTimer()
    const cameraCoordinates = camera(manualCameraCenter ?? {x: (duckState?.x ?? 0) + 24, y: (duckState?.y ?? 0) + 24}, cameraWidth, cameraHeight)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const minimapRef = useRef<HTMLDivElement>(null)

    const handleMiniMapClick = useCallback((e: {clientX: number, clientY: number}) => {
        if (!minimapRef.current) return

        const rect = minimapRef.current.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const clickY= e.clientY - rect.top
        setManualCameraCenter({x: clickX*4, y: clickY*4})
    }, [setManualCameraCenter])

    useEffect(() => {
        if (!isDragging) return

        const handleMove = (e: MouseEvent) => handleMiniMapClick(e)
        const handleUp = () => setIsDragging(false)

        window.addEventListener("mousemove", handleMove)
        window.addEventListener("mouseup", handleUp)

        return () => {
            window.removeEventListener("mousemove", handleMove)
            window.removeEventListener("mouseup", handleUp)
        }

    }, [isDragging, handleMiniMapClick])

    return (
    <>
        <div 
            className="hidden min-[800px]:block box-content border-2 border-border rounded-sm shadow-[4px_4px_0_rgba(74,63,53,0.35)] bg-surface absolute w-[160px] h-[168px] left-full ml-8 top-0 overflow-hidden"
            ref={minimapRef}
            onMouseDown={(e) => { 
                e.preventDefault()
                setIsDragging(true)
                handleMiniMapClick(e)
            }}
        >
            <div 
                className="relative w-[640px] h-[672px]"
                style={{
                    transform: "scale(0.25)",     
                    transformOrigin: "top left"       
                }}
            >
                <MapScene />
                <div 
                    className="absolute border-8 border-accent shadow-[0_0_4px_white]"
                    style={{
                        left: -cameraCoordinates.tx,
                        top: -cameraCoordinates.ty,
                        width: cameraWidth / SCALE,
                        height: cameraHeight / SCALE,
                    }}
                ></div>  
            </div>
        </div>
    </>
    )
}

export default MiniMap;