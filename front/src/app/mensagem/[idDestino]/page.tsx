'use client'

import { useParams } from "next/navigation"
import { MainMensagem } from "../page"
import { useEffect, useRef, useState } from "react";
import { MensagemService } from "@/resources/mensagem/mensagemService";
import { CadastroMensagemDTO, DadosContato, MensagemDTO } from "@/resources/mensagem/mensagemResource";
import { ServicoSessao } from "@/resources/sessao/sessao";
import { Client } from "@stomp/stompjs";


export default function Chat() {

    const { idDestino } = useParams();
    const service = MensagemService();
    const sessao = ServicoSessao();
    const [contato, setContato] = useState<DadosContato>();
    const [mensagens, setMensagens] = useState<MensagemDTO[]>([]);
    const divRef = useRef<HTMLDivElement | null>(null);
    const clientRef = useRef<Client | null>(null);

    // Rolando para a ultima menagem sempre que necessário
    useEffect(() => {
        divRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensagens])

    // Efeitos ao carregar a página
    useEffect(() => {
        (async () => {
            const contato: DadosContato = await service.buscarDadosContato(`${idDestino}`, `${sessao.getSessao()?.accessToken}`);
            setContato(contato)
            const mensagens: MensagemDTO[] = await service.carregarMensagens(`${idDestino}`, `${sessao.getSessao()?.accessToken}`);
            setMensagens(mensagens);
        })()

        const client = new Client({
            brokerURL: 'ws://localhost:8080/conect',
            reconnectDelay: 15000,
            heartbeatIncoming: 1000,
            heartbeatOutgoing: 1000,
            connectHeaders: {
                'Authorization': `Bearer ${sessao.getSessao()?.accessToken}`
            }
        })

        client.onStompError = (erro) => alert(erro);
        if (!clientRef.current?.connected) {
            client.onConnect = () => {
                console.log("Conectardo")
                clientRef.current?.subscribe(`/mensagem/enviar-mensagem/${idDestino}${sessao.getSessao()?.id}`, (mensagem) => {
                    const mensagemRecebida: MensagemDTO = JSON.parse(mensagem.body);
                    setMensagens(pre => [...pre, mensagemRecebida])
                })


            }
            client.activate();
            clientRef.current = client;
        }

    }, [])


    const mensagemToComponent = (mensagem: MensagemDTO, key: number) => {
        return (
            <div key={key + 1} className={`${sessao.getSessao()?.perfil === mensagem.perfilRemetente ? 'justify-end' : 'justify-start'} flex my-4`}>
                <Mensagem key={key} horaEnvio={mensagem.horaEnvio + ""} texto={mensagem.texto + ""}></Mensagem>
            </div>
        )
    }

    function enviarMensagem() {
        const input = document.getElementById("mensagem") as HTMLInputElement;
        const valor = input.value;
        if (valor.length) {
            const isCandidato = sessao.getSessao()?.perfil === "candidato";
            const mensagem: CadastroMensagemDTO = {
                perfilRemetente: `${sessao.getSessao()?.perfil}`,
                idCandidato: parseInt(isCandidato ? `${sessao.getSessao()?.id}` : `${idDestino}`),
                idEmpresa: !isCandidato ? sessao.getSessao()?.id : `${idDestino}`,
                texto: valor
            }
            clientRef.current?.publish({
                destination: `/app/receber-mensagem/${sessao.getSessao()?.id}${idDestino}`,
                body: JSON.stringify(mensagem)
            })
           
        }
    }

    const renderizarMensagens = () => { return mensagens.map(mensagemToComponent) };

    return <MainMensagem>
        {<>
            <div className="border flex items-center py-1 gap-3 h-[18%]">
                <div style={{ backgroundImage: `url(${contato?.urlFoto})` }}
                    className="border border-gray-200 w-14 h-14 rounded-full ml-1 bg-cover" />
                <span className="text-[1.2em]" >{contato?.nome}</span>
            </div>
            <section className="border h-[71%] overflow-auto"
                id="mensagens">
                {renderizarMensagens()}
                <div ref={divRef} />
            </section>
            <div className="flex justify-center">
                <input id="mensagem" className=" h-10 w-72 rounded-md " type="text" placeholder="Mensagem" />
            </div>
            <button onClick={enviarMensagem}>Botao</button>
        </>}
    </MainMensagem>
}


interface mensagenProps {
    texto: string;
    horaEnvio: string;
}
const Mensagem: React.FC<mensagenProps> = ({ horaEnvio, texto }) => {



    return (
        <div
            id="balao" className="inline-block max-w-[300px]  px-1 border border-gray-500 rounded-md bg-gray-100 text-left text-wrap">
            <p className="break-all ">{texto}</p>
            <p className=" text-right text-[.7em] -mt-1 ">{horaEnvio}</p>

        </div>
    )
}