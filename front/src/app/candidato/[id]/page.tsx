'use client'

import { PerfilCandidato } from "@/resources/candidato/candidatoResource";
import { CandidatoService } from "@/resources/candidato/servico";
import { ModeloDeProposta } from "@/resources/empresa/rascunho/rascunhoResource";
import { ServicoEmpresa } from "@/resources/empresa/sevico";
import { CadastroMensagemDTO } from "@/resources/mensagem/mensagemResource";
import { QualificacaoPerfil } from "@/resources/qualificacao/qualificacaoResource";
import { ServicoSessao } from "@/resources/sessao/sessao";
import { CandidaturaCandidato } from "@/resources/vaga_emprego/DadosVaga";
import { VagaService } from "@/resources/vaga_emprego/service";
import { Client } from "@stomp/stompjs";
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";


export default function PagePerfilCandidato() {

    const id = useParams().id;
    const [perfil, setPerfil] = useState<PerfilCandidato | null>(null);
    const [aba, setAba] = useState<string>("informacoes");
    const [candidaturas, setCandidaturas] = useState<CandidaturaCandidato[]>([]);
    const [candidaturasFinalizadas, setCandidaturasFinalizadas] = useState<boolean>(false);
    const sessao = ServicoSessao();
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);


    useEffect(() => {
        (async () => {
            if (id) {
                const perfilCandidato = await CandidatoService().carregarPerfil(`${id}`);
                if (perfilCandidato.id)
                    setPerfil(perfilCandidato)
            }
        })()
    }, [])

    // Transformando lista de qualificações em component JSX
    function toQualificacao(qualificacao: QualificacaoPerfil, key: number) {
        return <Qualificao key={key} nivel={qualificacao.nivel} nome={qualificacao.nome} />
    }

    // Renderizando lista de qualificações
    const renderizarQualificacoes = () => { return perfil?.qualificacoes?.map(toQualificacao); };

    async function buscarCandidaturas() {
        if (!candidaturas.length) {
            const token = ServicoSessao().getSessao()?.accessToken;
            const candidaturas: CandidaturaCandidato[] = await VagaService().buscar_candidaturas(`${token}`);
            setCandidaturas(candidaturas)
        }
        setAba("candidaturas")
    }

    const candidaturaToJSX = (candidatura: CandidaturaCandidato, key: number) => {
        if (candidatura.finalizada === candidaturasFinalizadas) {
            return (
                <Candidaturas key={key} candidatura={candidatura} />
            )
        }

    }

    const renderizarCandidaturas = () => {
        return candidaturas.map(candidaturaToJSX);
    }

    if (perfil) {
        return (
            <div className="w-[100%] min-h-[100vh] max-h-fit bg-gray-200">
                <header className=" h-[120px] bg-white shadow-sm shadow-gray-200 flex flex-col justify-end items-center py-2 z-10">
                    <div className="w-80 h-20  bg-contain"
                        style={{
                            backgroundPosition: "center center",
                            backgroundImage: `url(${"https://i.pinimg.com/736x/0d/cf/b5/0dcfb548989afdf22afff75e2a46a508.jpg"})`
                        }} />
                    <nav className="w-[100%]">
                        <ul className="text-gray-950 text-right">
                            <li className="inline-block hover:underline pr-4 pb-1"><a target="_self" href="/candidato/login">Login para candidatos</a></li>
                        </ul>
                    </nav>
                </header>
                <main className=" bg-gray-020 p-5">
                    <div className=" w-[500px] bg-white  flex items-center  px-5 pb-2 m-auto border border-gray-200  rounded-sm">

                        <div style={{ backgroundImage: `url(http://localhost:8080/candidato/foto/${id})` }}
                            className="w-24 h-24  rounded-full bg-cover bg-no-repeat mr-4" />


                        <div className="mt-7 ">
                            <p className="text-[1.7em] font-semibold">{perfil?.nome}</p>
                            <p className="font-bold">PROFISSÃO</p>
                            <span className="text-gray-700">{`${perfil?.idade} Anos / ${perfil.cidade} - ${perfil.estado}`}</span>
                            {sessao.getSessao()?.perfil === "empresa" && (
                                <button onClick={() => setModalIsOpen(true)} className="bg-gray-700 text-white p-2 text-[.9em] rounded-lg block mt-5">Enviar proposta</button>
                            )}
                        </div>
                    </div>
                    <span onClick={() => setAba("informacoes")} className={` ${id === sessao.getSessao()?.id ? '' : 'hidden'} mx-3 cursor-pointer ${aba === "informacoes" ? 'underline' : ''}`}>Informações</span>
                    <span onClick={buscarCandidaturas} className={`${id === sessao.getSessao()?.id ? '' : 'hidden'} mx-3 cursor-pointer ${aba === "candidaturas" ? 'underline' : ''}`}>Minhas candidaturas</span>
                    {aba === "informacoes" && (
                        <div className="bg-white border border-gray-300 shadow shadow-gray-300 lg:w-[800px] md:w-[700px]  sm:w-[625px] w-[500px] rounded-sm px-5 pb-10 m-auto mt-5">
                            <h3>Sobre</h3>
                            <pre className="font-[arial] text-wrap w-[400px]  text-justify ">{perfil?.descricao}</pre>
                            <hr className="my-2 text-gray-300" />
                            <h3>Contado</h3>
                            <div className="flex items-center ">
                                <i className="material-symbols scale-95">email</i>
                                <span className="font-semibold pl-1 mb-1">{`${perfil?.email}`}</span>
                            </div>

                            <div className="flex items-center">
                                <i className="material-symbols scale-95">call</i>
                                <span className="font-semibold pl-1 ">{`${perfil?.tel}`}</span>
                            </div>
                            <hr className="my-6 text-gray-300" />
                            {
                                perfil.qualificacoes?.length ? (
                                    <div className="">
                                        <h4>Qualificações</h4>
                                        {renderizarQualificacoes()}
                                        {renderizarQualificacoes()}
                                        {renderizarQualificacoes()}
                                        {renderizarQualificacoes()}
                                        {renderizarQualificacoes()}
                                        {renderizarQualificacoes()}
                                        {renderizarQualificacoes()}
                                        {renderizarQualificacoes()}
                                        {renderizarQualificacoes()}
                                        {renderizarQualificacoes()}
                                        {renderizarQualificacoes()}
                                        {renderizarQualificacoes()}
                                    </div>
                                ) : (<h3>Usuário não possui qualificações cadastradas</h3>)}

                        </div>
                    )}
                    {aba === "candidaturas" && (
                        <>
                            <div className="my-7" />
                            <span onClick={() => setCandidaturasFinalizadas(false)} className={`mx-5 cursor-pointer transition duration-700  p-1 rounded-md  ${candidaturasFinalizadas ? '' : 'bg-white'}`}>Em análise</span>
                            <span onClick={() => setCandidaturasFinalizadas(true)} className={`cursor-pointer transition duration-700  p-1 rounded-md ${candidaturasFinalizadas ? 'bg-white' : ''}`}>Finalizadas</span>
                            {renderizarCandidaturas()}
                        </>

                    )
                    }


                    {modalIsOpen && (
                        <ModalProposta close={() => setModalIsOpen(false)} idCandidato={`${id}`} />
                    )}
                    <ToastContainer position="top-center"
                        closeOnClick={true}
                        autoClose={6000}
                        pauseOnHover={true}
                        hideProgressBar={false}
                        draggable={false}
                    />
                </main>
            </div>
        )
    }
    return <h1 className="text-black text-center">Nenhum perfil encontrado</h1>
}



export const Qualificao: React.FC<QualificacaoPerfil> = ({ nome, nivel }) => {
    return (
        <div className="text-[.9em] inline-block border-2 border-gray-700 w-fit px-2 py-1 rounded-full m-2">
            <span>{`${nome} - `}</span>
            <span>{nivel}</span>
        </div>
    )
}



interface candidaturaProps {
    candidatura: CandidaturaCandidato
}
// Component para renderização de candidaturas
const Candidaturas: React.FC<candidaturaProps> = ({ candidatura }) => {
    let cor = candidatura.status !== "Em análise" ? (candidatura.status === "Selecionado" ? "text-green-900" : "text-red-600") : "text-black";

    return (
        <div className="bg-white border border-gray-300 shadow-md w-52 rounded-lg p-1 mt-4 font-[arial] cursor-pointer">
            <p className="font-bold font-[arial]">{candidatura.tituloVaga}</p>
            <p className="hover:underline"><a href={`/empresa/${candidatura.idEmpresa}`} target="_blank">{candidatura.nomeEmpresa}</a></p>
            <p className={`${cor}`}>{candidatura.status}</p>
            <a href={`/vaga/${candidatura.idVaga}`} target="_blank" className="text-blue-700 hover:underline">ver vaga</a>
        </div>
    )
}


// MODAL PROPOSTA DE EMPREGO

interface modalPorps {
    close: (event: any) => void;
    idCandidato: string;
}

const ModalProposta: React.FC<modalPorps> = ({ close, idCandidato }) => {


    const [rascunhos, setRascunhos] = useState<ModeloDeProposta[]>([]);
    const sessao = ServicoSessao();
    const service = ServicoEmpresa();
    const clientRef = useRef<Client | null>(null);
    const textArea = document.getElementById("mensagem") as HTMLTextAreaElement;

    // Efeitos ao renderizar Modal
    useEffect(() => {
        (async () => {
            const rascunhos = await service.buscarRascunhos(`${sessao.getSessao()?.accessToken}`);
            setRascunhos(rascunhos);
        })()
        const client = new Client({
            brokerURL: "ws:localhost:8080/conect",
            reconnectDelay: 15000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            connectHeaders: {
                'Authorization': `Bearer ${sessao.getSessao()?.accessToken}`
            }
        });
        client.onStompError = (erro) => { alert(erro) }
        if (!clientRef.current?.connected)
            client.onConnect = () => {
                console.log("CONECTADO AO WS")
            }
        client.activate();
        clientRef.current = client;
    }, [])

    const mapRascunhos = (rascunho: ModeloDeProposta) => {
        return (
            <div onClick={() => selecionarRascunho(rascunho.descricao)} key={rascunho.id} className="h-10 border border-gray-600 rounded-md w-56 cursor-pointer shadow shadow-gray-300">{rascunho.titulo}</div>
        )
    }


    function selecionarRascunho(descricao?: string) {
        if (descricao) {
            textArea.value = descricao;
        }

    }

    function enviarMensagem() {
        const textArea = document.getElementById("mensagem") as HTMLTextAreaElement;
        let mensagem = textArea.value;
        if (mensagem.length) {
            const cadastroMensagem: CadastroMensagemDTO = { idCandidato: parseInt(idCandidato), idEmpresa: `${sessao.getSessao()?.id}`, perfilRemetente: sessao.getSessao()?.perfil, texto: mensagem }
            clientRef.current?.publish({
                destination: `/app/receber-mensagem/${sessao.getSessao()?.id}${idCandidato}`,
                body: JSON.stringify(cadastroMensagem)
            });
        }
        close(null);
        return toast("Mensagem enviada!", {
            type: "success"
        });
    }

    const renderizarRascunhos = () => { return rascunhos.map(mapRascunhos) }

    return (
        <div className="fixed inset-0 overflow-hidden z-20">
            <div className="fixed inset-0 overflow-hidden bg-black opacity-50" />
            <div style={{ transform: 'translate(-50%, -50%)' }}
                className="bg-white  w-[500px] h-[70vh] absolute top-[50%] left-[50%] rounded-lg">
                <span onClick={close} className="text-[1.5em] font-extrabold absolute left-[96%] top-[-2%] cursor-pointer">x</span>
                <h2 className="text-center">Enviar proposta</h2>
                <div id="Rascunhos">
                    <h3 className="text-center">Selecione um racunho</h3>
                    <div className="h-36 grid justify-center  gap-3 overflow-auto py-4">
                        {rascunhos.length ? (
                            renderizarRascunhos()
                        ) : <h2>Sem rascunhos</h2>}

                    </div>
                </div>
                <div className=" text-center">
                    <textarea id="mensagem" className="h-24 w-96 mt-20 ml-16s" /><br />
                    <button onClick={enviarMensagem} className="bg-gray-900 rounded-md p-1 text-white mt-8 w-28">Enviar</button>
                </div>
            </div>
        </div>
    )
}