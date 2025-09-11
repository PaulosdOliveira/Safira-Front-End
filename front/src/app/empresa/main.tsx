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
import { Menu } from "@/components/menu"
import { QualificacaoSelecionada } from "@/components/perfilCandidato/selecao"
import AsyncSelect from "react-select/async"



export const MainEmpresa = () => {
    const [nivel, setNivel] = useState<string>("INTERMEDIARIO");
    const [qualificacoesSelecionadas, setQualificacoesSelecionadas] = useState<qualificacaoSelecionada[]>([]);
    const [cidades, setCidades] = useState<cidade[]>([]);
    const sessao = ServicoSessao();
    const router = useRouter();
    const [candidatos, setCandidatos] = useState<ConsultaCandidatoDTO[]>([]);
    const { values, handleSubmit, handleChange } = useFormik<dadosConsultaCandidato>({
        initialValues: initConsultaCandidato,
        onSubmit: submit
    })


    const loadOptions = async (inputValue: string) => {
        if (!inputValue.trim().length) return [];
        const result: Qualificacao[] = await QualificacaoService().buscarQualificacoes(inputValue);
        return result.map((q) => ({
            value: q.id,
            label: q.nome
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
            setQualificacoesSelecionadas(pre => [...pre, selecionada]);
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
        values.qualificacoes = qualificacoesSelecionadas.map(mapearQualificacoesSelecionadas);
        const token = sessao.getSessao()?.accessToken;
        if (token) {
            const resultado = await CandidatoService().buscarCandidatosPorQualificacoes(values, token);
            if (resultado.length)
                setCandidatos(resultado)
            else setCandidatos([])
        }
    }

    function gerarCardUsuario(candidato: ConsultaCandidatoDTO) {
        return <CardUsuario cidade={candidato.cidade} estado={candidato.estado}
            nome={`${candidato.nome}`} key={candidato.id} id={candidato.id} idade={candidato.idade} />
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
        <div className="w-[100vw] min-h-screen bg-white">
            <header className=" w-[100vw]  flex items-end pb-2 bg-white  border border-gray-100 shadow-2xl shadow-gray-200">
                <div id="filtro" className=" flex items-end  w-[80%]">
                    <div className="">
                        <SelectEstadoCidade cidades={cidades} changeCidade={handleChange} changeEstado={(event) => selecionarEstado(event.target)} />
                    </div>

                    <div className="">
                        <div className="flex items-end rounded-lg p-2">

                            <div className="inline-block">
                                <label className="mr-2">Qualificação:</label>
                                <AsyncSelect
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
                                <select id="nivel" onChange={(event) => setNivel(event.target.value)} value={nivel}>
                                    <option value="BASICO">Basico</option>
                                    <option value="INTERMEDIARIO">Intermediário</option>
                                    <option value="AVANCADO">Avançado</option>
                                </select>
                            </div>
                            <button onClick={submit} className="border border-gray-300 rounded-sm bg-blue-600 text-white  px-3 cursor-pointer">Buscar</button>
                        </div>
                    </div>
                </div>
                <div className="w-[20%]">
                    <Menu />
                </div>

            </header>
            <section className="mt-1 flex  items-center  p-1  h-14  w-[100vw] overflow-auto"
                id="filtros-selecionados">
                {renderizarQualificacoesSelecionadas()}
            </section>
            <main className="w-[100%] h-[79.2vh] bg-white flex mt-2">
                <div id="mais-filtros" className="hidden  lg:flex flex-col items-center">
                    <div id="filtros" className="rounded-lg flex flex-col p-3 mt-3">
                        <h2 className="text-black text-2xl font-thin">Mais filtros</h2>
                        <div className="inline-block">
                            <label className="font-bold">Sexo:</label>
                            <br />
                            <div className="text-[.8em] flex  items-center gap-x-1">
                                <label>Mas:</label>
                                <input value="MASCULINO" onChange={handleChange} className="scale-75 mt-0.5" id="sexo" name="sexo" type="radio" />
                                <label>Fem:</label>
                                <input value="FEMININO" onChange={handleChange} className="scale-75 mt-0.5" id="sexo" name="sexo" type="radio" />
                                <label>Todos:</label>
                                <input value="" onChange={handleChange} className="scale-75 mt-0.5" id="sexo" name="sexo" type="radio" />
                            </div>
                        </div>

                        <div className="inline-block ">
                            <label className="font-bold">Empregado:</label>
                            <br />
                            <div className="text-[.8em] flex items-center gap-x-1">
                                <label>Sim:</label>
                                <input onChange={handleChange} value="true" className="scale-75 mt-0.5" id="trabalhando" name="trabalhando" type="radio" />
                                <label>Não:</label>
                                <input onChange={handleChange} value="false" className="scale-75 mt-0.5" id="trabalhando" name="trabalhando" type="radio" />
                                <label>Todos:</label>
                                <input onChange={handleChange} value="" className="scale-75 mt-0.5" id="trabalhando" name="trabalhando" type="radio" />
                            </div>
                        </div>

                        <div className="inline-block ">
                            <label className="font-bold">PCD?:</label>
                            <br />
                            <div className="text-[.8em] flex items-center gap-x-1">
                                <label>Sim:</label>
                                <input onChange={handleChange} value={"true"} className="scale-75 mt-0.5" id="pcd" name="pcd" type="radio" />
                                <label>Não:</label>
                                <input onChange={handleChange} value={"false"} className="scale-75 mt-0.5" id="pcd" name="pcd" type="radio" />
                                <label>Todos:</label>
                                <input onChange={handleChange} value="" className="scale-75 mt-0.5" id="pcd" name="pcd" type="radio" />
                            </div>
                        </div>
                    </div>
                </div>
                <section className="pt-2 w-[500px] lg:w-[80vw] h-[100%] m-auto md:w-[700px] md:grid-cols-2 grid gap-x-5 lg:flex flex-wrap  justify-center overflow-auto">
                    {renderizarCardsUsuario()}
                </section>


            </main>

        </div >
    )
}


