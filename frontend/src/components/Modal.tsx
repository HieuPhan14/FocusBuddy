import PixelIcon from "./PixelIcon";

interface ModalProps {
    children: React.ReactNode
    onClose?: () => void
    title: string
}

const Modal = ( { children, onClose, title }: ModalProps) => {
    return (
    <>
        <div 
            className="fixed inset-0 bg-[#2a2018]/60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-surface border-4 border-border rounded-md shadow-[6px_6px_0_rgba(74,63,53,0.35)] p-6 max-w-md w-full relative"
                onClick={(e) => e.stopPropagation()}
            >
                {onClose && 
                <button 
                    onClick={onClose}
                    className="cursor-pointer absolute top-2 right-2 border-2 border-transparent hover:border-border rounded-sm p-1 hover:bg-input transition"
                >
                    <PixelIcon name="X"/>
                </button>
                }
                <div className="font-display text-lg text-text border-b-2 border-border-light pb-2 mb-3 flex justify-center">
                    {title}
                </div>

                {children}
            </div>
        </div>
    </>
    )
}

export default Modal;