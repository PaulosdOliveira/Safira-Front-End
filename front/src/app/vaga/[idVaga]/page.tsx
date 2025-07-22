'use client'

import { ServicoSessao } from "@/resources/sessao/sessao";
import { dadosVaga } from "@/resources/vaga_emprego/DadosVaga";
import { VagaService } from "@/resources/vaga_emprego/service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VagaPage() {

    const idVaga = useParams().idVaga;
    const service = VagaService();
    const [vaga, setVaga] = useState<dadosVaga | null>(null);


    useEffect(() => {
        (async () => {
            const vaga: dadosVaga = await service
                .carregarVaga(idVaga + '', ServicoSessao().getSessao()?.accessToken + '');
            if (vaga.descricao) setVaga(vaga);
        })()
    }, [])

    if (vaga == null) return <h1 className="text-black text-center">Vaga não encontrada</h1>;
    return <Vaga vaga={vaga} />;
}



interface vagaProps {
    vaga?: dadosVaga;
}

const Vaga: React.FC<vagaProps> = ({ vaga }) => {

    const idVaga = useParams().idVaga;
    const service = VagaService();
    const urlFotoEmpresa = "http://localhost:8080/empresa/foto/" + vaga?.id_empresa;
    const [candidatou, setCandidatou] = useState<boolean>();


    useEffect(() => {
        if (vaga) setCandidatou(vaga.jaCandidatou);
    }, [])

    const ifNotEmpt = (texto: any) => texto ? texto : "#";

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
        <div className=" w-[100vw] h-[100vh] bg-gray-50">
            <div className="border border-gray-400 w-[50%] m-auto mt-5 p-3 rounded-lg shadow-2xl shadow-gray-700">

                <div className="flex items-center">
                    <div style={{ backgroundImage: `url(${urlFotoEmpresa})` }}
                        className="w-28 h-28 border rounded-full bg-contain "></div>
                    <h1 className="text-black pl-2 ">{vaga?.nome_empresa}</h1>
                </div>
                <h1 className="text-black text-3xl font-bold">{vaga?.titulo}</h1>

                <section className=" grid grid-cols-2 p-3"
                    id="detalhes_vaga">
                    <div>
                        <i className="material-symbols">Distance</i>
                        <h1 className="text-black inline-block">{`${vaga?.cidade}, ${vaga?.estado}`}</h1>
                    </div>

                    <div>
                        <i className="material-symbols">home_work</i>
                        <h1 className="text-black inline-block">{vaga?.modelo}</h1>
                    </div>

                    <div>
                        <i className="material-symbols">Contract</i>
                        <h1 className="text-black inline-block">{vaga?.tipoContrato}</h1>

                    </div>

                    <div>
                        <i className="material-symbols">work_history</i>
                        <h1 className="text-black inline-block">{vaga?.nivel}</h1>
                    </div>

                    <div className="hidden">
                        <i className="material-symbols">person</i>
                        <h1 className="text-black inline-block">{vaga?.id_empresa}</h1>
                    </div>

                    <div>
                        <i className="material-symbols">Attach_money</i>
                        <h1 className="text-black inline-block">{vaga?.salario == 0 ? "A combinar" : vaga?.salario}</h1>
                    </div>

                </section>
                <div>
                    <h1 className="text-2xl">Descrição</h1>
                    <h2 className="text-black inline-block">{ifNotEmpt(vaga?.descricao[0])}</h2>
                    <h1 className="text-2xl">Principais atividades</h1>
                    <h2 className="text-black inline-block">{ifNotEmpt(vaga?.descricao[1])}</h2>
                    <h1 className="text-2xl">Requisitos</h1>
                    <h2 className="text-black inline-block">{ifNotEmpt(vaga?.descricao[2])}</h2>
                    <h1 className="text-2xl">Diferenciais</h1>
                    <h2 className="text-black inline-block">{ifNotEmpt(vaga?.descricao[3])}</h2>
                    <h1 className="text-2xl">Local de trabalho</h1>
                    <h2 className="text-black inline-block">{ifNotEmpt(vaga?.descricao[4])}</h2>
                    <h1 className="text-2xl">Horario</h1>
                    <h2 className="text-black inline-block">{ifNotEmpt(vaga?.descricao[5])}</h2>
                </div>
                <div className=" flex flex-col items-center mt-10 ">
                    <button onClick={candidatar}
                        className="border border-gray-400 p-2 rounded-lg shadow shadow-black cursor-pointer">
                        {!candidatou ? "Candidatar-se" : "Cancelar candidatura"}
                    </button>
                </div>
            </div>
        </div>
    )
}