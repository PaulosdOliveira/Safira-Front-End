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
import { OptionQualificacao } from "@/components/qualificacao/optionQualificacao"
import { Instrucao, QualificacaoSelecionada } from "@/components/qualificacao/selecao"
import { CardUsuario } from "@/components/cadUsuario"
import { useRouter } from "next/navigation"
import { Menu } from "@/components/menu"



export const MainEmpresa = () => {

    const [qualificacoes, setQualificacoes] = useState<Qualificacao[]>([]);
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




    // Buscando qualificações no banco de dados
    useEffect(() => {
        (async () => {
            const qualificacoes: Qualificacao[] = await QualificacaoService().buscarQualificacoes();
            setQualificacoes(qualificacoes);
        })();
    }, [])


    // Criando <option>'s de qualificação 
    function gerarOptionQualificacao(qualificacao: Qualificacao) {
        const id = qualificacao.id;
        return (
            <OptionQualificacao key={id} id={id} nome={qualificacao.nome} />
        )
    }

    // Renderizando <option>'s de qualificação 
    function renderizarOptionQualificacao() {
        return (
            qualificacoes.map(gerarOptionQualificacao)
        );
    }

    // Ativada ao mudar o valor do select de  qualificações
    function changeQualificacao(select: HTMLSelectElement) {
        const option = select.item(select.selectedIndex);
        if (option?.text) {
            const selecionada: qualificacaoSelecionada = {
                idQualificacao: parseInt(`${option.value}`),
                nivel: `${nivel}`,
                nome: `${option.text}`
            }
            if (!qualificacoesSelecionadas.some(
                (item) => item.idQualificacao === selecionada.idQualificacao
            )) {
                setQualificacoesSelecionadas(pre => [...pre, selecionada]);
            }
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
            nivel: qualificacao.nivel
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
                                <br />
                                <select onChange={(event) => changeQualificacao(event.target)}
                                    id="qualificacao">
                                    <option value={""}></option>
                                    {renderizarOptionQualificacao()}
                                </select>
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
            <Instrucao />
            <section className="mt-1 flex items-center  p-1  h-14  w-[100vw] overflow-auto"
                id="filtros-selecionados">
                {renderizarQualificacoesSelecionadas()}
            </section>
            <main className="w-[100%] h-[79.2vh] bg-white flex mt-2">
                <div id="mais-filtros" className=" w-[20%]  pl-2 flex flex-col items-center">
                    <div id="filtros" className="border border-gray-300  rounded-lg flex flex-col p-3 mt-3">
                        <h2 className="text-black text-2xl font-thin">Mais filtros</h2>
                        <div className="inline-block">
                            <label>Sexo:</label>
                            <br />
                            <select id="sexo" className="w-40" onChange={handleChange}>
                                <option value="">Todos</option>
                                <option value="MASCULINO">Masculino</option>
                                <option value="FEMININO">Feminino</option>
                            </select>
                        </div>

                        <div className="inline-block ">
                            <label>Status?:</label>
                            <br />
                            <select id="trabalhando" className="w-40" onChange={handleChange}>
                                <option value={`${null}`}>Ambos</option>
                                <option value="true">Trabalhando</option>
                                <option value="false">Desempregado</option>
                            </select>
                        </div>

                        <div className="inline-block ">
                            <label>PCD?:</label>
                            <br />
                            <select id="pcd" className="w-40" onChange={handleChange}>
                                <option value="true">Sim</option>
                                <option value="false">Não</option>
                            </select>
                        </div>
                    </div>
                </div>
                <section className=" border w-[60%] h-[100%] m-auto grid grid-cols-2  justify-center overflow-auto">
                    {renderizarCardsUsuario()}
                </section>
                <span className="border w-[20%]">Direita</span>

            </main>

        </div >
    )
}


