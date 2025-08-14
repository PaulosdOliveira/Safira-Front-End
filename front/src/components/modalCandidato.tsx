'use client'

import { useState } from "react"

export const ModalCandidato = () => {

    const [isOpen, setOpen] = useState<boolean>(false);

    const abrir = () => { setOpen(true), document.body.classList.add("overflow-hidden") }
    const fechar = () => { setOpen(false), document.body.classList.remove("overflow-hidden") }

    return (
        <div>
            <button onClick={abrir}
                className="h-8 w-8 border" >
                Ver perfil
            </button>
            
        </div>
    )
} 