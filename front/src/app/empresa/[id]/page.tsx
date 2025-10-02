'use client'

import { Qualificao } from "@/app/candidato/[id]/page";
import { Option } from "@/app/candidato/page";
import { Vaga } from "@/app/vaga/[idVaga]/page";
import { dadosCadastroVaga } from "@/app/vaga/cadastro/formSchema";
import { CardUsuario } from "@/components/cadUsuario";
import { Menu } from "@/components/header";
import { CardRascunho, GerenciadorDeRascunhos } from "@/components/rascunho";
import { SelectEstadoCidade } from "@/components/Select";
import { CandidatoCadastrado, PerfilCandidato } from "@/resources/candidato/candidatoResource";
import { CandidatoService } from "@/resources/candidato/servico";
import { perfilEmpresa } from "@/resources/empresa/model";
import { CadastroModeloDeProposta, ModeloDeProposta } from "@/resources/empresa/rascunho/rascunhoResource";
import { ServicoEmpresa } from "@/resources/empresa/sevico"
import { CadastroMensagemDTO, MensagemDTO } from "@/resources/mensagem/mensagemResource";
import { QualificacaoSalva } from "@/resources/qualificacao/qualificacaoResource";
import { ServicoSessao } from "@/resources/sessao/sessao";
import { cidade, estado, UtilsService } from "@/resources/utils/utils";
import { dadosVaga, VagaEmpresaDTO } from "@/resources/vaga_emprego/DadosVaga";
import { VagaService } from "@/resources/vaga_emprego/service";
import { Client } from "@stomp/stompjs";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


export default function PerfilEmpresa() {
    const id = useParams().id;
    const router = useRouter();
    const service = ServicoEmpresa();
    const vagaService = VagaService();
    const sessao = ServicoSessao();
    const [perfil, setPerfil] = useState<perfilEmpresa>();
    const [vagas, setVagas] = useState<VagaEmpresaDTO[]>([]);
    const [rascunhos, setRascunhos] = useState<ModeloDeProposta[]>([]);
    const [candidatosVaga, setCandidatosVaga] = useState<CandidatoCadastrado[]>([]);
    const [indexListaCandidato, setIndexListaCandidato] = useState<number>();
    const [statusCandidato, setStatusCandidato] = useState<string>("EM_ANALISE");
    const [dadosModalCandidato, setDadosModalCandidato] = useState<PerfilCandidato | null>(null)
    const [idVagaSelecionada, setIdVagaSelecionada] = useState<string | null>(null);
    const [cardVaga, setCardVaga] = useState<dadosVaga | null>(null);
    const [dadosCadastraisVaga, setDadosCadastraisVaga] = useState<dadosCadastroVaga | null>(null);
    const [aba, setAba] = useState<"vagas" | "rascunhos">("vagas");
    const [nav, setNav] = useState<string>("dados");
    const [modalIsOpen, setmodalOpen] = useState<boolean>(false);
    const clientRef = useRef<Client | null>(null);
    const [popUpPropostaIsOpen, setPopUpPropostaIsOpen] = useState<boolean>(false);
    /* USADO PARA INDICAR SE O USUÁRIO DESEJA SELECIONAR UM CANDIDATO
    * CONSIDERA-SE QUE DESEJA DISPENSAR O MESMO ↓   */
    const [selecionar, setSelecionar] = useState<boolean>(true);



    // Execuutando efeitos ao carregar a página
    useEffect(() => {
        // Carregando perfil da empresa e suas vagas publicadas
        (async () => {
            const perfilEncontrado = await service.carregarPerfil(`${id}`);
            setPerfil(perfilEncontrado)
            const vagas = await vagaService.buscarVagasEmpresa(`${id}`);
            setVagas(vagas);
            if (sessao.getSessao()?.perfil === "empresa") {
                const rascunhos = await service.buscarRascunhos(`${sessao.getSessao()?.accessToken}`);
                setRascunhos(rascunhos);
            }
        })()

        // OBJETO DE CONEXÃO COM WS
        /*  const client = new Client({
              brokerURL: 'ws:localhost:8080/conect',
              reconnectDelay: 15000,
              heartbeatIncoming: 10000,
              heartbeatOutgoing: 10000,
              connectHeaders: {
                  'Authorization': `Bearer ${sessao.getSessao()?.accessToken}`
              }
          })
  
          client.onStompError = (erro) => {  }
          if (!clientRef.current?.connected) {
              client.onConnect = () => {
                  console.log("CONECTOU!!!!!!!!!!")
              }
              client.activate();
              clientRef.current = client;
          }*/
    }, [])


    useEffect(() => {
        (async () => {
            if (idVagaSelecionada) {
                const dados: dadosVaga = await vagaService.carregarVaga(`${idVagaSelecionada}`, `${sessao.getSessao()?.accessToken}`);
                setCardVaga(dados);
            }
        })()
    }, [idVagaSelecionada])


    // Enviado mensagem para candidato
    function enviarMensagem(mensagem: string) {
        const mensagemDTO: CadastroMensagemDTO = { idCandidato: parseInt(`${dadosModalCandidato?.id}`), idEmpresa: `${sessao.getSessao()?.id}`, texto: mensagem, perfilRemetente: `${sessao.getSessao()?.perfil}` }
        clientRef.current?.publish({
            destination: `/app/receber-mensagem/${id}${dadosModalCandidato?.id}`,
            body: JSON.stringify(mensagemDTO)
        })

        if (selecionar) selecionarCandidato();
        else dispensarCandidato();
    }

    /// Selecionando candidato
    async function selecionarCandidato() {
        const token = sessao.getSessao()?.accessToken + "";
        await VagaService().selecionarCandidato(`${dadosModalCandidato?.id}`, `${idVagaSelecionada}`, token);
        if (indexListaCandidato != null) candidatosVaga[indexListaCandidato].status = 'SELECIONADO'
        fecharModal();
        setPopUpPropostaIsOpen(false);
    }

    // Dispensando candidato
    async function dispensarCandidato() {
        const token = sessao.getSessao()?.accessToken + "";
        await VagaService().dispesarCandidato(`${dadosModalCandidato?.id}`, `${idVagaSelecionada}`, token);
        if (indexListaCandidato != null) candidatosVaga[indexListaCandidato].status = 'DISPENSADO'
        fecharModal();
        setPopUpPropostaIsOpen(false);
    }

    // Transformando dados da vaga em componente JSX
    function vagaObjectToComponent(dados: VagaEmpresaDTO) {
        return <MiniCardVaga id={dados.id} tempo_decorrido={dados.tempo_decorrido} titulo={dados.titulo} key={dados.id}
            candidaturas={dados.qtd_candidatos}
            click={() => sessao.getSessao()?.id === id ? setIdVagaSelecionada(`${dados.id}`) : router.push(`/vaga/${dados.id}`)} />
    }

    const renderizarVagas = () => { return vagas.map(vagaObjectToComponent) };


    async function excluirRascunho(idRascunho?: string) {
        if (idRascunho) {
            const confirma = confirm("Confirma a exclusão desse rascunho??")
            if (confirma) {
                await service.excluir_rascunho(`${sessao.getSessao()?.accessToken}`, idRascunho);
                setRascunhos(prev => prev.filter(item => item.id !== idRascunho));
            }
        }
    }

    function rascunhoToJSX(rascunho: ModeloDeProposta) {
        return (
            <CardRascunho apagarRascunho={() => excluirRascunho(rascunho.id)} key={rascunho.id} descricao={rascunho.descricao} id={rascunho.id} titulo={rascunho.titulo} />
        )
    }

    const renderizarRascunhos = () => { return rascunhos.map(rascunhoToJSX) }

    async function CadastrarRascunho(dados: CadastroModeloDeProposta) {
        const modeloSalvo: ModeloDeProposta = await ServicoEmpresa().cadastrarRascunho(dados, `${ServicoSessao().getSessao()?.accessToken}`)
        setRascunhos(pre => [...pre, modeloSalvo]);
    }

    async function buscarCandidatos() {
        if (idVagaSelecionada && !candidatosVaga.length) {
            const candidatos = await vagaService.buscarCandidatosVaga(idVagaSelecionada, `${sessao.getSessao()?.accessToken}`)
            setCandidatosVaga(candidatos);
        }
        setNav("candidatos")
    }

    // Abrindo modal de candidato
    async function abrirModal(idCandidato: string, indexListaCandidato: number) {
        setmodalOpen(true);
        document.body.classList.add("overflow-hidden");
        const dadosCandidato = await CandidatoService().carregarPerfil(idCandidato);
        setDadosModalCandidato(dadosCandidato);
        setIndexListaCandidato(indexListaCandidato);
    }

    const toQualificacao = (qualificacao: QualificacaoSalva, key: number) => {
        return <Qualificao key={key} nivel={qualificacao.nivel} nome={qualificacao.nome} />
    }
    const renderizarQualificacoes = () => { return dadosModalCandidato?.qualificacoes?.map(toQualificacao) }

    const fecharModal = () => { setmodalOpen(false), document.body.classList.remove("overflow-hidden"), setDadosModalCandidato(null) }

    async function buscarDadosCadastrais() {
        if (idVagaSelecionada) {
            const dados = await vagaService.buscarDadosCadastrais(idVagaSelecionada, sessao.getSessao()?.accessToken + "");
            setDadosCadastraisVaga(dados);
            setNav("editar");
        }
    }

    function voltar() {
        setNav("dados");
        setCandidatosVaga([]);
        setCardVaga(null);
        setIdVagaSelecionada(null);
        setDadosCadastraisVaga(null)
    }


    function candidatoToCard(dados: CandidatoCadastrado, key: number) {
        if (statusCandidato === dados.status)
            return (
                <div className="flex items-center" key={"1" + key}>
                    <CardUsuario load={false} cidade={dados.cidade} estado={dados.estado} id={dados.id} idade={dados.idade} key={dados.id} nome={dados.nome} />
                    {statusCandidato === "EM_ANALISE" && (
                        <button className="border rounded-lg p-1" onClick={() => abrirModal(`${dados.id}`, key)} key={key}>Avaliar</button>
                    )}
                </div>
            )
    }

    const renderizarCardCandidato = () => { return candidatosVaga.map(candidatoToCard) }



    return (
        <>
            <div className="h-[200vh] w-full bg-gray-200">
                <header className="h-20 w-full  bg-gray-100">
                    <div className=" h-full flex flex-row-reverse items-end">
                        <Menu />
                    </div>
                </header>
                <main className=" ">
                    <section id="informacoes" className="" >
                        <div className="z-30 pb-3  flex flex-row-reverse items-center justify-center">
                            <img id="capa" className=" h-48 w-[98%] rounded-2xl mt-2  z-0"
                                src={`http://localhost:8080/empresa/capa/${id}`} />
                            <div id="foto" className="border-2 border-gray-800 h-32 w-32 rounded-full  -mr-32 mt-28 bg-no-repeat bg-contain z-10"
                                style={{ backgroundImage: `url(http://localhost:8080/empresa/foto/${id})` }} />
                        </div>
                        <h2 className="pl-2 pb-3">{perfil?.nome}</h2>
                        <pre className="text-wrap font-[arial] text-justify px-2 text-[.9em] mb-6">{perfil?.descricao}</pre>
                    </section>
                    <hr className="mt-9 w-[97%] m-auto hidden" />
                    <section >
                        <nav className="" >
                            <ul className="bg-white border border-gray-300 w-fit px-3 h-14 pl-3 rounded-[23px] flex items-center m-auto">
                                <li onClick={() => setAba("vagas")} className={`${aba === "vagas" ? 'bg-gray-200' : ''} cursor-pointer p-1 rounded-lg transition duration-700`}>
                                    <div className="flex">
                                        <i className={` material-symbols`}>work</i>
                                        <span className={`${aba == 'vagas' ? 'block' : 'hidden'}`}>Vagas</span>
                                    </div>
                                </li>
                                {sessao.getSessao()?.perfil === "empresa" && (
                                    <li onClick={() => setAba("rascunhos")} className={`${perfil?.id == id ? '' : 'hidden'} cursor-pointer ${aba === "rascunhos" ? 'bg-gray-200' : ''} p-1 rounded-lg transition duration-700 w-fit`}>
                                        <div className="flex">
                                            <i className={`material-symbols`}>Note_Alt</i>
                                            <span className={`${aba == "rascunhos" ? 'block' : 'hidden'}`}>Rascunhos</span>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </nav>
                        <div className="flex flex-wrap items-start gap-1 mt-16    rounded-md m-auto">
                            {aba === "vagas" ? (
                                !idVagaSelecionada ? (
                                    <section className="flex flex-wrap justify-center w-full gap-x-3  p-2">
                                        {renderizarVagas()}
                                    </section>
                                ) : (
                                    <div className="flex flex-col w-full">
                                        <nav className="mb-10 pl-4">
                                            <ul className="bg-white border border-gray-300 w-fit px-3 h-14 pl-3 rounded-[23px] flex items-center gap-x-2 m-auto">
                                                <li onClick={voltar} className={`cursor-pointer p-1 rounded-lg transition duration-700 material-symbols`} title="Voltar">arrow_Back</li>
                                                <li onClick={() => setNav("dados")} className={`${nav === "dados" ? 'bg-gray-200' : ''} cursor-pointer p-1 rounded-lg transition duration-700`} title="Dados">
                                                    <div className="flex">
                                                        <i className={` material-symbols`}>Data_check</i>
                                                        <span className={`${nav == 'dados' ? 'block' : 'hidden'}`}>Dados</span>
                                                    </div>
                                                </li>
                                                <li onClick={buscarCandidatos} className={`${nav === "candidatos" ? 'bg-gray-200' : ''} cursor-pointer p-1 rounded-lg transition duration-700`} title="Candidatos">
                                                    <div className="flex">
                                                        <i className={` material-symbols`}>Person</i>
                                                        <span className={`${nav == 'candidatos' ? 'block' : 'hidden'}`}>Candidatos</span>
                                                    </div>
                                                </li>
                                                <li onClick={buscarDadosCadastrais} className={`${nav === "editar" ? 'bg-gray-200' : ''} cursor-pointer p-1 rounded-lg transition duration-700`} title="Editar vaga">
                                                    <div className="flex">
                                                        <i className={` material-symbols`}>edit</i>
                                                        <span className={`${nav == 'editar' ? 'block' : 'hidden'}`}>Editar</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </nav>
                                        <br />
                                        {cardVaga?.id && (
                                            <div className="flex w-full">
                                                {nav === "dados" && (
                                                    <div className="w-full">
                                                        <Vaga vaga={cardVaga} />
                                                    </div>
                                                )}
                                                {nav === "candidatos" && (
                                                    <div className="w-full">
                                                        <nav>
                                                            <ul className="bg-white border border-gray-300 w-fit px-3 h-14 pl-3 rounded-[23px] flex items-center gap-x-2 m-auto">
                                                                <li onClick={() => setStatusCandidato("EM_ANALISE")} className={`${statusCandidato === "EM_ANALISE" ? 'bg-gray-200' : ''} cursor-pointer p-1 rounded-lg transition duration-700`} title="Dados">Em análise</li>
                                                                <li onClick={() => setStatusCandidato("SELECIONADO")} className={`${statusCandidato === "SELECIONADO" ? 'bg-gray-200' : ''} cursor-pointer p-1 rounded-lg transition duration-700`} title="Dados">Selecionados</li>
                                                                <li onClick={() => setStatusCandidato("DISPENSADO")} className={`${statusCandidato === "DISPENSADO" ? 'bg-gray-200' : ''} cursor-pointer p-1 rounded-lg transition duration-700`} title="Dados">Dispensados</li>
                                                            </ul>
                                                        </nav>
                                                        <section className="ml-4 flex flex-wrap gap-5 mt-10">
                                                            {renderizarCardCandidato()}
                                                        </section>
                                                        {modalIsOpen && (
                                                            <div className="fixed inset-0  z-50 overflow-hidden">
                                                                <div className="inset-0 bg-black  absolute overflow-hidden opacity-50" />
                                                                <div style={{ transform: 'translate(-50%, -50%)' }} className="absolute bg-white top-[50%] left-[50%] w-[78%] p-6 rounded-lg">
                                                                    <div className=" text-right">
                                                                        <button onClick={fecharModal}
                                                                            className="h-8 w-8 text-2xl  text-black cursor-pointer absolute font-extrabold -top-2 left-[95%]" >
                                                                            x
                                                                        </button>
                                                                    </div>
                                                                    <br />
                                                                    <div className="flex items-center">
                                                                        <div style={{ backgroundImage: `url(http://localhost:8080/candidato/foto/${dadosModalCandidato?.id}` }}
                                                                            className="h-20 w-20 rounded-full bg-cover bg-no-repeat mr-3" />
                                                                        <span className="text-[1.3em] font-semibold">{dadosModalCandidato?.nome}</span><br />

                                                                    </div>
                                                                    <p>{`${dadosModalCandidato?.idade} anos`}</p>
                                                                    <span>{`${dadosModalCandidato?.cidade}, ${dadosModalCandidato?.estado}`}</span>
                                                                    <span>{ }</span>
                                                                    <hr className="my-4 w-[95%] m-auto text-gray-300" />
                                                                    <h3>Descrição</h3>
                                                                    <p className="mx-2 text-justify">{dadosModalCandidato?.descricao}</p>
                                                                    <hr className="my-4 w-[95%] m-auto text-gray-300" />
                                                                    <h3>Contato</h3>
                                                                    <p>{dadosModalCandidato?.email}</p>
                                                                    <p>{dadosModalCandidato?.tel}</p>
                                                                    <h3>Qualificações</h3>
                                                                    {renderizarQualificacoes()}<br />
                                                                    <button onClick={() => { setPopUpPropostaIsOpen(true), setSelecionar(true) }} className="bg-gray-950 text-white p-2 rounded-lg">Selecionar</button>
                                                                    <button onClick={() => { setPopUpPropostaIsOpen(true), setSelecionar(false) }} className="p-2 rounded-lg ml-5 border">Dispensar</button>
                                                                    <PopUp selecionar={selecionar} isOpen={popUpPropostaIsOpen} click={enviarMensagem} mensagemPadrao={selecionar ? cardVaga.mensagemConvocacao : cardVaga.mensagemDispensa} close={() => setPopUpPropostaIsOpen(false)} />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {nav === "editar" && (<FormEditarVaga idVaga={idVagaSelecionada} vaga={dadosCadastraisVaga} />)}
                                            </div>
                                        )}
                                    </div>
                                )
                            ) : (
                                <>
                                    <GerenciadorDeRascunhos condition={true} enviarForm={CadastrarRascunho}>
                                        {renderizarRascunhos()}
                                    </GerenciadorDeRascunhos>
                                </>
                            )

                            }
                        </div>
                    </section>
                </main>

            </div >
        </>
    )
}

// POP-UP DE SELEÇÃO DE CANDIDATO       <--------------------------------------------------------------------------------------------------

interface popUpProps {
    isOpen: boolean;
    close: (event: any) => void;
    mensagemPadrao: string;
    selecionar: boolean;
    click: (event: any) => void
}



const PopUp: React.FC<popUpProps> = ({ click, isOpen, mensagemPadrao, selecionar, close }) => {

    interface mensagemForm {
        mensagem: string;
    }
    const { handleChange, values } = useFormik<mensagemForm>({
        initialValues: { mensagem: `${mensagemPadrao}` },
        enableReinitialize: true,
        onSubmit: () => console.log("Enviando mensagem")
    })


    return (
        <div style={{ transform: 'translate(-50%,-50%)' }}
            className={`border border-gray-400 p-5 absolute top-[50%] left-[50%] bg-white rounded-lg ${isOpen ? '' : 'hidden'}`}>
            <span className="absolute text-2xl -top-[3%] left-[94%] z-30 cursor-pointer font-extrabold" onClick={close}>x</span>
            <h3>{selecionar ? 'Selecionar candidato' : 'Dispensar candidato'}</h3>
            <label className="block mb-2" htmlFor="mensagem"><strong>Mensagem:</strong></label>
            <textarea id="mensagem" onChange={handleChange} value={values.mensagem} className="h-20 w-72 rounded-md" /><br />
            <div className="flex justify-center pt-6">
                <button onClick={() => click(values.mensagem)} className="bg-gray-700 text-white p-1 rounded-md">Enviar</button>
            </div>
        </div>
    )
}


interface miniCardVagaProps {
    id?: string;
    titulo?: string;
    tempo_decorrido?: string;
    candidaturas?: string;
    click: (event: any) => void
}

const MiniCardVaga: React.FC<miniCardVagaProps> = ({ id, tempo_decorrido, titulo, click, candidaturas }) => {
    return (
        <div className="border border-gray-400 bg-white w-[260px]  h-[170px] rounded-[25px] p-2 cursor-pointer my-4" onClick={click}>
            <div className="mt-2 pl-2">
                <h4 className="text-wrap h-fit">{titulo}</h4>
                <span className="flex  gap-x-1 h-fit"><i className="material-symbols">acute</i>{tempo_decorrido}</span>
                <p className="h-fit">{candidaturas}</p>
                <p className="text-blue-700 hover:underline">Mais detalhes</p>

            </div>
        </div>
    )
}


interface formEditProps {
    vaga: dadosCadastroVaga | null
    idVaga: string | null
}

const FormEditarVaga: React.FC<formEditProps> = ({ vaga, idVaga }) => {

    if (vaga) {

        const [estados, setEstado] = useState<estado[]>([]);
        const [cidades, setCidades] = useState<cidade[]>([]);
        const utilsService = UtilsService();
        //alert(JSON.stringify(vaga.idCidade))
        const { handleChange, handleSubmit, values } = useFormik<dadosCadastroVaga>({
            initialValues: vaga,
            onSubmit: submit
        })

        async function submit() {
            await VagaService().editarVaga(`${idVaga}`, values, `${ServicoSessao().getSessao()?.accessToken}`)
        }

        useEffect(() => {
            (async () => {
                const estadosEncontados: estado[] = await utilsService.buscarEstados();
                setEstado(estadosEncontados);
            })();

        }, [])


        useEffect(() => {
            (async () => {
                const cidades = await utilsService.buscarCidadesdeEstado(parseInt(values.idEstado));
                setCidades(cidades);
            })();

        }, [values.idEstado])


        // Criando options 
        function criaOption(texto: string, id: number) {
            return (
                <Option key={id} texto={texto} id={id} />
            )
        }

        // Renderizando os options de estados
        function renderizarOptionEstados() {
            return estados.map((estado) => criaOption(estado.sigla, estado.id));
        }

        // Renderizando os options de cidades
        function renderizarOptionsCidade() {
            return (
                cidades.map((cidade) => criaOption(cidade.nome, cidade.id))
            );
        }


        function definirTeclasPermitidas(keyDown: React.KeyboardEvent<HTMLInputElement>) {
            if (keyDown.ctrlKey && keyDown.key.toLowerCase() == 'a') return;
            const permitidos = ['0', '9', '8', '7', '6', '5', '4', '3', '2', '1', '.', ',', 'Backspace', 'ArrowLeft', 'ArrowRight']
            if (!permitidos.includes(keyDown.key)) {
                keyDown.preventDefault();
            }
        }

        return (
            <div className="sm:w-[700px] w-[600px] bg-white border border-gray-500 shadow-2xl rounded-md  m-auto  font-[arial] pt-10">
                <h2 className="text-center mb-10">Aditar dados da vaga</h2>
                <form className="" onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid w-[300px] m-auto">
                            <label>Adicione um titulo:</label>
                            <input className="border h-10 rounded-md"
                                onChange={handleChange} value={values.titulo} id="titulo" type="text" placeholder="Titulo" />
                        </div>

                        <div className="grid  w-[300px] m-auto">
                            <label>Prazo em dias:</label>
                            <input className="border h-10 rounded-md"
                                onChange={handleChange} id="diasEmAberto" onKeyDown={definirTeclasPermitidas} type="number" inputMode="numeric" pattern="[0-9]*" value={values.diasEmAberto} />
                        </div>

                        <div className="grid  w-[300px] m-auto">
                            <label>Salario:</label>
                            <input className="border h-10"
                                value={values.salario} onChange={handleChange} id="salario" type="text" placeholder="Salario" onKeyDown={definirTeclasPermitidas} />
                        </div>

                        <div className="grid  w-[300px] m-auto">
                            <label>Modelo:</label>
                            <select id="modelo" onChange={handleChange} value={values.modelo} className="border h-10 rounded-md">
                                <option>PRESENCIAL</option>
                                <option>HIBRIDO</option>
                                <option>REMOTO</option>
                            </select>
                        </div>


                        <div className="grid  w-[300px] m-auto">
                            <label>Nível exigido:</label>
                            <select id="nivel" onChange={handleChange} value={values.nivel} className="border h-10 rounded-md">
                                <option >JUNIOR</option>
                                <option >PLENO</option>
                                <option >SENIOR</option>
                                <option >INDEFINIDO</option>
                            </select>
                        </div>


                        <div className="grid  w-[300px] m-auto">
                            <label>Tipo de contrato:</label>
                            <select id="tipoContrato" onChange={handleChange} value={values.tipoContrato} className="border h-10 rounded-md">
                                <option >CLT</option>
                                <option >PJ</option>
                                <option >ESTAGIO</option>
                                <option >TEMPORARIO</option>
                            </select>
                        </div>
                        <div className="grid  w-[300px] m-auto">
                            <label>Estado:</label>
                            <select id="idEstado" onChange={handleChange} value={values.idEstado} className="border h-10 rounded-md">
                                {renderizarOptionEstados()}
                            </select>
                        </div>

                        <div className="grid  w-[300px] m-auto">
                            <label>Cidade:</label>
                            <select id="idCidade" onChange={handleChange} value={values.idCidade} className="border h-10 rounded-md">
                                {renderizarOptionsCidade()}
                            </select>
                        </div>

                        <div className="grid  w-[300px] m-auto">
                            <label>Exclusividade de sexo:</label>
                            <select id="ExclusivoParaSexo" onChange={handleChange} className="border h-10 rounded-md"
                                value={values.exclusivoParaSexo}>
                                <option value="TODOS" >Todos</option>
                                <option value="MASCULINO">Masculino</option>
                                <option value="FEMININO">Feminino</option>
                            </select>
                        </div>

                        <div className="grid  w-[300px] m-auto">
                            <label>Excluiva para PCD?:</label>
                            <select id="ExclusivoParaPcd" onChange={handleChange} value={values.exclusivoParaPcd + ''} className="border h-10 rounded-md">
                                <option value="true">SIM</option>
                                <option value="false">NÃO</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid mt-10 gap-y-7 px-3">

                        <div className="grid">
                            <label>Adicione uma introdução para a  descrição:</label>
                            <textarea className="h-40 rounded-lg" id="descricao" placeholder="Introdução" onChange={handleChange} value={values.descricao} />
                        </div>


                        <div className="grid ">
                            <label>Descreva as pricipais atividades:</label>
                            <textarea className="h-40 rounded-lg" id="principais_atividades" placeholder="Principais atividades" onChange={handleChange} value={values.principais_atividades} />
                        </div>

                        <div className="grid ">
                            <label>Requisitos da vaga:</label>
                            <textarea className="h-40 rounded-lg" id="requisitos" placeholder="Reuisitos" onChange={handleChange} value={values.requisitos} />
                        </div>

                        <div className="grid ">
                            <label>Diferenciais para a vaga:</label>
                            <textarea className="h-40 rounded-lg" id="diferenciais" placeholder="Diferenciais" onChange={handleChange} value={values.diferenciais} />
                        </div>

                        <div className="grid ">
                            <label>Fale sobre o local de trabalho:</label>
                            <textarea className="h-40 rounded-lg" id="local_de_trabalho" placeholder="Local de trabalho" onChange={handleChange} value={values.local_de_trabalho} />
                        </div>


                        <div className="grid ">
                            <label>Informações sobre horario e escala:</label>
                            <textarea className="h-40 rounded-lg" id="horario" placeholder="Horário" onChange={handleChange} value={values.horario} />
                        </div>

                        <div className="grid ">
                            <label>Mensagem padrão:</label>
                            <textarea className="h-40 rounded-lg" id="mensagemConvocacao" placeholder="Mensagem recebida pelo usuário ao ser avaliado" onChange={handleChange} value={values.mensagemConvocacao} />
                        </div>

                        <div className="grid ">
                            <label>Mensagem padrão:</label>
                            <textarea className="h-40 rounded-lg" id="mensagemDispensa" placeholder="Mensagem recebida pelo usuário ao ser avaliado" onChange={handleChange} value={values.mensagemDispensa} />
                        </div>
                    </div>
                    <div className="flex justify-center mt-8">
                        <input type="submit" value="Enviar" className="bg-gray-950 text-white h-10 w-56 rounded-md cursor-pointer" />
                    </div>
                </form>
            </div>
        )
    }
}