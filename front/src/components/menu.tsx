'use client'

import { MensagemService } from "@/resources/mensagem/mensagemService";
import { ServicoSessao } from "@/resources/sessao/sessao";
import { Client } from "@stomp/stompjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


export const Menu = () => {

    const sessao = ServicoSessao();
    const router = useRouter();
    const mensagemService = MensagemService();
    const [menuAberto, setMenuAberto] = useState<boolean>(false);
    const perfil = sessao.getSessao()?.perfil;
    const [notificacoes, setNotificacoes] = useState<string[]>([])
    const notificacoesRef = useRef<string[]>([])
    const clientRef = useRef<Client | null>(null);
    const client = new Client({
        brokerURL: 'ws://localhost:8080/conect',
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        reconnectDelay: 20000,
        connectHeaders: {
            'Authorization': `Bearer ${sessao.getSessao()?.accessToken}`
        }
    });

    useEffect(() => {
        (async () => {
            const result = await mensagemService.getNofificacoes(`${sessao.getSessao()?.accessToken}`);
            setNotificacoes(result)
            notificacoesRef.current = result;

            // CONFIGURANDO WS
            if (!clientRef.current?.connected) {
                client.onConnect = () => {
                    clientRef.current?.subscribe(`/mensagem/enviar-mensagem/${sessao.getSessao()?.id}`, (message) => {
                        // ID DO REMETENTE DA MENSAGEM
                        let id = sessao.getSessao()?.perfil == 'candidato'?  JSON.parse(message.body).idEmpresa : JSON.parse(message.body).idCandidato;
                        if (!notificacoesRef.current.some(item => item === id)) {
                            notificacoesRef.current.push(id);
                            setNotificacoes(pre => [...pre]);  
                        }
                    })
                }
                client.activate();
                clientRef.current = client;
            }
        })()

    }, [])

    function sair() {
        sessao.sair();
        router.push("/empresa/login")
    }

    return (
        <div className="flex justify-end items-end h-6">
            <div className="flex relative">
                <i title="Mensagens" className="material-symbols  cursor-pointer mx-5" onClick={() => router.push("/mensagem")}>chat</i>
                <span onClick={() => alert(JSON.stringify(notificacoes))}
                 className={`${notificacoes.length > 0 ? '' : 'hidden'} absolute left-8 border rounded-full h-5 w-5  flex justify-center items-center text-white bg-gray-800`}
                    id="qtd_mensagens">{notificacoes.length}</span>
            </div>

            <i className="material-symbols cursor-pointer mr-2" onClick={() => setMenuAberto(!menuAberto)}>menu</i>
            <div className="border relative">
                <nav className={`border mt-0.5 rounded-md z-30 bg-white w-20 text-center absolute -left-20 ${!menuAberto ? 'hidden' : ''}`}>
                    <ul>
                        <li onClick={() => router.push(`/${perfil}/${sessao.getSessao()?.id}`)} className="cursor-pointer hover:bg-gray-200 rounded-md p-0.5">Perfil</li>
                        <li className="hover:bg-gray-200 rounded-sd p-0.5"><a target="_blank" href="#">Rascunhos</a></li>
                        <li onClick={sair} className="cursor-pointer hover:bg-gray-200 rounded-md p-0.5">Sair</li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}