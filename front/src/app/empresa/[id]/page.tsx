'use client'

import { Option } from "@/app/candidato/page";
import VagaPage, { DadosVaga } from "@/app/vaga/[idVaga]/page";
import { dadosCadastroVaga } from "@/app/vaga/cadastro/formSchema";
import { CardUsuario } from "@/components/cadUsuario";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CardRascunho, GerenciadorDeRascunhos } from "@/components/rascunho";
import { CandidatoCadastrado, PerfilCandidato } from "@/resources/candidato/candidatoResource";
import { CandidatoService } from "@/resources/candidato/servico";
import { perfilEmpresa } from "@/resources/empresa/model";
import { CadastroModeloDeProposta, ModeloDeProposta } from "@/resources/empresa/rascunho/rascunhoResource";
import { ServicoEmpresa } from "@/resources/empresa/sevico"
import { CadastroMensagemDTO } from "@/resources/mensagem/mensagemResource";
import { ServicoSessao } from "@/resources/sessao/sessao";
import { cidade, estado, UtilsService } from "@/resources/utils/utils";
import { dadosVaga, PageVagaEmprego } from "@/resources/vaga_emprego/DadosVaga";
import { VagaService } from "@/resources/vaga_emprego/service";
import { Client } from "@stomp/stompjs";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";


export default function PerfilEmpresa() {
    const id = useParams().id;
    const router = useRouter();
    const service = ServicoEmpresa();
    const vagaService = VagaService();
    const sessao = ServicoSessao();
    const [perfil, setPerfil] = useState<perfilEmpresa>();
    // VAGAS DA EMPRESA
    const [vagas, setVagas] = useState<PageVagaEmprego[]>([]);
    // TAMNHO DE ELEMENTOS DA PAGINA ATUAL
    const [totalPages, setTotalPages] = useState(0);
    // USADO PARA ROLAR AO TOPO QUANDO NECESSÁRIO
    const divRef = useRef<HTMLDivElement | null>(null);
    const [rascunhos, setRascunhos] = useState<ModeloDeProposta[]>([]);
    const [candidatosVaga, setCandidatosVaga] = useState<CandidatoCadastrado[]>([]);
    const [indexListaCandidato, setIndexListaCandidato] = useState<number>();
    // PARA NAVEGAÇÃO NA ABA DE CANDIDATURAS
    const [statusCandidato, setStatusCandidato] = useState<string>("EM_ANALISE");
    const [idVagaSelecionada, setIdVagaSelecionada] = useState<string | null>(null);

    // VAGA SELECIONADA PARA VISUALIZAÇÃO
    const [vagaSelecionada, setVagaSelecionada] = useState<dadosVaga | null>(null);
    const [dadosCadastraisVaga, setDadosCadastraisVaga] = useState<dadosCadastroVaga | null>(null);
    const [aba, setAba] = useState<"vagas" | "rascunhos">("vagas");
    const [nav, setNav] = useState<string>("dados");
    // DADOS DO CANDIDATO PARA EXÍBIR NO MODAL
    const [dadosModalCandidato, setDadosModalCandidato] = useState<PerfilCandidato | null>(null);
    // DEFINE SE MODAL ESTÁ ABERTO OU NÃO
    const [modalIsOpen, setmodalOpen] = useState<boolean>(false);
    // URL PARA EXÍBIR CURRÍCULO DA CONDIDATO VISUALIZADO
    const [urlCurriculo, setUrlCurriculo] = useState("");
    const clientRef = useRef<Client | null>(null);
    const [popUpPropostaIsOpen, setPopUpPropostaIsOpen] = useState<boolean>(false);
    /* USADO PARA INDICAR SE O USUÁRIO DESEJA SELECIONAR UM CANDIDATO
    * CONSIDERA-SE QUE DESEJA DISPENSAR O MESMO CASO SEJA 'FALSE' ↓   */
    const [selecionar, setSelecionar] = useState<boolean>(true);


    // Execuutando efeitos ao carregar a página
    useEffect(() => {
        // Carregando perfil da empresa e suas vagas publicadas
        (async () => {
            const perfilEncontrado = await service.carregarPerfil(`${id}`);
            setPerfil(perfilEncontrado)
            const vagas = await vagaService.buscarVagasEmpresa(`${id}`, 0).then((result) => {
                setTotalPages(result.totalPages);
                return result.content;
            });
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
                setVagaSelecionada(dados);
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
    function vagaObjectToComponent(dados: PageVagaEmprego) {
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
        const curriculo = await CandidatoService().buscarCurriculo(dadosCandidato.id);
        setUrlCurriculo(curriculo?.size ? URL.createObjectURL(curriculo) : "");
        setIndexListaCandidato(indexListaCandidato);
    }

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
        setVagaSelecionada(null);
        setIdVagaSelecionada(null);
        setDadosCadastraisVaga(null)
    }


    function candidatoToCard(dados: CandidatoCadastrado, key: number) {
        if (statusCandidato === dados.status)
            return (
                <div className="flex flex-col gap-y-2 items-center" key={"1" + key}>
                    <CardUsuario load={false} cidade={dados.cidade} estado={dados.estado} id={dados.id} idade={dados.idade} key={dados.id} nome={dados.nome} />
                    {statusCandidato === "EM_ANALISE" && (
                        <div className="flex gap-x-2">
                            <button className="rounded-lg py-1 px-2 bg-black text-white" onClick={() => abrirModal(`${dados.id}`, key)} key={key}>Avaliar</button>

                        </div>
                    )}
                </div>
            )
    }

    const renderizarCardCandidato = () => { return candidatosVaga.map(candidatoToCard) }



    return (
        <>
            <div ref={divRef}
                className="min-h-screen max-h-fit w-full bg-gray-50">
                <Header />
                <main className="mb-5">
                    <section id="informacoes" className="" >
                        <div className="z-30 pb-3  flex flex-col  ">
                            <img id="capa" className=" h-48 w-[98%] rounded-2xl mt-2 m-auto z-0"
                                src={`http://localhost:8080/empresa/capa/${id}`} />

                            <div className="z-10 -mt-10 ml-5 flex items-end">
                                <div id="foto" className="border-2 border-white h-32 w-32  rounded-full   bg-no-repeat bg-contain "
                                    style={{ backgroundImage: `url(http://localhost:8080/empresa/foto/${id})` }} />
                                <h2 className="pl-2 pb-7">{perfil?.nome}</h2>
                            </div>
                        </div>
                        <pre className="text-wrap pl-9 font-[arial] text-justify px-2 text-[.9em] mb-6">{perfil?.descricao}</pre>
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
                                    <>
                                        <section className="flex flex-wrap justify-center w-full gap-x-3  p-2">
                                            {renderizarVagas()}
                                        </section>
                                        <div className="flex justify-center  w-full my-10">
                                            <ReactPaginate
                                                className="flex gap-3"
                                                pageClassName="border px-3 py-2 rounded cursor-pointer hover:bg-gray-800"
                                                pageCount={totalPages}
                                                previousLabel="arrow_left"
                                                nextLabel="arrow_right"
                                                nextClassName="material-symbols cursor-pointer"
                                                previousClassName="material-symbols cursor-pointer"
                                                activeClassName="bg-gray-800 text-white"
                                                onPageChange={async (index) => {
                                                    const vagasEncontradas = await vagaService.buscarVagasEmpresa(`${id}`, index.selected).then((result) => {
                                                        setTotalPages(result.totalPages);
                                                        return result.content;
                                                    });

                                                    setVagas(vagasEncontradas);
                                                    divRef.current?.scrollIntoView({
                                                        behavior: 'instant',
                                                        block: 'start'
                                                    })
                                                }
                                                }
                                            />
                                        </div>
                                    </>
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
                                        {vagaSelecionada?.id && (
                                            <div className="flex w-full">
                                                {nav === "dados" && (
                                                    <div className="w-full">
                                                        <DadosVaga vaga={vagaSelecionada} />
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
                                                            <div className="fixed inset-0  z-50 overflow-hidden font-[arial]">
                                                                <div className="inset-0 bg-black  absolute overflow-hidden opacity-50" />
                                                                <div style={{ transform: 'translate(-50%, -50%)' }} className="absolute bg-gray-200  top-[50%] left-[50%] w-[90%] min-h-[300px] flex flex-col justify-center sm:w-[460px] py-5 rounded-sm border-2">
                                                                    <div className=" text-right">
                                                                        <button onClick={fecharModal}
                                                                            className="material-symbols text-black cursor-pointer absolute font-extrabold -top-0 left-[92%] sm:left-[94.5%]" >
                                                                            close
                                                                        </button>
                                                                    </div>
                                                                    {urlCurriculo.trim().length ? (
                                                                        <iframe className="border m-auto mb-5 h-[500px] w-[100%]"
                                                                            src={urlCurriculo}
                                                                        />
                                                                    ) : (
                                                                        <div className="flex-1/2 flex items-center">
                                                                            <h4 className="text-center  mb-7 border-dashed border-y w-full">Candidato não possui currículo cadastrado</h4>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex flex-wrap gap-3 justify-center flex-0">
                                                                        <a href={`/candidato/${dadosModalCandidato?.id}`} target="_blank" className="rounded-lg p-2 bg-blue-700 border-2 border-black text-white">Ver perfil</a>
                                                                        <button onClick={() => { setPopUpPropostaIsOpen(true), setSelecionar(true) }} className="bg-gray-950 border-2  text-white p-2 rounded-lg">Selecionar</button>
                                                                        <button onClick={() => { setPopUpPropostaIsOpen(true), setSelecionar(false) }} className="p-2 rounded-lg  bg-red-700 text-white border-2 border-black">Dispensar</button>
                                                                    </div>
                                                                    <PopUp selecionar={selecionar} isOpen={popUpPropostaIsOpen} click={enviarMensagem} mensagemPadrao={selecionar ? vagaSelecionada.mensagemConvocacao : vagaSelecionada.mensagemDispensa} close={() => setPopUpPropostaIsOpen(false)} />
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
                <Footer />
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


// USADO PARA O ENVIO DE FEEDBACK AO CANDIDATO
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
            className={`border border-gray-800 h-80 p-5 absolute top-[50%] left-[50%] bg-white rounded-md ${isOpen ? '' : 'hidden'}`}>
            <span className="absolute text-2xl -top-[0%] left-[92%] z-30 cursor-pointer font-extrabold material-symbols" onClick={close}>close</span>
            <h3 className="text-center">{selecionar ? 'Selecionar candidato' : 'Dispensar candidato'}</h3>
            <label className="block mb-2" htmlFor="mensagem"><strong>Mensagem:</strong></label>
            <textarea id="mensagem" onChange={handleChange} value={values.mensagem} className="h-28 w-72 rounded-md border" /><br />
            <div className="flex justify-center pt-6">
                <button onClick={() => click(values.mensagem)} className="bg-gray-900 text-white w-28 p-1 rounded-sm">Enviar</button>
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

// CARD DE VAGAS PUBLICADAS NO PERFIL DA EMPRESA
const MiniCardVaga: React.FC<miniCardVagaProps> = ({ id, tempo_decorrido, titulo, click, candidaturas }) => {
    return (
        <div className="border-2 border-gray-900 bg-white w-[260px] rounded-lg p-2 cursor-pointer my-4 font-[arial]" onClick={click}>
            <div className="mt-2 pl-2">
                <span className="text-wrap h-fit  font-extrabold">{titulo} Vaga para testra um titulo muito grande</span>
                <span className="flex  gap-x-1 h-fit mt-2"><i className="material-symbols">acute</i>{tempo_decorrido}</span>
                <p className="h-fit font-bold">{candidaturas}</p>
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