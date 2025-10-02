'use client'


import { SelectEstadoCidade } from "@/components/Select"
import { ConsultaCandidatoDTO, dadosConsultaCandidato, initConsultaCandidato } from "@/resources/candidato/candidatoResource"
import { CandidatoService } from "@/resources/candidato/servico"
import { ServicoSessao } from "@/resources/sessao/sessao"
import { cidade, UtilsService } from "@/resources/utils/utils"
import { useFormik } from "formik"
import { useEffect, useRef, useState } from "react"
import { Qualificacao, qualificacaoSelecionada, qualificacaoUsuario } from "@/resources/qualificacao/qualificacaoResource"
import { QualificacaoService } from "@/resources/qualificacao/qualificacaoService"
import { CardUsuario } from "@/components/cadUsuario"
import { useRouter } from "next/navigation"
import { Header, Menu } from "@/components/header"
import { QualificacaoSelecionada } from "@/components/perfilCandidato/selecao"
import AsyncSelect from "react-select/async"
import { OptionFormacaoDTO } from "@/resources/formacao/formacaoResource"
import { FormacaoService } from "@/resources/formacao/fiormacaoService"
import { Loading } from "@/components/load/loadingPage"
import { Footer } from "@/components/footer"



export default function MainEmpresa() {
    const [nivel, setNivel] = useState<string>("INTERMEDIARIO");
    const [qualificacoesSelecionadas, setQualificacoesSelecionadas] = useState<qualificacaoSelecionada[]>([]);
    const [cidades, setCidades] = useState<cidade[]>([]);
    const sessao = ServicoSessao();
    // USADO PARA VOLTAR AO TOPO DA PÁGINA
    const divRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const [maisFiltros, setMaisFiltros] = useState<boolean>(false);
    const [candidatos, setCandidatos] = useState<ConsultaCandidatoDTO[]>([]);
    const { values, handleChange, setFieldValue } = useFormik<dadosConsultaCandidato>({
        initialValues: initConsultaCandidato,
        onSubmit: submit,
        enableReinitialize: true
    })
    const [buscando, setBuscando] = useState(false);

    // ---->>>>>>> CARANTINDO QUE A PÁGINA SÓ SERÁ RENDERIZADA APOS MONTAR TODOS OS COMPONENTES  <<<<<----------
    const [montado, setMontado] = useState(false);
    useEffect(() => {
        setMontado(true);
    }, [])
    if (!montado) return <Loading />;
    // ---->>>>>>> CARANTINDO QUE A PÁGINA SÓ SERÁ RENDERIZADA APOS MONTAR TODOS OS COMPONENTES  <<<--------------

    const loadOptions = async (inputValue: string) => {
        if (!inputValue.trim().length) return [];
        const result: Qualificacao[] = await QualificacaoService().buscarQualificacoes(inputValue);
        return result.map((q) => ({
            value: q.id,
            label: q.nome
        }))
    }

    const loadCursos = async (valor: string) => {
        if (!valor.trim().length) return [];
        const result: OptionFormacaoDTO[] = await FormacaoService().buscarFormacoes(valor, `${sessao.getSessao()?.accessToken}`);
        return result.map((f) => ({
            value: f.id,
            label: f.curso
        }))
    }


    // Ativada ao mudar o valor do select de  qualificações
    function changeQualificacao(nome: string, id: number) {
        const selecionada: qualificacaoSelecionada = {
            idQualificacao: id,
            nivel: nivel,
            nome: nome
        }
        if (!qualificacoesSelecionadas.some(
            (item) => item.idQualificacao === selecionada.idQualificacao
        )) {
            setQualificacoesSelecionadas(pre => [selecionada, ...pre]);
        }
    }



    async function selecionarEstado(estado: HTMLSelectElement) {
        values.idEstado = estado.value;
        values.idCidade = "";
        const cidades: cidade[] = await UtilsService().buscarCidadesdeEstado(parseInt(estado.value));
        setCidades(cidades.length ? cidades : []);
    }

    function mapearQualificacoesSelecionadas(qualificacao: qualificacaoSelecionada) {
        const qualificacaoUsuario: qualificacaoUsuario = {
            idQualificacao: parseInt(qualificacao.idQualificacao + ''),
            nivel: qualificacao.nivel, nome: qualificacao.nome
        }
        return qualificacaoUsuario;
    }

    async function submit() {
        divRef.current?.scrollIntoView({
            behavior: "smooth",
            block: 'start'
        })
        setBuscando(true)
        values.qualificacoes = qualificacoesSelecionadas.map(mapearQualificacoesSelecionadas);
        const token = sessao.getSessao()?.accessToken;
        if (token) {
            const resultado = await CandidatoService().buscarCandidatosPorQualificacoes(values, token);
            if (resultado.length)
                setCandidatos(resultado)
            else setCandidatos([])
        }
        setBuscando(false)
    }

    function gerarCardUsuario(candidato: ConsultaCandidatoDTO) {
        return <CardUsuario cidade={candidato.cidade} estado={candidato.estado}
            nome={`${candidato.nome}`} key={candidato.id} id={candidato.id} idade={candidato.idade}
            load={buscando} />
    }

    function renderizarCardsUsuario() {
        return candidatos?.map(gerarCardUsuario);
    }

    function excuirQualificacaoSelecionada(idQualificacao: number) {
        setQualificacoesSelecionadas(prev => (prev.filter(item => item.idQualificacao !== idQualificacao)))
    }

    // Mapeando lista de qualificações selecionadas em component JSX 
    function selecionadasToComponent(selecionada: qualificacaoSelecionada) {
        return <QualificacaoSelecionada click={excuirQualificacaoSelecionada}
            idQualificacao={selecionada.idQualificacao} nivel={selecionada.nivel}
            nomeQualificacao={selecionada.nome} key={selecionada.idQualificacao} />
    }

    function renderizarQualificacoesSelecionadas() {
        return qualificacoesSelecionadas.map(selecionadasToComponent);
    }


    return (
        <div ref={divRef} className="w-full min-h-screen border bg-gray-200 flex flex-col">
            <Header logado={true} />
            <div className="flex-1/2">
                <div className="w-full items-end pb-2 ">
                    <div id="filtro" className="text-[.8em] flex flex-wrap items-end  w-[80%]">
                        <div className="">
                            <div className="flex items-end rounded-lg p-2">
                                <div className="inline-block">
                                    <label className="mr-2">Qualificação:</label>
                                    <AsyncSelect className=""
                                        cacheOptions
                                        loadOptions={loadOptions}
                                        defaultOptions={[]}
                                        placeholder="Busque aqui"
                                        onChange={(item) => {
                                            changeQualificacao(item?.label!, item?.value!)
                                        }}
                                    />
                                </div>
                                <div className="  mx-2">
                                    <label>Nivel:</label>
                                    <br />
                                    <select className="bg-white border border-gray-400 rounded-sm p-0.5 h-9"
                                        id="nivel" onChange={(event) => setNivel(event.target.value)} value={nivel}>
                                        <option value="BASICO">Basico</option>
                                        <option value="INTERMEDIARIO">Intermediário</option>
                                        <option value="AVANCADO">Avançado</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end">
                            <SelectEstadoCidade cidades={cidades} changeCidade={handleChange} changeEstado={(event) => selecionarEstado(event.target)} />
                            <button onClick={submit} className="border mb-2.5 h-8  rounded-sm bg-blue-600 text-white  px-3 cursor-pointer ">Buscar</button>
                        </div>
                    </div>

                </div>
                <section className="mt-1 overflow-auto  p-1 pb-4"
                    id="filtros-selecionados">
                    {renderizarQualificacoesSelecionadas()}
                </section>
                <div className="pl-2">
                    <i onClick={() => setMaisFiltros(!maisFiltros)} className="material-symbols cursor-pointer">tune</i>
                </div>
                <main className="w-full flex  mb-20 relative">
                    <div id="mais-filtros" className={` w-[240px] px-2 shrink-0  flex-col items-center  lg:top-0 absolute  -top-2 -left-1.5
                     ${!maisFiltros ? '-translate-x-[250px]' : '-translate-x-0'} transition duration-700 z-10`}>
                        <div id="filtros"
                            className=" rounded-lg flex flex-col  p-3 mt-3 bg-white border border-gray-500 shadow-lg shadow-gray-400">
                            <h2 className="text-black text-2xl font-thin">Mais filtros</h2>
                            <div className="inline-block">
                                <label className="font-bold">Sexo:</label>
                                <br />
                                <div className="text-[.8em] flex  items-center gap-x-1">
                                    <select className="border border-gray-400 p-1 rounded-sm"
                                        id="sexo" onChange={handleChange} value={values.sexo}>
                                        <option value="">Todos</option>
                                        <option value="MASCULINO">Masculino</option>
                                        <option value="FEMININO">Feminino</option>
                                    </select>
                                </div>
                            </div>
                            <div className="inline-block ">
                                <label className="font-bold">Status:</label>
                                <br />
                                <div className="text-[.8em] flex items-center gap-x-1">
                                    <select className="border border-gray-400 p-1 rounded-sm mt-1"
                                        id="trabalhando" onChange={handleChange} value={`` + values.trabalhando}>
                                        <option value="">Todos</option>
                                        <option value="true">Empregado</option>
                                        <option value="false">Desempregado</option>
                                    </select>
                                </div>
                            </div>
                            <div className="inline-block ">
                                <label className="font-bold">PCD?:</label>
                                <br />
                                <div className="text-[.8em] flex items-center gap-x-1">
                                    <select className="border border-gray-400 p-1 rounded-sm"
                                        id="pcd" onChange={handleChange} value={`` + values.pcd}>
                                        <option value="">Todos</option>
                                        <option value="true">Sim</option>
                                        <option value="false">Não</option>
                                    </select>
                                </div>
                            </div>
                            <div className="inline-block mt-2">
                                <label className="font-bold ">Formação:</label>
                                <AsyncSelect
                                    cacheOptions
                                    isMulti
                                    loadOptions={loadCursos}
                                    defaultOptions={[]}
                                    placeholder="Busque aqui"
                                    onChange={(item) => {
                                        const selecionados = item ? item.map(f => f.label) : [];
                                        setFieldValue("formacoes", selecionados)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <section className="w-full flex pt-2 px-3 min-h-[80vh] max-h-fit gap-5 lg:flex flex-wrap justify-center content-start">
                        {renderizarCardsUsuario()}
                    </section>
                </main>
                {candidatos.length > 0 && (
                    <h3 onClick={submit} className="text-center cursor-pointer">Repetir consulta</h3>
                )}
            </div>
            <Footer />
        </div >
    )
}


