'use client'

import { MensagemService } from "@/resources/mensagem/mensagemService";
import { ServicoSessao } from "@/resources/sessao/sessao";
import { Client } from "@stomp/stompjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface headerProps {
    logado?: boolean
}
// HEADER
export const Header: React.FC<headerProps> = ({ logado }) => {
    const router = useRouter();

    const sessao = ServicoSessao().getSessao();

    return (
        <header className="border-b border-gray-200 bg-white shadow-sm shadow-gray-300 flex items-end py-2 z-10 text-center">
            <div onClick={() => router.push("/")} className={`flex pl-2 items-center gap-x-3 cursor-pointer ${logado ? 'pl-3.5' : 'm-auto'}`}>
                <img className="h-[50px] w-[50px] " src="/favi_safira.png" />
                <h1 style={{ WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(to left, #191970 0%, #182848 100%)' }}
                    className="pt-1 font-[Belleza] text-transparent ">SAFIRA</h1>
            </div>
            {sessao && (
                <Menu />
            )}
        </header>
    )
}

// MENU DE NAVEGAÇÃO DO HEARDER (PERFIL, SAIR)
export const Menu = () => {

    const sessao = ServicoSessao().getSessao();
    const router = useRouter();
    const mensagemService = MensagemService();
    const [menuAberto, setMenuAberto] = useState<boolean>(false);
    const [montado, setMontado] = useState(false);
    const [notificacoes, setNotificacoes] = useState<string[]>([])
    const notificacoesRef = useRef<string[]>([])
    const clientRef = useRef<Client | null>(null);
    const client = new Client({
        brokerURL: 'ws://localhost:8080/conect',
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        reconnectDelay: 20000,
        connectHeaders: {
            'Authorization': `Bearer ${sessao?.accessToken}`
        }
    });

    useEffect(() => {
        (async () => {
            const result = await mensagemService.getNofificacoes(`${sessao?.accessToken}`);
            setNotificacoes(result)
            notificacoesRef.current = result;

            // CONFIGURANDO WS
            if (!clientRef.current?.connected) {
                client.onConnect = () => {
                    clientRef.current?.subscribe(`/mensagem/enviar-mensagem/${sessao?.id}`, (message) => {
                        // ID DO REMETENTE DA MENSAGEM
                        let id = sessao?.perfil == 'candidato' ? JSON.parse(message.body).idEmpresa : JSON.parse(message.body).idCandidato;
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
        setMontado(true);
    }, [])

    function sair() {
        ServicoSessao().sair();
        router.push(`/${sessao?.perfil}/login`)
    }
    if (!montado) return false;
    return (
        <div className="flex justify-end items-end h-6 w-full pr-4">
            <div className="flex relative">
                <a href="/mensagem" title="Mensagens" className="material-symbols mx-5">chat</a>
                <span onClick={() => alert(JSON.stringify(notificacoes))}
                    className={`${notificacoes.length > 0 ? '' : 'hidden'} absolute left-8 border rounded-full h-5 w-5  flex justify-center items-center text-white bg-gray-800`}
                    id="qtd_mensagens">{notificacoes.length}</span>
            </div>
            <div className="flex pr-3">
                <div style={{ backgroundImage: `url(http://localhost:8080/${sessao?.perfil}/foto/${sessao?.id})` }}
                    className="h-8 w-8 rounded-full border border-gray-200 bg-contain" />
                <i onClick={() => setMenuAberto(!menuAberto)} className="material-symbols cursor-pointer">arrow_drop_down</i>
            </div>
            <div className="relative">
                <nav className={`border border-gray-400 mt-0.5  z-30 bg-white w-20 text-center absolute -left-21 ${!menuAberto ? 'hidden' : ''}`}>
                    <ul>
                        <li onClick={() => router.push("/")} className="cursor-pointer hover:bg-gray-200 rounded-md p-0.5">Início</li>
                        <li onClick={() => router.push(`/${sessao?.perfil}/${sessao?.id}`)} className="cursor-pointer hover:bg-gray-200 rounded-md p-0.5">Perfil</li>
                        <li onClick={sair} className="cursor-pointer hover:bg-gray-200 rounded-md p-0.5">Sair</li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}