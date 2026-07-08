interface PixelIconProps {
    name: string
    variant: "dark" | "light"
    size?: string;
}

const PixelIcon = ( {name, variant, size="w-5 h-5"}: PixelIconProps ) => {
    return (
        <img 
            src={`/icons/${variant}/${name}.png`}
            className={`[image-rendering:pixelated] ${size}`} 
            alt=""
        />
    )
}

export default PixelIcon;