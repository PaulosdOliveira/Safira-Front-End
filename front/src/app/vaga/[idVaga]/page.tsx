'use client'

import { ServicoSessao, Sessao } from "@/resources/sessao/sessao";
import { dadosVaga } from "@/resources/vaga_emprego/DadosVaga";
import { VagaService } from "@/resources/vaga_emprego/service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VagaPage() {

    const idVaga = useParams().idVaga;
    const service = VagaService();
    const sessao = ServicoSessao();
    const [vaga, setVaga] = useState<dadosVaga | null>(null);


    useEffect(() => {
        (async () => {
            const vaga: dadosVaga = await service
                .carregarVaga(idVaga + '', sessao.getSessao()?.accessToken + '');
            if (vaga.descricao) setVaga(vaga);
        })()
    }, [])

    if (vaga == null) return <h1 className="text-black text-center">Vaga não encontrada</h1>;
    return <Vaga vaga={vaga} />;
}



export interface vagaProps {
    vaga?: dadosVaga;
}

export const Vaga: React.FC<vagaProps> = ({ vaga }) => {

    const idVaga = useParams().idVaga;
    const service = VagaService();
    const urlFotoEmpresa = "http://localhost:8080/empresa/foto/" + vaga?.id_empresa;
    const [candidatou, setCandidatou] = useState<boolean>();
    const sessao = ServicoSessao();


    useEffect(() => {
        if (vaga) setCandidatou(vaga.jaCandidatou);
    }, [])


    async function candidatar() {
        const token = ServicoSessao().getSessao()?.accessToken + '';
        if (!candidatou) {
            const status = await service.candidatar_a_vaga(token, idVaga + '');
            if (status !== 201) alert("Erro ao se cadastrar");
            else {
                alert("Cadastro realizado com sucesso");
                setCandidatou(!candidatou)
            }
        }
        else {
            await service.cancelar_candidatura(token, idVaga + '');
            setCandidatou(!candidatou)
        }

    }

    return (
        <div className=" w-full h-[100vh]">
            <div className=" sm:w-[600px]  border border-gray-500 w-[350px]  m-auto mt-5 p-3 rounded-lg bg-white">
                <h1 className="text-black  font-bold text-center">{vaga?.titulo}</h1>
                <div className="flex items-center my-2">
                    <div style={{ backgroundImage: `url(${urlFotoEmpresa})` }}
                        className="w-20 h-20 border rounded-full bg-contain "></div>
                    <h3 className="text-black pl-2 ">{vaga?.nome_empresa}</h3>
                </div>
                <section className=" grid grid-cols-2 p-3"
                    id="detalhes_vaga">
                    <div className="flex">
                        <i className="material-symbols">Distance</i>
                        <p className="text-black inline-block">{`${vaga?.cidade}, ${vaga?.estado}`}</p>
                    </div>

                    <div className="flex">
                        <i className="material-symbols">home_work</i>
                        <p className="text-black inline-block">{vaga?.modelo}</p>
                    </div>

                    <div className="flex">
                        <i className="material-symbols">Contract</i>
                        <p className="text-black inline-block">{vaga?.tipoContrato}</p>

                    </div>

                    <div className="flex">
                        <i className="material-symbols">work_history</i>
                        <p className="text-black inline-block">{vaga?.nivel}</p>
                    </div>

                    <div className={`flex ${vaga?.exclusivoParaPcd? '' : 'hidden'}`}>
                        <i className="material-symbols">person</i>
                        <p className="text-black inline-block">Exclusiva para PCD</p>
                    </div>
                    <div className={`flex ${vaga?.exclusivoParaSexo !== "TODOS"? '' : 'hidden'}`}>
                        <i className="material-symbols">person</i>
                        <p className="text-black inline-block">Exclusiva para sexo {vaga?.exclusivoParaSexo}</p>
                    </div>

                    <div className="flex">
                        <i className="material-symbols">Attach_money</i>
                        <p className="text-black inline-block">{vaga?.salario == 0 ? "A combinar" : vaga?.salario}</p>
                    </div>

                </section>
                <div>
                    <p className="text-2xl">Descrição</p>
                    <p className="text-black inline-block">{vaga?.descricao}</p>
                    <p className="text-2xl">Principais atividades</p>
                    <p className="text-black inline-block">{vaga?.principais_atividades}</p>
                    <p className="text-2xl">Requisitos</p>
                    <p className="text-black inline-block">{vaga?.requisitos}</p>
                    <p className="text-2xl">Diferenciais</p>
                    <p className="text-black inline-block">{vaga?.diferenciais}</p>
                    <p className="text-2xl">Local de trabalho</p>
                    <p className="text-black inline-block">{vaga?.local_de_trabalho}</p>
                    <p className="text-2xl">Horario</p>
                    <p className="text-black inline-block">{vaga?.horario}</p>
                </div>

                {sessao.getSessao()?.perfil === "candidato" && (
                    <div className=" flex flex-col items-center mt-10 ">
                        <button onClick={candidatar}
                            className="border border-gray-400 p-2 rounded-lg shadow shadow-black cursor-pointer">
                            {!candidatou ? "Candidatar-se" : "Cancelar candidatura"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}