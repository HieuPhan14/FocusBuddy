const BigCard = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex items-center justify-center min-h-0 h-full p-8">
            <div className="relative flex flex-col min-h-0 bg-surface border-4 border-border rounded-md shadow-[6px_6px_0_rgba(74,63,53,0.35)] w-[700px] h-full">
                <div className="flex h-full flex-col border-2 border-border-light m-[3px] rounded-sm overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default BigCard;