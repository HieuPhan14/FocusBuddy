import type { BackgroundTheme } from "./Layout";

interface BackgroundProps {
    theme: BackgroundTheme
}

const Background = ( { theme }: BackgroundProps) => {
    return (
    <>
        {theme === "summer" && (
            <div className="absolute inset-0 overflow-hidden">
                <div>
                    <img
                        alt="" 
                        src="/backgrounds/summer/summer8_sky.png" 
                        className="absolute inset-0 w-full h-full object-fill [image-rendering:pixelated]"
                    />
                </div>

                <div className="absolute inset-0 flex w-[200%] h-full animate-drift-slow">
                    <img
                        alt="" 
                        src="/backgrounds/summer/summer8_cloud.png" 
                        className="w-1/2 h-full object-fill [image-rendering:pixelated]"
                    />
                    <img
                        alt="" 
                        src="/backgrounds/summer/summer8_cloud.png" 
                        className="w-1/2 h-full object-fill [image-rendering:pixelated]"
                    />
                </div>

                <div className="absolute inset-0 flex w-[200%] h-full animate-drift-med">
                    <img
                        alt="" 
                        src="/backgrounds/summer/summer8_lower_cloud.png" 
                        className="w-1/2 h-full object-fill [image-rendering:pixelated]"
                    />
                    <img
                        alt="" 
                        src="/backgrounds/summer/summer8_lower_cloud.png" 
                        className="w-1/2 h-full object-fill [image-rendering:pixelated]"
                    />
                </div>

                <div>
                    <img
                        alt="" 
                        src="/backgrounds/summer/summer8_grass.png" 
                        className="absolute inset-0 w-full h-full object-fill [image-rendering:pixelated]"
                    />
                </div>
            </div>    
        )}

        {theme === "beach" && (
            <div className="absolute inset-0 overflow-hidden">
                <div>
                    <img 
                        alt=""
                        src="/backgrounds/cloud_and_beach/cloud1/1.png" 
                        className="absolute inset-0 w-full h-full object-fill [image-rendering:pixelated]"
                    />
                </div>

                <div>
                    <img 
                        alt=""
                        src="/backgrounds/cloud_and_beach/cloud1/2_add.png" 
                        className="absolute inset-0 w-full h-full object-fill [image-rendering:pixelated]"
                    />
                </div>

                <div>
                    <img 
                        alt=""
                        src="/backgrounds/cloud_and_beach/cloud1/3_add.png" 
                        className="absolute inset-0 w-full h-full object-fill [image-rendering:pixelated]"
                    />
                </div>

                <div className="absolute inset-0 flex w-[200%] h-full animate-drift-slow">
                    <img 
                        alt=""
                        src="/backgrounds/cloud_and_beach/cloud1/2.png" 
                        className="w-1/2 h-full object-fill [image-rendering:pixelated]"
                    />
                    <img 
                        alt=""
                        src="/backgrounds/cloud_and_beach/cloud1/2.png" 
                        className="w-1/2 h-full object-fill [image-rendering:pixelated]"
                    />
                </div>

                <div className="absolute inset-0 flex w-[200%] h-full animate-drift-med">
                    <img 
                        alt=""
                        src="/backgrounds/cloud_and_beach/cloud1/3.png" 
                        className="w-1/2 h-full object-fill [image-rendering:pixelated]"
                    />
                    <img 
                        alt=""
                        src="/backgrounds/cloud_and_beach/cloud1/3.png" 
                        className="w-1/2 h-full object-fill [image-rendering:pixelated]"
                    />
                </div>

                <div className="absolute inset-0 flex w-[200%] h-full animate-drift-fast">
                    <img 
                        alt=""
                        src="/backgrounds/cloud_and_beach/cloud1/4.png" 
                        className="w-1/2 h-full object-fill [image-rendering:pixelated]"
                    />
                    <img 
                        alt=""
                        src="/backgrounds/cloud_and_beach/cloud1/4.png" 
                        className="w-1/2 h-full object-fill [image-rendering:pixelated]"
                    />
                </div>
            </div>
        )}
    
        {theme === "night" && (
            <div className="absolute inset-0 overflow-hidden theme-night">
                <div>
                    <img 
                        alt=""
                        src="/backgrounds/night/nightsky.png"
                        className="absolute inset-0 w-full h-full object-fill [image-rendering:pixelated]"
                    />
                </div>

                <div>
                    <img 
                        alt=""
                        src="/backgrounds/night/stars1a.png"
                        className="animate-twinkle absolute inset-0 w-full h-full object-fill [image-rendering:pixelated]"
                        style={{ animationDelay: "0s" }}
                    />
                </div>

                <div>
                    <img 
                        alt=""
                        src="/backgrounds/night/stars1b.png"
                        className="animate-twinkle absolute inset-0 w-full h-full object-fill opacity-30 [image-rendering:pixelated]"
                        style={{ animationDelay: "2s" }}
                    />
                </div>

                <div>
                    <img 
                        alt=""
                        src="/backgrounds/night/moon.png"
                        className="absolute inset-0 w-full h-full object-fill [image-rendering:pixelated]"
                    />
                </div>

                <div>
                    <img 
                        alt=""
                        src="/backgrounds/night/city1.png"
                        className="absolute inset-0 w-full h-full object-fill [image-rendering:pixelated]"
                    />
                </div>

                <div>
                    <img 
                        alt=""
                        src="/backgrounds/night/city2.png"
                        className="absolute inset-0 w-full h-full object-fill [image-rendering:pixelated]"
                    />
                </div>

                <div>
                    <img 
                        alt=""
                        src="/backgrounds/night/city3.png"
                        className="absolute inset-0 w-full h-full object-fill [image-rendering:pixelated]"
                    />
                </div>

                <div>
                    <img 
                        alt=""
                        src="/backgrounds/night/city4.png"
                        className="absolute inset-0 w-full h-full object-fill [image-rendering:pixelated]"
                    />
                </div>

                <div>
                    <img 
                        alt=""
                        src="/backgrounds/night/tree.png"
                        className="absolute inset-0 w-full h-full object-fill [image-rendering:pixelated]"
                    />
                </div>

                <div className="absolute inset-0 flex w-[200%] h-full animate-drift-med">
                    <img 
                        alt=""
                        src="/backgrounds/night/cloud.png"
                        className="w-1/2 h-full object-fill [image-rendering:pixelated]"
                    />
                    <img 
                        alt=""
                        src="/backgrounds/night/cloud.png"
                        className="w-1/2 h-full object-fill [image-rendering:pixelated]"
                    />
                </div>
            </div>
        )}
    </>
    )
}

export default Background;