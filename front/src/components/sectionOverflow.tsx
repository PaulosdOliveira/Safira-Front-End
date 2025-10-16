'use client'

import React, { useEffect, useRef, useState } from "react"


interface sectionProps {
    children?: React.ReactNode;
    qtdItems: number;
}
export const SectionOverflow: React.FC<sectionProps> = ({ children, qtdItems }) => {

    const divRef = useRef<HTMLDivElement | null>(null);
    const [alturaChildren, setAlturaChildren] = useState<number>();
    
    useEffect(() => {
        if (divRef.current) {
            setAlturaChildren(divRef.current?.children[0]?.clientHeight);
        }
    }, [divRef])



    function rolar(direcao: 'cima' | 'baixo') {
        if (divRef.current) {
            const medidaRolagem = divRef.current?.children[0].clientHeight / qtdItems * 30;
            divRef.current.scrollBy({
                top: direcao == 'cima' ? medidaRolagem : - medidaRolagem,
                behavior: 'smooth'
            })
        }
    }


    return (
        <>
            <div className={`${qtdItems > 3 || alturaChildren! > 500 ? '' : 'hidden'}`}>
                <i title="Para cima" onClick={() => rolar('baixo')} className={`material-symbols cursor-pointer scale-150 mr-4 `}>keyboard_arrow_up</i>
                <i title="Para baixo" onClick={() => rolar('cima')} className="material-symbols cursor-pointer scale-150">keyboard_arrow_down</i>
            </div>
            <div ref={divRef} className={`grid gap-y-3   overflow-hidden max-h-[500px] py-3`}>
                {children}
            </div>
        </>
    )
}