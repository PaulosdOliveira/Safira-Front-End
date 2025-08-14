'use client'

import { PerfilCandidato } from "@/resources/candidato/candidatoResource";
import { CandidatoService } from "@/resources/candidato/servico";
import { QualificacaoPerfil } from "@/resources/qualificacao/qualificacaoResource";
import { ServicoSessao } from "@/resources/sessao/sessao";
import { CandidaturaCandidato } from "@/resources/vaga_emprego/DadosVaga";
import { VagaService } from "@/resources/vaga_emprego/service";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";


export default function PagePerfilCandidato() {

    const id = useParams().id;
    const [perfil, setPerfil] = useState<PerfilCandidato | null>(null);
    const [aba, setAba] = useState<string>("informacoes");
    const [candidaturas, setCandidaturas] = useState<CandidaturaCandidato[]>([]);

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
    
        return (
            <Candidaturas key={key} candidatura={candidatura} />
        )
    }

    const renderizarCandidaturas = () => {
        return candidaturas.map(candidaturaToJSX);
    }

    if (perfil) {
        return (
            <main className="w-[100%] h-[100vh] bg-gray-020 p-5">
                <div className="flex items-center py-3">
                    <div style={{ backgroundImage: `url(http://localhost:8080/candidato/foto/${id})` }}
                        className="w-20 h-20 rounded-full bg-cover bg-no-repeat mr-4"></div>
                    <div className="">
                        <p className="text-[1.7em] font-semibold">{perfil?.nome}</p>
                        <span className="text-gray-700">{`${perfil?.idade} Anos / ${perfil.cidade} - ${perfil.estado}`}</span>
                    </div>
                </div>
                <hr />

                <span onClick={() => setAba("informacoes")} className={`mx-3 cursor-pointer ${aba === "informacoes" ? 'underline' : ''}`}>Informações</span>
                <span onClick={buscarCandidaturas} className={`mx-3 cursor-pointer ${aba === "candidaturas" ? 'underline' : ''}`}>Minhas candidaturas</span>
                {aba === "informacoes" && (
                    <>
                        <h3>Sobre mim</h3>
                        <pre className="font-[arial] text-wrap text-left w-80 ">{perfil?.descricao}</pre>
                        <h3>Contado</h3>
                        <div className="flex items-center ">
                            <i className="material-symbols scale-95">email</i>
                            <span className="font-semibold pl-1 mb-1">{`${perfil?.email}`}</span>
                        </div>

                        <div className="flex items-center">
                            <i className="material-symbols scale-95">call</i>
                            <span className="font-semibold pl-1 ">{`${perfil?.tel}`}</span>
                        </div>

                        {
                            perfil.qualificacoes?.length ? (
                                <div className=" items-center">
                                    <h4>Qualificações</h4>
                                    {renderizarQualificacoes()}
                                </div>
                            ) : (<h3>Usuário não possui qualificações cadastradas</h3>)}
                    </>
                )}
                {aba === "candidaturas" && (
                    renderizarCandidaturas()
                )
                }
            </main>
        )
    }
    return <h1 className="text-black text-center">Nenhum perfil encontrado</h1>
}



export const Qualificao: React.FC<QualificacaoPerfil> = ({ nome, nivel }) => {
    return (
        <div className="">
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
    return (
        <div className="border border-gray-300 shadow-md w-52 rounded-lg p-1 mt-4">
            <p>{candidatura.tituloVaga}</p>
            <p>{candidatura.nomeEmpresa}</p>
            <p>{candidatura.status}</p>
        </div>
    )
}