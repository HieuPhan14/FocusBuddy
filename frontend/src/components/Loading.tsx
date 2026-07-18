import PixelIcon from "./PixelIcon";

const Loading = () => {
    return (
    <>  
        <div className="flex justify-center mt-20">
            <PixelIcon name="Redo" size="animate-spin [animation-direction:reverse]"/>
        </div>
    </>
    )
}

export default Loading;