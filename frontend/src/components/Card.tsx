const Card = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="flex flex-col bg-surface border-4 border-border rounded-md shadow-[6px_6px_0_rgba(74,63,53,0.35)] w-[400px] max-h-[600px] h-full overflow-y-auto">
                {children}
            </div>
        </div>
    )
}

export default Card;