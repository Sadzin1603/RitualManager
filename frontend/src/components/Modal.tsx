function Modal({isOpen,title,message,onConfirm,onCancel} : {isOpen:boolean, title:string, message:string, onConfirm:() => void, onCancel:() => void}) {

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
            
            <div className="bg-zinc-900 p-6 rounded-xl w-96">

                <h2 className="text-xl font-bold mb-2 text-white">
                    {title}
                </h2>

                <p className="text-zinc-300 mb-6">
                    {message}
                </p>

                <div className="flex justify-end gap-2">

                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-zinc-700 rounded text-white"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 rounded text-white"
                    >
                        Confirmar
                    </button>

                </div>

            </div>

        </div>
    )
}

export default Modal