'use client'

import { CursoJSX, ExperienciaJSX, FormacaoJSX } from "@/components/perfilCandidato/CompoentsPerfilCandidato";
import { DadosSalvosCandidato, PerfilCandidato } from "@/resources/candidato/candidatoResource";
import { CandidatoService } from "@/resources/candidato/servico";
import { ModeloDeProposta } from "@/resources/empresa/rascunho/rascunhoResource";
import { ServicoEmpresa } from "@/resources/empresa/sevico";
import { CadastroMensagemDTO } from "@/resources/mensagem/mensagemResource";
import { Qualificacao, QualificacaoSalva, qualificacaoUsuario } from "@/resources/qualificacao/qualificacaoResource";
import { QualificacaoService } from "@/resources/qualificacao/qualificacaoService";
import { ServicoSessao } from "@/resources/sessao/sessao";
import { CandidaturaCandidato } from "@/resources/vaga_emprego/DadosVaga";
import { VagaService } from "@/resources/vaga_emprego/service";
import { Client } from "@stomp/stompjs";
import { useFormik } from "formik";
import { useParams } from "next/navigation"
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { cidade, estado, UtilsService } from "@/resources/utils/utils";
import { Curso, Experiencia, Formacao, QualificacaoComponent } from "@/components/perfilCandidato/CompoentsCadastroCandidato";
import { FormacaoService } from "@/resources/formacao/fiormacaoService";
import { ExperienciaService } from "@/resources/experiencia/experienciaService";
import { CursoService } from "@/resources/curso/cursoService";
import { Header, Menu } from "@/components/header";



export default function PagePerfilCandidato() {

    const id = useParams().id;
    const [perfil, setPerfil] = useState<PerfilCandidato | null>(null);
    const [titular, setTitular] = useState<boolean>(false);
    const [aba, setAba] = useState<string>("informacoes");
    const [candidaturas, setCandidaturas] = useState<CandidaturaCandidato[]>([]);
    const [candidaturasFinalizadas, setCandidaturasFinalizadas] = useState<boolean>(false);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const sessao = ServicoSessao();
    const experienciaService = ExperienciaService();
    const qualificacaoService = QualificacaoService();
    const formacaoService = FormacaoService();
    const cursoService = CursoService();

    useEffect(() => {
        (async () => {
            if (id) {
                const perfilCandidato = await CandidatoService().carregarPerfil(`${id}`);
                if (perfilCandidato.id) {
                    setPerfil(perfilCandidato)
                    setTitular(sessao.getSessao()?.id == id)
                }
            }
        })()
    }, [])


    // Renderizando lista de qualificações
    const renderizarQualificacoes = () => {
        return perfil?.qualificacoes?.map((q, index) => {
            function apagar() {
                let confirma = confirm(`Excluir ${q.nome}?`);
                if (confirma) {
                    qualificacaoService.deletarQualificacaoUsuario(q.idQualificacao, `${sessao.getSessao()?.accessToken}`);
                    setPerfil(pre => ({
                        ...pre!,
                        qualificacoes: pre?.qualificacoes?.filter(
                            item => item.idQualificacao !== q.idQualificacao
                        ) || []
                    }))
                }
            }
            return (
                <div key={index} className="grid w-fit relative pt-1">
                    <span onClick={apagar}
                        className={`text-red-700 pr-4 top-[-5%] left-[10%]  cursor-pointer absolute text-[.7em] ${titular ? '' : 'hidden'}`}>Excluir</span>
                    <Qualificao key={q.idQualificacao} nivel={q.nivel} nome={q.nome} />
                </div>
            )
        })
    }

    const renderizarFormacoes = () => {
        return perfil?.formacoes?.map((f, index) => {
            function apagar() {
                let confirma = confirm(`Excluir curso de ${f.curso}?`);
                if (confirma) {
                    formacaoService.deletarFormacao(f.id!, `${sessao.getSessao()?.accessToken}`);
                    setPerfil(pre => ({
                        ...pre!,
                        formacoes: pre?.formacoes?.filter(
                            item => item.id !== f.id
                        ) || []
                    }))
                }
            }

            return (
                <div key={index} className="grid  relative pt-1">
                    <span onClick={apagar}
                        className={`text-red-700 pr-4 top-[10%] left-[90%]  cursor-pointer absolute text-[.9em] ${titular ? '' : 'hidden'}`}>Excluir</span>
                    <FormacaoJSX key={f.id} curso={f.curso} id={f.id}
                        instituicao={f.instituicao} nivel={f.nivel} situacao={f.situacao} />
                </div>
            )
        })
    }

    const renderizarCertificacoes = () => {
        return perfil?.cursos?.map((c, index) => {
            function apagar() {
                let confirma = confirm(`Excluir curso de ${c.curso}?`);
                if (confirma) {
                    cursoService.deletarCurso(c.id!, `${sessao.getSessao()?.accessToken}`);
                    setPerfil(pre => ({
                        ...pre!,
                        cursos: pre?.cursos?.filter(
                            item => item.id !== c.id
                        ) || []
                    }))
                }
            }
            return (
                <div key={index} className="grid  relative pt-1">
                    <span onClick={apagar}
                        className={`text-red-700 pr-4 top-[10%] left-[90%]  cursor-pointer absolute text-[.9em] ${titular ? '' : 'hidden'}`}>Excluir</span>
                    <CursoJSX cargaHoraria={c.cargaHoraria} curso={c.curso} id={c.id}
                        instituicao={c.instituicao} key={c.id} />
                </div>
            )
        })
    }


    const renderizarExperiencias = () => {
        return perfil?.experiencias?.map((e, index) => {
            function apagar() {
                let confirma = confirm(`Excluir experiência como ${e.cargo}?`);
                if (confirma) {
                    experienciaService.deletarExperiencia(e.id!, `${sessao.getSessao()?.accessToken}`);
                    setPerfil(pre => ({
                        ...pre!,
                        experiencias: pre?.experiencias?.filter(
                            item => item.id !== e.id
                        ) || []
                    }))
                }
            }
            return (

                <div key={index} className="grid  relative pt-1">
                    <span onClick={apagar}
                        className={`text-red-700 pr-4 top-[10%] left-[90%]  cursor-pointer absolute text-[.9em] ${titular ? '' : 'hidden'}`}>Excluir</span>
                    <ExperienciaJSX cargo={e.cargo} descricao={e.descricao} duracao={e.duracao}
                        empresa={e.empresa} id={e.id} key={e.id} />
                </div>
            )
        })
    }

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
                <Header />
                <main className="bg-gray-020 py-5">
                    <div className=" w-[100vw] sm:w-[570px] md:w-[755px] lg:w-[900px] bg-white  flex items-center  px-2 pb-2 sm:m-auto border border-gray-300 shadow-lg">
                        <div className="">

                            <div style={{ backgroundImage: `url(http://localhost:8080/candidato/foto/${id})` }}
                                className="w-24 h-24  rounded-full bg-cover bg-no-repeat mr-4" />
                        </div>


                        <div className="mt-7 ">
                            <p className="text-[1.4em] font-semibold">{perfil?.nome}</p>
                            <p className="font-bold">PROFISSÃO</p>
                            <span className="text-gray-700">{`${perfil?.idade} Anos / ${perfil.cidade} - ${perfil.estado}`}</span>
                            {sessao.getSessao()?.perfil === "empresa" && (
                                <button onClick={() => setModalIsOpen(true)} className="bg-gray-700 text-white p-2 text-[.9em] rounded-lg block mt-5">Enviar proposta</button>
                            )}
                        </div>
                    </div>
                    <section className="flex gap-x-4 justify-center cursor-pointer pt-4">
                        <div onClick={() => setAba("informacoes")} className="flex flex-wrap bg-white p-1 rounded-lg">
                            <i className="material-symbols">person</i>
                            <span className={` ${id === sessao.getSessao()?.id ? '' : 'hidden'} mx-3 cursor-pointer ${aba === "informacoes" ? '' : 'hidden'}`}>Informações</span>
                        </div>

                        <div onClick={buscarCandidaturas} className="flex bg-white p-1 rounded-lg cursor-pointer">
                            <i className="material-symbols">work</i>
                            <span className={`${id === sessao.getSessao()?.id ? '' : 'hidden'} mx-3 cursor-pointer ${aba === "candidaturas" ? '' : 'hidden'}`}>Minhas candidaturas</span>

                        </div>

                        <div onClick={() => setAba("Editar")} className="flex bg-white p-1 rounded-lg cursor-pointer">
                            <i className="material-symbols">edit</i>
                            <span className={`${id === sessao.getSessao()?.id ? '' : 'hidden'} mx-3 cursor-pointer ${aba === "Editar" ? '' : 'hidden'}`}>Editar perfil</span>
                        </div>
                    </section>
                    {aba === "informacoes" && (
                        <div className="bg-white border border-gray-300 shadow-lg lg:w-[900px] md:w-[750px]  sm:w-[575px] w-[100vw] rounded-sm px-5 pb-10 m-auto mt-5 ">
                            <h3>Sobre</h3>
                            <pre className="font-[arial]  text-wrap">{perfil?.descricao}</pre>
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
                            <h4>Qualificações</h4>
                            {
                                perfil.qualificacoes?.length ? (
                                    <div className="max-h-[300px] flex flex-wrap gap-x-7 overflow-auto">
                                        {renderizarQualificacoes()}
                                    </div>
                                ) : (<h3>Usuário não possui qualificações cadastradas</h3>)
                            }
                            <hr className="my-6 text-gray-300" />
                            <h3>Formações</h3>
                            {renderizarFormacoes()}
                            <hr className="my-6 text-gray-300" />
                            <h3>Certificações</h3>
                            {renderizarCertificacoes()}
                            <hr className="my-6 text-gray-300" />
                            <h3>Experiências</h3>
                            {renderizarExperiencias()}
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
                    {
                        aba === "Editar" && (
                            <FormEditar perfil={perfil} />
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



export const Qualificao: React.FC<QualificacaoSalva> = ({ nome, nivel }) => {
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



// EDITAR PERFIL

interface editarProps {
    perfil: PerfilCandidato;
}
const FormEditar: React.FC<editarProps> = ({ perfil }) => {


    const service = CandidatoService();
    const utils = UtilsService();
    const [dadosSalvos, setDadosSalvos] = useState<DadosSalvosCandidato>();
    const [estados, setEstados] = useState<estado[]>([]);
    const [cidades, setCidades] = useState<cidade[]>([]);
    const [addFormacao, setAddFormacao] = useState<boolean>(false);
    const [addExperiencia, setAddExperiencia] = useState<boolean>(false);
    const [addCurso, setAddCurso] = useState<boolean>(false);
    const [addQualificacoes, setAddQualificacoes] = useState<boolean>(false);
    const [urlFoto, setUrlFoto] = useState<string>("http://localhost:8080/candidato/foto/" + perfil.id);
    const [foto, setFoto] = useState<File | null>(null);

    // Selecionando foto
    function selecionarFoto(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const foto = event.target.files[0];
            setUrlFoto(URL.createObjectURL(foto));
            setFoto(foto);
        }
    }

    const { handleChange, handleSubmit, values, setFieldValue } = useFormik<DadosSalvosCandidato>({
        initialValues: {
            curriculo: null, cursos: [], dataNascimento: dadosSalvos?.dataNascimento,
            descricao: dadosSalvos?.descricao, experiencias: [], formacoes: [],
            foto: null, idCidade: `${dadosSalvos?.idCidade}`, idEstado: `${dadosSalvos?.idEstado}`, nome: `${dadosSalvos?.nome}`, pcd: dadosSalvos?.pcd,
            sexo: dadosSalvos?.sexo, tel: `${dadosSalvos?.tel}`, trabalhando: dadosSalvos?.trabalhando, qualificacoes: []
        },
        onSubmit: submit,
        enableReinitialize: true
    })


    useEffect(() => {
        (async () => {
            const dados: DadosSalvosCandidato = await service.buscarDadosSalvos(`${ServicoSessao().getSessao()?.accessToken}`);
            setDadosSalvos(dados);
            //setUrlFoto(`${urlFoto}/${dados.id}`)
            const estados = await utils.buscarEstados();
            setEstados(estados);
            const cidades = await utils.buscarCidadesdeEstado(parseInt(dados.idEstado + ""));
            setCidades(cidades);
        })()
    }, []);

    // SELEÇÃO QUALIFICAÇÃO
    const qualificacaoService = QualificacaoService();
    const [resultQualificacoes, setResultQualificacoes] = useState<Qualificacao[]>([]);
    const [idQualificacaoSelecionada, setIdQualificacaoSelecionada] = useState<number | undefined>(undefined);



    async function submit() {
        await service.editarPerfil(values, `${ServicoSessao().getSessao()?.accessToken}`)
        if (foto) await service.salvarFoto(foto, `${ServicoSessao().getSessao()?.accessToken}`);
    }

    // BUSCANDO QUALIFICAÇÕES NO BANCO DE DADOS
    async function buscarQualificacoes(nome: string) {
        if (!nome || nome.trim().length === 0) {
            setResultQualificacoes([]);
        } else {
            const qualificacoesEncontradas: Qualificacao[] = await qualificacaoService.buscarQualificacoes(nome);
            setResultQualificacoes(qualificacoesEncontradas);
        }
    }
    // RENDERIZAR RESULTADO DA BUSCA PRO QUALIFICAÇÕES
    const renderizarQUalificacoesEncontradas = () => {
        return resultQualificacoes.map(q => {

            function mudarTexto() {
                const inputNomeQualificacao = document.getElementById("nome_qualificacao") as HTMLInputElement;
                inputNomeQualificacao.value = `${q.nome}`;
                setIdQualificacaoSelecionada(q.id);
                setResultQualificacoes([]);
            }
            return (
                <p className="cursor-pointer hover:bg-gray-100"
                    key={q.nome} onClick={mudarTexto}>
                    {q.nome}
                </p>
            )
        })
    }

    async function selecionarEstado(estado: HTMLSelectElement) {
        values.idEstado = estado.value;
        values.idCidade = "";
        const cidades = await utils.buscarCidadesdeEstado(parseInt(estado.value));
        setCidades(cidades);
    }

    function renderizarOptionEstados() {
        return estados.map((estado) => {
            return (
                <option key={estado.sigla} value={estado.id}>{estado.sigla}</option>
            )
        });
    }

    function renderizarOptionsCidade() {
        return cidades.map((cidade) => {
            return <option key={cidade.id} value={cidade.id}>{cidade.nome}</option>
        }
        )
    }


    // EXTRA

    const renderizarFormacoes = () => {
        return values.formacoes?.map(f => {
            async function apagar() {
                setFieldValue("formacoes", [...values.formacoes ? values.formacoes.filter(item => item.curso !== f.curso) : []])
            }

            return (
                <Formacao key={crypto.randomUUID()} click={apagar}
                    instituicao={f.instituicao} nivel={f.nivel} curso={f.curso} situacao={f.situacao} />
            )
        })
    }

    // ADICIONAR FORMAÇÃO
    function adicionarFormacao() {
        const instituicao = document.getElementById("fInstituicao") as HTMLInputElement
        const curso = document.getElementById("fCurso") as HTMLInputElement
        const nivel = document.getElementById("fNivel") as HTMLSelectElement
        const situacao = document.getElementById("fSituacao") as HTMLSelectElement
        if (instituicao.value.length && curso.value.length) {
            setFieldValue("formacoes", [
                ...values.formacoes ? values.formacoes : [],
                { instituicao: instituicao.value, curso: curso.value, nivel: nivel.value, situacao: situacao.value }
            ])
            instituicao.value = "";
            curso.value = "";
        }
    }


    const renderizarQualificacoes = () => {
        return values.qualificacoes?.map(q => {
            async function apagar() {
                setFieldValue("qualificacoes", [
                    ...values.qualificacoes ? values.qualificacoes.filter(item => item.idQualificacao !== q.idQualificacao) : []
                ])

            }
            return (
                <QualificacaoComponent click={apagar}
                    idQualificacao={q.idQualificacao} nivel={`` + q.nivel} nome={`${q.nome}`} key={q.idQualificacao}
                />
            )
        })
    }

    function selecionarQualificacao() {
        if (idQualificacaoSelecionada) {
            const inputNomeQualificacao = document.getElementById("nome_qualificacao") as HTMLInputElement;
            const nivel = document.getElementById("nivel") as HTMLSelectElement;
            if (idQualificacaoSelecionada && nivel.length && inputNomeQualificacao.value.length) {

                if (!values.qualificacoes?.some((item) => item.idQualificacao === idQualificacaoSelecionada
                )) {
                    //PARA ENVIAR AO BACK END
                    const qualificacao: qualificacaoUsuario = {
                        idQualificacao: idQualificacaoSelecionada,
                        nivel: nivel.value, nome: inputNomeQualificacao.value
                    };
                    setFieldValue("qualificacoes", [
                        ...values.qualificacoes ? values.qualificacoes : [],
                        qualificacao
                    ])
                }
                inputNomeQualificacao.value = "";
            }
        }
    }

    // ADICIONAR EXPERIENCIA
    function adicionarExperiencia() {
        const empresa = document.getElementById("eEmpresa") as HTMLInputElement
        const cargo = document.getElementById("eCargo") as HTMLInputElement
        const descricao = document.getElementById("eDescricao") as HTMLTextAreaElement
        const duracao = document.getElementById("eDuracao") as HTMLInputElement
        if (empresa.value.length && cargo.value.length && descricao.value.length && duracao.value.length) {
            setFieldValue("experiencias", [
                ...values.experiencias ? values.experiencias : [],
                { cargo: cargo.value, descricao: descricao.value, empresa: empresa.value, duracao: duracao.value }
            ])
            empresa.value = "";
            cargo.value = "";
            descricao.value = "";
            duracao.value = "";
        }
    }




    const renderizarExperiencias = () => {
        return values.experiencias?.map(e => {
            async function apagar() {
                const confirmacao = confirm("Confirma a exclusão dessa experiência?");
                if (confirmacao) {
                    setFieldValue("experiencias", [
                        ...values.experiencias ? values.experiencias.filter(item => item.cargo !== e.cargo && item.empresa !== e.empresa) : []
                    ])
                }
            }

            return (<Experiencia click={apagar}
                key={crypto.randomUUID()} empresa={`${e.empresa}`} cargo={e.cargo + ""} descricao={`${e.descricao}`} duracao={`${e.duracao}`} />)
        }
        )
    }

    const renderizarCurso = () => {
        return values.cursos?.map(c => {
            async function apagar() {
                setFieldValue("cursos", [
                    ...values.cursos ? values.cursos.filter(item => item.id !== c.id) : []
                ])

            }
            return (<Curso click={apagar}
                key={crypto.randomUUID()} carga={c.cargaHoraria ? c.cargaHoraria : 0} curso={`${c.curso}`} instituicao={`${c.instituicao}`} />)
        }
        )
    }

    // ADICIONAR CURSO
    function adicionarCurso() {
        const instituicao = document.getElementById("cInstituicao") as HTMLInputElement
        const curso = document.getElementById("cCurso") as HTMLInputElement
        const carga = document.getElementById("cCargaHoraria") as HTMLTextAreaElement
        if (instituicao.value.length && curso.value.length && carga.value.length) {
            //const cursoComplementar: CadastroCurso = { cargaHoraria: parseInt(carga.value), curso: curso.value, instituicao: instituicao.value };
            setFieldValue("cursos", [
                ...values.cursos ? values.cursos : [],
                { cargaHoraria: parseInt(carga.value), curso: curso.value, instituicao: instituicao.value }
            ])
            instituicao.value = "";
            curso.value = "";
            carga.value = "";
        }
    }


    return (

        <div className="border border-gray-300 mt-10  w-[370px] sm:w-[650px] h-fit bg-white mb-56 m-auto ">
            <h3 className="text-center">Editar perfil</h3>

            <div className="flex flex-col items-center gap-y-5">
                <label>
                    <div style={{ backgroundImage: `url(${urlFoto})` }}
                        className="h-36 w-36 rounded-full bg-cover flex cursor-pointer">
                        <input onChange={(event) => selecionarFoto(event)} id="foto" type="file" className="hidden" />
                    </div>
                </label>
                <label htmlFor="foto" className="bg-gray-800 text-white rounded-sm p-1 cursor-pointer">Selecionar foto</label>
            </div>

            <form onSubmit={handleSubmit}
                className="w-fit m-auto">
                <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4 px-5 py-5  m-auto">
                    <div className="grid">
                        <label>Nome:</label>
                        <input value={values.nome} onChange={handleChange} id="nome" placeholder="Nome completo" className="border border-gray-400  h-10 rounded-sm w-[260px] " />
                    </div>

                    <div className="grid">
                        <label>Tel:</label>
                        <input value={values.tel} onChange={handleChange} id="tel" placeholder="(**) *****-****" className="border border-gray-400  h-10 rounded-sm w-[260px] " />
                    </div>

                    <div className="grid">
                        <label>Estado:</label>
                        <select value={values.idEstado} id="idEstado" name="idEstado" onChange={(event) => selecionarEstado(event.target)} className="border border-gray-400  h-10 w-[260px] rounded-sm">
                            {renderizarOptionEstados()}
                        </select>
                    </div>

                    <div className="grid">
                        <label>Cidade:</label>
                        <select id="idCidade" name="idCidade" onChange={handleChange} className="border border-gray-400  h-10 w-[260px] rounded-sm" value={values.idCidade}>
                            {renderizarOptionsCidade()}
                        </select>
                    </div>

                    <div className="grid">
                        <label>PCD:</label>
                        <select value={values.pcd + ''} onChange={handleChange} id="pcd" className="border border-gray-400  h-10 rounded-sm sm:w-[260px] ">
                            <option value="false">Não</option>
                            <option value="true">Sim</option>
                        </select>
                    </div>

                    <div className="grid">
                        <label>Está empregado:</label>
                        <select value={values.trabalhando + ""} onChange={handleChange} id="trabalhando" className="border border-gray-400  h-10 rounded-sm sm:w-[260px] ">
                            <option value="false">Não</option>
                            <option value="true">Sim</option>
                        </select>
                    </div>

                    <div className="grid">
                        <label>Sexo:</label>
                        <select value={values.sexo} id="sexo" onChange={handleChange} className="border border-gray-400  h-10 rounded-sm sm:w-[260px] ">
                            <option value="MASCULINO">Maculino</option>
                            <option value="FEMININO">Feminino</option>
                        </select>
                    </div>

                    <div className="grid">
                        <label>Data de nascimento</label>
                        <input value={values.dataNascimento ? `${values.dataNascimento}` : new Date().toDateString()} type="date" id="dataNascimento"
                            className="border border-gray-400  h-10 rounded-sm sm:w-[260px] " onChange={handleChange} />
                    </div>
                </div>
                <div className="grid grid-cols-1 pt-5 px-3 m-auto w-[370px] sm:w-[650px]">
                    <label htmlFor="descricao">Descrição:</label>
                    <textarea id="descricao" name="descricao" placeholder="Fale sobre seu eu profissional" className="rounded-lg mt-3 h-32 sm:h-56 pl-1 " value={values.descricao} onChange={handleChange} />
                </div>
                <h4>Qualificações</h4>
                <i onClick={() => setAddQualificacoes(!addQualificacoes)} className="material-symbols cursor-pointer">{addQualificacoes ? "done" : "add"}</i>
                {addQualificacoes && (
                    <>
                        <div className="grid  gap-2 w-fit">
                            <div className="grid ">
                                <label htmlFor="nivel">Nivel:</label>
                                <select className="border border-gray-500 pl-2 w-fit h-8" id="nivel" onChange={handleChange}>
                                    <option value="BASICO">Básico</option>
                                    <option value="INTERMEDIARIO">Intermediario</option>
                                    <option value="AVANCADO">Avançado</option>
                                </select>
                            </div>
                            <div className="gri relative">
                                <div className="grid relative">

                                    <label htmlFor="nome_qualificacao">Qualificação:</label>
                                    <input onChange={(event) => buscarQualificacoes(event.target.value)} id="nome_qualificacao" type="text" placeholder="Busque aqui" className="w-[210px] rounded-md h-8" />
                                </div>
                                <div className={`border border-gray-200 w-[210px] absolute top-[100%] z-10  bg-white `}>
                                    {renderizarQUalificacoesEncontradas()}
                                </div>
                            </div>
                        </div>
                        <div className="w-36 h-9 flex flex-col justify-center border text-center my-5 rounded-md cursor-pointer" onClick={selecionarQualificacao}>Adicionar</div>

                        <div className=" text-nowrap flex gap-x-3 px-4 overflow-x-auto ">
                            {renderizarQualificacoes()}
                        </div>
                    </>
                )
                }
                <h4>Formações</h4>
                <i onClick={() => setAddFormacao(!addFormacao)} className="material-symbols cursor-pointer">{addFormacao ? "done" : "add"}</i>
                {addFormacao && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-fit">
                            <div className="grid">
                                <input id="fInstituicao" type="text" placeholder="Instituição"
                                    className=" h-8 rounded-md " />
                            </div>
                            <div className="grid">
                                <input id="fCurso" type="text" placeholder="Curso"
                                    className=" h-8 rounded-sm" />
                            </div>
                            <div className="grid">
                                <label htmlFor="fNivel" className="">Nivel: </label>
                                <select className="border  h-9 rounded-sm" id="fNivel">
                                    <option>TECNICO </option>
                                    <option>TECNOLOGO </option>
                                    <option>GRADUACAO </option>
                                    <option>POS_GRADUACAO </option>
                                    <option>MESTRADO </option>
                                    <option>DOUTORADO </option>
                                </select>
                            </div>
                            <div className="grid">
                                <label htmlFor="fSituacao" className="">Situação: </label><div />
                                <select className="border  h-9 rounded-sm" id="fSituacao">
                                    <option value="CONCLUIDO">Concluido</option>
                                    <option value="EM_ANDAMENTO">Em andamento</option>
                                </select>
                            </div>
                            <div className="" >
                                <div className="w-36 h-9 flex flex-col justify-center border text-center  rounded-md cursor-pointer" onClick={adicionarFormacao}>Adicionar</div>
                            </div>
                        </div>
                        {renderizarFormacoes()}
                    </>
                )}
                <h4>Experiências</h4>
                <i onClick={() => setAddExperiencia(!addExperiencia)} className="material-symbols cursor-pointer">{addExperiencia ? "done" : "add"}</i>
                {addExperiencia && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-fit">
                            <div>
                                <input id="eEmpresa" type="text" placeholder="Empresa" className="w-[210px] h-8 rounded-sm" />
                            </div>
                            <div>
                                <input id="eCargo" type="text" placeholder="Cargo" className="w-[210px] h-8 rounded-sm" />

                            </div>
                            <div className="grid">
                                <label htmlFor="eDuracao">Duração:</label>
                                <input id="eDuracao" type="text" placeholder="Ex: 1 ano e 7 meses"
                                    className=" h-8 rounded-sm" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 pt-10">
                            <label htmlFor="eDescricao">Descrição:</label>
                            <textarea id="eDescricao" placeholder="Descrição" className="rounded-lg mt-3 h-32 pl-1 mb-5" />
                        </div>

                        <div className="">
                            <div className="m-auto w-36 h-9 flex flex-col justify-center border text-center  rounded-md cursor-pointer" onClick={adicionarExperiencia}>Adicionar</div>
                        </div>
                        {renderizarExperiencias()}
                    </>

                )}
                <h4>Certificações</h4>
                <i onClick={() => setAddCurso(!addCurso)} className="material-symbols cursor-pointer">{addCurso ? "done" : "add"}</i>
                {addCurso && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-fit">
                            <div className="grid">
                                <label htmlFor="cInstituicao">Instituição:</label>
                                <input id="cInstituicao" type="text" placeholder="Instituição" className="h-8 w-[220px]" />
                            </div>
                            <div className="grid">
                                <label htmlFor="cCurso">Curso:</label>
                                <input id="cCurso" type="text" placeholder="Nome do curso" className="h-8 w-[220px]" />
                            </div>
                            <input id="cCargaHoraria" type="number" placeholder="Carga horária" className="h-8 w-[220px]" />
                            <div className="w-36 h-8  flex flex-col justify-center border text-center rounded-sm cursor-pointer" onClick={adicionarCurso}>Adicionar</div>
                        </div>
                        {renderizarCurso()}
                    </>
                )
                }
                <div className="flex justify-center mt-12 mb-16">
                    <input value="Salvar" type="submit" className="cursor-pointer  w-20 py-1 text-center text-white  bg-gray-700 " />
                </div>
            </form>
        </div>
    )
}