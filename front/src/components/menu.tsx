'use client'

import { ServicoSessao } from "@/resources/sessao/sessao";
import { useRouter } from "next/navigation";
import { useState } from "react";


export const Menu = () => {

    const sessao = ServicoSessao();
    const router = useRouter();
    const [menuAberto, setMenuAberto] = useState<boolean>(false);

    function sair() {
        sessao.sair();
        router.push("/empresa/login")
    }

    return (
        <div className="flex flex-col items-end  h-6">
            <i className="material-symbols cursor-pointer" onClick={() => setMenuAberto(!menuAberto)}>menu</i>
            <nav className={`border z-30 bg-white w-20 text-center ${!menuAberto ? 'hidden' : ''}`}>
                <ul>
                    <li onClick={() => router.push(`/${sessao.getSessao()?.perfil}/${sessao.getSessao()?.id}`)} className="cursor-pointer">Perfil</li>
                    <li onClick={sair} className="cursor-pointer">Sair</li>
                </ul>
            </nav>
        </div>
    )
}