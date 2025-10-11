'use client'


import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ServicoSessao, Sessao } from "@/resources/sessao/sessao";
import { dadosVaga } from "@/resources/vaga_emprego/DadosVaga";
import { VagaService } from "@/resources/vaga_emprego/service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VagaPage() {

    const idVaga = useParams().idVaga;
    const service = VagaService();
    const sessao = ServicoSessao();
    const [vaga, setVaga] = useState<dadosVaga>();



    useEffect(() => {
        (async () => {
            const vaga: dadosVaga = await service
                .carregarVaga(idVaga + '', sessao.getSessao()?.accessToken + '');
            if (vaga.descricao) setVaga(vaga);
        })()
    }, [])





    return vaga ? (
        <div className=" w-full min-h-screen max-h-fit bg-gray-100 font-[arial]">
            <Header logado={true} />
            <div className="mt-20"/>
            <DadosVaga vaga={vaga} />
            <Footer />
        </div>
    ) : (
        <h1 className="text-black text-center">Vaga não encntrada</h1>
    )


}



export interface vagaProps {
    vaga: dadosVaga;
}

export const DadosVaga: React.FC<vagaProps> = ({ vaga }) => {
    const sessao = ServicoSessao();
    const service = VagaService();
    const [candidatou, setCandidatou] = useState<boolean>();


    useEffect(() => {
        if (vaga) setCandidatou(vaga.jaCandidatou);
    }, [])


    async function candidatar() {
        const token = ServicoSessao().getSessao()?.accessToken + '';
        if (!candidatou) {
            const status = await service.candidatar_a_vaga(token, vaga?.id + '');
            if (status !== 201) alert("Erro ao se cadastrar");
            else {
                alert("Cadastro realizado com sucesso");
                setCandidatou(!candidatou)
            }
        }
        else {
            await service.cancelar_candidatura(token, vaga?.id + '');
            setCandidatou(!candidatou)
        }

    }

    return vaga ? (
        <div className="m-auto  p-10 rounded-b-lg border border-gray-400 rounded-md bg-white w-[90vw]  sm:w-[500px] md:w-[600px] lg:w-[700px]  mb-36">
            <div className=" flex flex-col items-center">
                <h1 className="text-black font-bold sm:pl-12 pl-5">{vaga?.titulo}</h1>

                <section className=" flex flex-wrap gap-3 pt-2 sm:pl-12 pl-5"
                    id="detalhes_vaga">
                    <div className="flex items-center p-1 rounded-lg bg-gray-200 w-fit">
                        <i className="material-symbols">Domain</i>
                        <a href={`/empresa/${vaga.id_empresa}`} target="_blank" className="text-black inline-block hover:underline">{`${vaga?.nome_empresa}`}</a>
                    </div>
                    
                    <div className="flex p-1 rounded-lg bg-gray-200 w-fit">
                        <i className="material-symbols">Distance</i>
                        <p className="text-black inline-block">{`${vaga?.cidade}, ${vaga?.estado}`}</p>
                    </div>

                    <div className="flex gap-x-1 p-1 rounded-lg bg-gray-200 w-fit">
                        <i className="material-symbols">home_work</i>
                        <p className="text-black inline-block">{vaga?.modelo}</p>
                    </div>

                    <div className="flex p-1 rounded-lg bg-gray-200 w-fit">
                        <i className="material-symbols">Contract</i>
                        <p className="text-black inline-block">{vaga?.tipoContrato}</p>
                    </div>

                    <div className="flex p-1 gap-x-1 rounded-lg bg-gray-200 w-fit">
                        <i className="material-symbols">work_history</i>
                        <p className="text-black inline-block">{vaga?.nivel}</p>
                    </div>

                    <div className={`flex p-1 rounded-lg bg-gray-200 w-fit ${vaga?.exclusivoParaPcd ? '' : 'hidden'}`}>
                        <i className="material-symbols">person</i>
                        <p className="text-black inline-block">Exclusiva para PCD</p>
                    </div>
                    <div className={`flex p-1 rounded-lg bg-gray-200 w-fit ${vaga?.exclusivoParaSexo !== "TODOS" ? '' : 'hidden'}`}>
                        <i className="material-symbols">person</i>
                        <p className="text-black inline-block">Exclusiva para sexo {vaga?.exclusivoParaSexo}</p>
                    </div>

                    <div className="flex p-1 rounded-lg bg-gray-200 w-fit">
                        <i className="material-symbols">Attach_money</i>
                        <p className="text-black inline-block font-extrabold">{vaga?.salario == 0 ? "A combinar" : vaga?.salario}</p>
                    </div>

                </section>
                {/* DESCRIÇÕES DA VAGA */}
                <div className="flex flex-col gap-y-5 mt-5  ">
                    <div className="">
                        <h3 className="">Descrição</h3>
                        <pre className="text-black pl-1">{vaga?.descricao}</pre>
                    </div>
                    <div>
                        <h3 className="">Principais atividades</h3>
                        <pre className="text-black pl-1">{vaga?.principais_atividades}</pre>
                    </div>
                    <div>
                        <h3 className="">Requisitos</h3>
                        <pre className="text-black pl-1">{vaga?.requisitos}</pre>
                    </div>
                    <div>
                        <h3 className="">Diferenciais</h3>
                        <pre className="text-black pl-1">{vaga?.diferenciais}</pre>
                    </div>
                    <div>
                        <h3 className="">Local de trabalho</h3>
                        <pre className="text-black pl-1">{vaga?.local_de_trabalho}</pre>
                    </div>
                    <div>
                        <h3 className="">Horario</h3>
                        <pre className="text-black pl-1">{vaga?.horario}</pre>
                    </div>
                </div>

                {
                    sessao.getSessao()?.perfil === "candidato" && (
                        <div className=" flex flex-col items-center mt-10 ">
                            <button onClick={candidatar}
                                className="p-2 rounded-sm shadow-lg shadow-gray-800 bg-gray-800 text-white cursor-pointer">
                                {!candidatou ? "Candidatar-se" : "Cancelar candidatura"}
                            </button>
                        </div>
                    )
                }
            </div>
        </div>
    ) : (
        <h1>Vaga não encontrada</h1>
    )
}

