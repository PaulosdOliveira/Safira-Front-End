'use client'

import { ServicoSessao } from "@/resources/sessao/sessao";
import { useRouter } from "next/navigation";
import { useState } from "react";


export const Menu = () => {

    const sessao = ServicoSessao();
    const router = useRouter();
    const [menuAberto, setMenuAberto] = useState<boolean>(false);
    const perfil = sessao.getSessao()?.perfil;

    function sair() {
        sessao.sair();
        router.push("/empresa/login")
    }

    return (
        <div className="flex flex-col items-end  h-6">
            <i className="material-symbols cursor-pointer" onClick={() => setMenuAberto(!menuAberto)}>menu</i>
            <nav className={`border mt-0.5 rounded-md z-30 bg-white w-20 text-center ${!menuAberto ? 'hidden' : ''}`}>
                <ul>
                    <li onClick={() => router.push(`/${perfil}/${sessao.getSessao()?.id}`)} className="cursor-pointer hover:bg-gray-200 rounded-md p-0.5">Perfil</li>
                    <li className="hover:bg-gray-200 rounded-sd p-0.5"><a target="_blank" href="#">Rascunhos</a></li>
                    <li onClick={sair} className="cursor-pointer hover:bg-gray-200 rounded-md p-0.5">Sair</li>
                </ul>
            </nav>
        </div>
    )
}