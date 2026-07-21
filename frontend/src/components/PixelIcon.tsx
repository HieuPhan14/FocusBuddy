import { useTheme } from "../hooks/useTheme";

interface PixelIconProps {
    name: string
    size?: string;
}

const PixelIcon = ( {name, size="w-5 h-5"}: PixelIconProps ) => {
    const { lightMode } = useTheme()

    return (
        <img 
            src={`/icons/${lightMode}/${name}.png`}
            className={`${size}`} 
            alt=""
        />
    )
}

export default PixelIcon;