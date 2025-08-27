'use client'

import { ContatosProps } from "@/resources/mensagem/mensagemResource";
import { MensagemService } from "@/resources/mensagem/mensagemService";
import { ServicoSessao } from "@/resources/sessao/sessao";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

export default function CHatPage() {



    return (
        <MainMensagem>
            {<>
                <h3>Nenhum chat aberto</h3>
            </>}
        </MainMensagem>
    )
}

interface mainProps {
    children: ReactNode
}
export const MainMensagem: React.FC<mainProps> = ({ children }) => {
    const sessao = ServicoSessao();
    const mensagemService = MensagemService();
    const [contatos, setContatos] = useState<ContatosProps[]>([]);

    useEffect(() => {
        (async () => {
            const contatos = await mensagemService.buscarChatsRecetes(`${sessao.getSessao()?.accessToken}`)
            setContatos(contatos)
        })()
    }, [])

    const contatoToCard = (contato: ContatosProps, key: number) => {
        
        return <CardContatos key={key} id={contato.id} nome={contato.nome} ultimaMensagem={contato.ultimaMensagem} urlFoto={contato.urlFoto} />
    }
    const renderizarContatos = () => { return contatos.map(contatoToCard) }

    return (
        <div>
            <h1>Bom dia</h1>
            <main className="flex">
                <section className="border overflow-auto w-[300px] h-[50vh] ml-3">
                    {renderizarContatos()}
                </section>
                <div className="border  h-[50vh] w-96 flex flex-col justify-end"
                    id="chat">
                    {children}
                </div>
            </main>
        </div>
    )
}


const CardContatos: React.FC<ContatosProps> = ({ id, nome, ultimaMensagem, urlFoto }) => {
    const router = useRouter();
    return (
        <div onClick={() => router.push(`/mensagem/${id}`)}
            className="border cursor-pointer">
            <div className="flex items-center gap-4">
                <div style={{ backgroundImage: `url(${urlFoto})` }}
                    className="border border-gray-200 w-16 h-16 rounded-full bg-cover" />
                <h3 >{nome}</h3>
            </div>
            <p>{ultimaMensagem}</p>
        </div>
    )
}
