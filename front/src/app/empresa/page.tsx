'use client'


import { SelectEstadoCidade } from "@/components/Select"
import { ConsultaCandidatoDTO, dadosConsultaCandidato, initConsultaCandidato } from "@/resources/candidato/candidatoResource"
import { CandidatoService } from "@/resources/candidato/servico"
import { ServicoSessao } from "@/resources/sessao/sessao"
import { cidade, UtilsService } from "@/resources/utils/utils"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { Qualificacao, qualificacaoSelecionada, qualificacaoUsuario } from "@/resources/qualificacao/qualificacaoResource"
import { QualificacaoService } from "@/resources/qualificacao/qualificacaoService"
import { CardUsuario } from "@/components/cadUsuario"
import { useRouter } from "next/navigation"
import { Menu } from "@/components/header"
import { QualificacaoSelecionada } from "@/components/perfilCandidato/selecao"
import AsyncSelect from "react-select/async"
import { OptionFormacaoDTO } from "@/resources/formacao/formacaoResource"
import { FormacaoService } from "@/resources/formacao/fiormacaoService"
import { Loading } from "@/components/load/loadingPage"



export default function MainEmpresa() {
    const [nivel, setNivel] = useState<string>("INTERMEDIARIO");
    const [qualificacoesSelecionadas, setQualificacoesSelecionadas] = useState<qualificacaoSelecionada[]>([]);
    const [cidades, setCidades] = useState<cidade[]>([]);
    const sessao = ServicoSessao();
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
        <div className="w-full h-fit border bg-gray-200 ">
            <header className="w-full flex items-end pb-2 bg-white  border border-gray-400 ">
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
                            <div className="inline-block  mx-2">
                                <label>Nivel:</label>
                                <br />
                                <select className="border border-gray-200 rounded-sm p-0.5 h-9"
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
                <div className="w-[20%]">
                    <Menu />
                </div>
            </header>
            <section className="mt-1 flex overflow-auto  p-1 pb-4"
                id="filtros-selecionados">
                {renderizarQualificacoesSelecionadas()}
            </section>
            <div className="">
                <i onClick={() => setMaisFiltros(!maisFiltros)} className="material-symbols cursor-pointer">tune</i>
            </div>
            <main className="w-full flex  relative">
                <div id="mais-filtros" className={` w-[240px] px-2  flex-col items-center lg:relative lg:top-0 absolute  -top-2 -left-1.5
                     ${!maisFiltros ? '-translate-x-[250px]' : '-translate-x-0'} transition duration-700 z-10`}>
                    <div id="filtros"
                        className=" rounded-lg flex flex-col  p-3 mt-3 bg-white border border-gray-400">
                        <h2 className="text-black text-2xl font-thin">Mais filtros</h2>
                        <div className="inline-block">
                            <label className="font-bold">Sexo:</label>
                            <br />
                            <div className="text-[.8em] flex  items-center gap-x-1">
                                <select className="border border-gray-400 h-6"
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
                                <select className="border border-gray-400 h-6 mt-1"
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
                                <select className="border border-gray-400 h-6"
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
                <section className="flex pt-2 w-[400px] sm:w-[630px]  px-3 md:w-[780px] lg:w-[85vw] min-h-[100vh] max-h-fit  m-auto gap-5 lg:flex flex-wrap justify-center content-start">
                    {renderizarCardsUsuario()}
                </section>
            </main>
        </div >
    )
}


