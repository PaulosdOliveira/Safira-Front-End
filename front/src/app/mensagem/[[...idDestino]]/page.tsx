'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react";
import { MensagemService } from "@/resources/mensagem/mensagemService";
import { CadastroMensagemDTO, ContatosProps, DadosContato, MensagemDTO } from "@/resources/mensagem/mensagemResource";
import { ServicoSessao, Sessao } from "@/resources/sessao/sessao";
import { Client, StompSubscription } from "@stomp/stompjs";
import { CardContato } from "@/components/cadUsuario";


export default function Chat() {

    const mensagemService = MensagemService();
    const [contatos, setContatos] = useState<ContatosProps[]>([]);
    const [dadosContato, setDadosContato] = useState<DadosContato>({ nome: 'Usuário de nao sei', urlFoto: 'http://' });
    const [chatAberto, setChatAberto] = useState<boolean>(false);
    const { idDestino } = useParams();
    const idDestinoRef = useRef<string>(`` + idDestino);
    const service = MensagemService();
    const sessao: Sessao | undefined = ServicoSessao().getSessao();
    const [indexContato, setIndexContato] = useState<number>(100);
    const [mensagens, setMensagens] = useState<MensagemDTO[]>([]);
    const clientRef = useRef<Client | null>(null);
    const subscriptionRef = useRef<StompSubscription | null>(null);
    const subscriptionRefnotify = useRef<StompSubscription | null>(null);
    const subscriptionVisualizarRef = useRef<StompSubscription | null>(null);
    const divRef = useRef<HTMLDivElement | null>(null);



    useEffect(() => {
        (async () => {
            if (!contatos.length) {
                const contatosEncontrados: ContatosProps[] = await mensagemService.buscarChatsRecetes(`${sessao?.accessToken}`)
                contatosEncontrados.forEach(contato => contato.isNew = false)
                setContatos(contatosEncontrados)
            }
        })()
        // ATUALIZANDO LISTA DE MENSAGENS DO CHAT ABERTO
        if (contatos[indexContato]?.mensagens) {
            contatos[indexContato].mensagens = mensagens
        };
        divRef.current?.scrollTo({ top: divRef.current.scrollHeight })
    }, [mensagens])

    // CONEXÃO PRINCIPAL DO WS
    useEffect(() => {
        if (!clientRef.current) {
            const client = new Client({
                brokerURL: 'ws://localhost:8080/conect',
                reconnectDelay: 15000,
                heartbeatIncoming: 1000,
                heartbeatOutgoing: 1000,
                connectHeaders: {
                    'Authorization': `Bearer ${sessao?.accessToken}`
                }
            })
            client.onDisconnect = () => { alert("Desconectado") }
            client.activate();
            clientRef.current = client;
        }

        return () => {
            subscriptionRef.current?.unsubscribe();
            subscriptionRefnotify.current?.unsubscribe();
            subscriptionVisualizarRef.current?.unsubscribe();
            clientRef.current?.deactivate();
        }
    }, [])

    // CONEXÕES COM O WS QUE NÃO DEPENDEM DE UM ID DE DESTINO
    useEffect(() => {
        if (!clientRef.current?.connected) return;

        clientRef.current.onConnect = () => { }
        // RECEBENDO NOTIFICAÇÃO
        if (!subscriptionRefnotify.current) {
            subscriptionRefnotify.current = clientRef.current?.subscribe(`/mensagem/enviar-mensagem/${sessao?.id}`, (mensagem) => {
                const contatoRemetente: ContatosProps = JSON.parse(mensagem.body);

                // VERIFICANDO SE O CHAT COM O CONTATO ESTÁ ABERTO ATUALMENTE
                let chatPresente = contatoRemetente.id == idDestinoRef.current;

                // CASO O CONTATO JA FAÇA PARTE DA LISTA ATUAl
                setContatos(pre => {
                    return pre.map(c => {
                        if (c.id == contatoRemetente.id) { 
                            return(
                                {
                                    ...c, ultimaMensagem: contatoRemetente.ultimaMensagem, naoVizualizadas: c.naoVizualizadas! + (chatPresente ? 0 : 1)
                                }
                            )
                        }
                        return c;
                    })
                })
            })
        }

        // ATUALIZANDO MENSAGENS VISUALIZADAS
        if (!subscriptionVisualizarRef.current) {
            subscriptionVisualizarRef.current = clientRef.current.subscribe(`/mensagem/visualizar/${sessao?.id}`, (payLoad) => {
                const idContato = JSON.parse(payLoad.body).idContato;
                setContatos(pre => pre.map(
                    (contato) => contato.id == idContato ? {
                        ...contato, naoVizualizadas: 0
                    } : { ...contato }
                ))
            })
        }
    }, [clientRef.current?.connected])

    function contatoToCard(contato: ContatosProps, key: number) {
        async function load() {
            contato.indexContato = key;
            if (idDestinoRef.current == contato.id) {
                setIndexContato(key);
                const mensagens: MensagemDTO[] = await service.carregarMensagens(`${contato.id}`, `${sessao?.accessToken}`);
                contato.mensagens = mensagens;
                setMensagens(contato.mensagens);
            }
            if (contato.isNew) {
                // BUSCAR QUANTIDADE DE MENSAGENS NÃO VISUALIZADAS 

            }
        }
        async function click() {
            window.history.pushState({}, "", `/mensagem/${contato.id}`);
            setChatAberto(true);
            idDestinoRef.current = contato.id!
            setIndexContato(contato.indexContato!);
            if (!contato.mensagens?.length) {
                const mensagens: MensagemDTO[] = await service.carregarMensagens(`${contato.id}`, `${sessao?.accessToken}`);
                contato.mensagens = mensagens;
            } if (contatos[contato.indexContato!] && contatos[contato.indexContato!].naoVizualizadas! > 0) {
                await mensagemService.visualizarMensagens(`${sessao?.accessToken}`, idDestinoRef.current + '')
                setContatos(pre => pre.map(
                    (contato) => contato.id == contato.id ? {
                        ...contato, naoVizualizadas: 0
                    } : { ...contato }
                ))
            }
            setMensagens(contato.mensagens);
        }
        return <CardContato load={load} naoVizualizadas={contato.naoVizualizadas} key={key} id={contato.id} nome={contato.nome} ultimaMensagem={contato.ultimaMensagem} urlFoto={contato.urlFoto} click={click} />
    }
    const renderizarContatos = () => { return contatos.map(contatoToCard) }

    if (idDestino?.length) {
        useEffect(() => {
            (async () => {
                const dadosContato = await mensagemService.buscarDadosContato(idDestinoRef.current, `${sessao?.accessToken}`);
                setDadosContato(dadosContato);
            })()
        }, [])

        // Efeitos ao carregar a página
        useEffect(() => {
            // Abrindo o chat do destinatário
            if (!chatAberto) setChatAberto(true);
            (async () => {
                if (contatos[indexContato] && contatos[indexContato].naoVizualizadas! > 0) {
                    await mensagemService.visualizarMensagens(`${sessao?.accessToken}`, idDestinoRef.current + '')
                }
            })()
        }, [indexContato])
    }

    // MONTANDO CONEXÃO ENTRE USUÁRIOS
    useEffect(() => {
        (async () => {
            if (!clientRef.current?.connected) {
                return
            };
            subscriptionRef.current?.unsubscribe();

            // RECEBENDO MENSAGEM no chat
            subscriptionRef.current = clientRef.current?.subscribe(`/mensagem/enviar-mensagem/${idDestinoRef.current}${sessao?.id}`, async (mensagem) => {
                const mensagemRecebida: MensagemDTO = JSON.parse(mensagem.body);
                setMensagens(pre => [mensagemRecebida, ...pre])
                await mensagemService.visualizarMensagem(`${sessao?.accessToken}`, mensagemRecebida.id + '', `${sessao?.id}`);
            })
            const dadosContato = await mensagemService.buscarDadosContato(idDestinoRef.current, `${sessao?.accessToken}`);
            setDadosContato(dadosContato);
        })()


    }, [idDestinoRef.current, idDestino, clientRef.current?.connected])

    const mensagemToComponent = (mensagem: MensagemDTO, key: number) => {
        return (
            <div key={key + 1} className={`${sessao?.perfil === mensagem.perfilRemetente ? 'justify-end' : 'justify-start'} flex my-4`}>
                <Mensagem key={key} horaEnvio={mensagem.horaEnvio + ""} texto={mensagem.texto + ""}></Mensagem>
            </div>
        )
    }

    const renderizarMensagens = () => {
        return mensagens.map(mensagemToComponent);
    };

    function enviarMensagem() {
        const input = document.getElementById("mensagem") as HTMLInputElement;
        const valor = input.value;
        if (valor.length) {
            const isCandidato = sessao?.perfil === "candidato";
            const idCandidato = parseInt(isCandidato ? `${sessao?.id}` : `${idDestinoRef.current}`);
            const idEmpresa = !isCandidato ? sessao?.id : `${idDestinoRef.current}`;
            const mensagem: CadastroMensagemDTO = {
                perfilRemetente: `${sessao?.perfil}`,
                idCandidato: idCandidato,
                idEmpresa: idEmpresa,
                texto: valor
            }
            clientRef.current?.publish({
                destination: `/app/receber-mensagem/${sessao?.id}/${idDestinoRef.current}`,
                body: JSON.stringify(mensagem)
            })
            // MODIFICANDO ULTIMA MENSAGEM ENVIADA
            setContatos(pre => pre.map(
                (contato, index) => contato.id == idDestinoRef.current ? {
                    ...contato, ultimaMensagem: mensagem.texto, indexContato: index
                } : { ...contato, indexContato: index }
            ))

            // REORGANIZANDO A LISTA DE CONTATOS
            if (indexContato < contatos.length - 1) {
                const contatoRemovido = contatos.splice(indexContato, 1)[0];
                contatos.push(contatoRemovido);
                setIndexContato(contatos.length - 1);
            }


            // ADICIONANDO NOVA MENSAGEM À LISTA DE MENSAGENS
            const novaMensagem: MensagemDTO = {
                horaEnvio: new Date().toLocaleTimeString("pt-br", {
                    hour: "2-digit",
                    minute: "2-digit"
                }),
                idCandidato: idCandidato,
                idEmpresa: idEmpresa,
                perfilRemetente: sessao?.perfil,
                texto: valor
            }
            setMensagens(pre => [novaMensagem, ...pre]);
        }
        input.value = "";
    }


    return (
        <div className="font-[arial] ">
            <header className=" h-0 "></header>
            <main className="flex items-start border border-gray-200">
                <section className={` border-gray-200 overflow-auto  h-[100vh]  w-[98vw] sm:w-[30vw]   sm:block ${chatAberto ? 'hidden' : ''}`}>
                    <h3 className="text-center pt-5">Contatos recentes</h3>
                    <div className="flex flex-col-reverse">
                        {renderizarContatos()}
                    </div>
                </section>
                {idDestinoRef.current.length ? (
                    <div className={`h-[100vh]  pb-10 w-[600px] sm:w-[70vw]   border border-gray-300 flex flex-col  justify-start sm:block  ${chatAberto ? '' : 'hidden'}`}
                        id="chat">
                        <div className="sm:hidden  relative">
                            <i onClick={() => setChatAberto(false)}
                                title="Conversas" className="material-symbols ml-2 cursor-pointer absolute top-1 -left-2.5">Arrow_Back</i>
                        </div>
                        <div className="border border-gray-200 flex items-center py-2 gap-3  h-[75px] ">
                            <div style={{ backgroundImage: `url(${dadosContato.urlFoto})` }}
                                className="border border-gray-200 sm:w-15 sm:h-15 h-12 w-12 rounded-full ml-3 bg-cover " />
                            <a href={`/empresa/${idDestinoRef.current}`} target="_blank" className="text-[1em] font-bold" >{dadosContato.nome}</a>
                        </div>
                        <div ref={divRef}
                            className="border-b flex flex-col-reverse border-gray-300 bg-gray-100 h-[77vh]  overflow-auto px-3 bg-cover bg-no-repeat"
                            id="mensagens">
                            {renderizarMensagens()}
                        </div>
                        <div className="h-[12.36vh] flex sm:m-auto pt-4 sm:w-[440px] md:w-[500px] lg:w-[700px]">
                            <input onKeyDown={(event) => { if (event.key === "Enter") { enviarMensagem() } }} id="mensagem" className="h-10 w-full rounded-full border border-gray-400 pl-4 pr-15" type="text" placeholder="Mensagem" />
                            <div className="h-10 flex items-center">
                                <i className="material-symbols  scale-125 -ml-9">send</i>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={`h-[100vh] bg-gray-300  w-[600px] sm:w-[70vw] sm:block hidden`}>
                    </div>
                )}
            </main>
        </div>

    )
}

interface mensagenProps {
    texto: string;
    horaEnvio: string;
}
const Mensagem: React.FC<mensagenProps> = ({ horaEnvio, texto }) => {
    return (
        <div
            id="balao" className="inline-block max-w-[300px] md:max-w-[450px]  px-1 border border-gray-400 rounded-lg bg-gray-100 text-left ">
            <p className="break-words">{texto}</p>
            <p className=" text-right text-[.7em] -mt-1 ">{horaEnvio}</p>
        </div>
    )
}