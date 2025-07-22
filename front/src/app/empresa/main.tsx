'use client'

import { SelectEstadoCidade } from "@/components/Select"
import { ConsultaCandidatoDTO, dadosConsultaCandidato, initConsultaCandidato } from "@/resources/candidato/candidatoResource"
import { CandidatoService } from "@/resources/candidato/servico"
import { ServicoSessao } from "@/resources/sessao/sessao"
import { cidade, UtilsService } from "@/resources/utils/utils"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { qualificacaoSelecionadaProps } from "../candidato/cadastro/page"
import { Qualificacao, qualificacaoSelecionada, qualificacaoUsuario } from "@/resources/qualificacao/qualificacaoResource"
import { QualificacaoService } from "@/resources/qualificacao/qualificacaoService"
import { OptionQualificacao } from "@/components/qualificacao/optionQualificacao"
import { QualificacaoSelecionada } from "@/components/qualificacao/selecao"
import { CardUsuario } from "@/components/cadUsuario"



export const MainEmpresa = () => {

    const [qualificacoes, setQualificacoes] = useState<Qualificacao[]>([]);
    const [qualificacaoAtual, setQualificacaoAtual] = useState<Qualificacao | null>(null);
    const [nivel, setNivel] = useState<string>("INTERMEDIARIO");
    const [qualificacoesSelecionadas, setQualificacoesSelecionadas] = useState<qualificacaoSelecionada[]>([]);
    const [cidades, setCidades] = useState<cidade[]>([]);
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
        const atual: Qualificacao = {
            id: parseInt(`${select.item(select.selectedIndex)?.value}`),
            nome: `${select.item(select.selectedIndex)?.text}`
        }
        setQualificacaoAtual(atual);

        const option = select.item(select.selectedIndex);
        if (option?.text) {
            const selecionada: qualificacaoSelecionada = {
                idQualificacao: parseInt(`${option.value}`),
                nivel: `${nivel}`,
                nome: `${option.text}`
            }
            setQualificacoesSelecionadas(pre => [...pre, selecionada]);
            setQualificacoes(prev => prev.filter(item => item.nome !== option.text))
            setQualificacaoAtual(null)
        }

    }




    // CORRIGIR DEPOIS ***********************************************************************************
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
        const token = ServicoSessao().getSessao()?.accessToken;
        if (token) {
            const resultado = await CandidatoService().buscarCandidatosPorQualificacoes(values, token);
            if (resultado.length)
                setCandidatos(resultado)
            else setCandidatos([])
        }
    }

    function gerarCardUsuario(candidato: ConsultaCandidatoDTO) {
        return <CardUsuario nome={`${candidato.nome}`} key={candidato.id} id={candidato.id} />
    }

    function renderizarCardsUsuario() {
        return candidatos?.map(gerarCardUsuario);
    }

    function excuirQualificacaoSelecionada(dadosQualificacao: string) {
        // [0] = id da qualificação; [1] = nome da qualificação;
        const dadosDividos = dadosQualificacao.split(" ");
        setQualificacoesSelecionadas(prev => (prev.filter(item => item.idQualificacao.toString() !== dadosDividos[0])))
        setQualificacoes(pre => [...pre, { id: parseInt(dadosDividos[0]), nome: dadosDividos[1] }])

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
        <div className="w-[100vw] h-[100vh] bg-gray-200 pt-2">
            <div className=" w-[100%] flex items-end  border bg-white">


                <div className="">
                    <h2>Localidade</h2>
                    <SelectEstadoCidade cidades={cidades} changeCidade={handleChange} changeEstado={(event) => selecionarEstado(event.target)} />
                </div>

                <div>
                    <h2>Filtro de qualificação</h2>
                    <div className="flex  rounded-lg p-2">

                        <div className="inline-block">
                            <label className="mr-2">Qualificação:</label>
                            <br />
                            <select onChange={(event) => changeQualificacao(event.target)}
                                id="qualificacao">
                                <option value={""}></option>
                                {renderizarOptionQualificacao()}
                            </select>
                        </div>

                        <div className="inline-block">
                            <label>Nivel:</label>
                            <br />
                            <select id="nivel" onChange={(event) => setNivel(event.target.value)} value={nivel}>
                                <option value="BASICO">Basico</option>
                                <option value="INTERMEDIARIO">Intermediário</option>
                                <option value="AVANCADO">Avançado</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button onClick={submit} className="border border-gray-300 rounded-sm bg-white p-1 cursor-pointer">Buscar</button>
                <hr className="mx-20" />
            </div>
            <section className="mt-1 flex overflow-auto px-3 pr-7"
                id="filtros-selecionados">
                {renderizarQualificacoesSelecionadas()}
            </section>

            <section className="grid grid-cols-3">
                {renderizarCardsUsuario()}

            </section>

        </div >
    )
}


