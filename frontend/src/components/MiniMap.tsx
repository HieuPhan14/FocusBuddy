import { useTimer } from "../hooks/useTimer";

const MiniMap = () => {
    const { duckState } = useTimer() 

    return (
    <>
        <div className="border-4 border-border rounded-md shadow-[6px_6px_0_rgba(74,63,53,0.35)] bg-surface absolute w-[160px] h-[168px] left-full ml-8 top-0">
            <img
                className="w-full h-full"
                src="/frame/map_v3.png"
                alt="minimap"
            />
        </div>
    </>
    )
}

export default MiniMap;