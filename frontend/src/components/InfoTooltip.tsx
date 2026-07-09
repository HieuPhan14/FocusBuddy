import { useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useTheme } from "../hooks/useTheme"
import clsx from "clsx"

interface InfoToolTipProps {
    children: React.ReactNode
    trigger: React.ReactNode
}

const InfoTooltip = ( {children, trigger}: InfoToolTipProps) => {
    const { theme } = useTheme()

    const [maxHeight, setMaxHeight] = useState<number>(300)
    const [isHovering, setIsHovering] = useState<boolean>(false)
    const [pos, setPos] = useState<{top: number; left: number}>({top: 0, left: 0})

    const iconRef = useRef<HTMLSpanElement>(null)
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null> (null)

    const handleEnter = () => {
        if (iconRef.current){
            const rect = iconRef.current.getBoundingClientRect()

            const tooltipWidth = 400
            const marginReserve = 20
            const maxAllowedLeft = window.innerWidth - tooltipWidth - marginReserve
            const availableHeight = window.innerHeight - rect.bottom - 20
            const left = Math.min(rect.left, maxAllowedLeft)

            setPos({ top: rect.bottom, left: left })
            setMaxHeight(availableHeight)
        }
        setIsHovering(true)
    }

    const cancelClose = () => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current)
            closeTimer.current = null
        }
    }

    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => setIsHovering(false), 500)
    }

    return (
        <>
            <span
                ref={iconRef}
                className="relative inline-block"
                onMouseEnter={() => {
                    cancelClose();
                    handleEnter()
                }}
                onMouseLeave={scheduleClose}
                >
                {trigger}
            </span>

            {isHovering && createPortal(
                <div
                    style={{ position: "fixed", top: pos.top, left: pos.left, maxHeight }}
                    className={clsx("overflow-y-auto w-[400px] bg-surface-alt border-2 border-border-light rounded-md shadow-[6px_6px_0_rgba(74,63,53,0.35)] p-3 z-50 body-text text-text text-sm", theme === "night" && "theme-night")}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                >
                    <div className="font-display text-text text-base border-b-2 border-border-light pb-2 mb-2">Reference</div>
                    {children}
                </div>,
                document.body
            )}
        </>
    )
}

export default InfoTooltip;