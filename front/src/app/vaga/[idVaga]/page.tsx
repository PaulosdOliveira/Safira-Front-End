'use client'

import { ServicoSessao } from "@/resources/sessao/sessao";
import { dadosVaga } from "@/resources/vaga_emprego/DadosVaga";
import { VagaService } from "@/resources/vaga_emprego/service";
import { assert } from "console";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VagaPage() {

    const idVaga = useParams().idVaga;
    const service = VagaService();
    const [vaga, setVaga] = useState<dadosVaga>();
    const urlFotoEmpresa = "http://localhost:8080/empresa/foto/" + vaga?.id_empresa;

    useEffect(() => {
        (async () => {
            const vaga: dadosVaga = await service
                .carregarVaga(idVaga + '', ServicoSessao().getSessao()?.accessToken + '');
            setVaga(vaga);
        })()

    }, [])




    async function candidatar() {
        const token = ServicoSessao().getSessao()?.accessToken + '';
        if (!vaga?.jaCandidatou) await service.candidatar_a_vaga(token, idVaga + '');
        else {
            await service.cancelar_candidatura(token, idVaga + '');
        }

        if (vaga) {
            setVaga({
                ...vaga,
                jaCandidatou: !vaga.jaCandidatou
            })
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
                    <h2 className="text-black inline-block">{vaga?.descricao[0]}</h2>
                    <h1 className="text-2xl">Principais atividades</h1>
                    <h2 className="text-black inline-block">{vaga?.descricao[1]}</h2>
                    <h1 className="text-2xl">Requisitos</h1>
                    <h2 className="text-black inline-block">{vaga?.descricao[2]}</h2>
                    <h1 className="text-2xl">Diferenciais</h1>
                    <h2 className="text-black inline-block">{vaga?.descricao[3]}</h2>
                    <h1 className="text-2xl">Local de trabalho</h1>
                    <h2 className="text-black inline-block">{vaga?.descricao[4]}</h2>
                    <h1 className="text-2xl">Horario</h1>
                    <h2 className="text-black inline-block">{vaga?.descricao[5]}</h2>
                </div>
                <div className=" flex flex-col items-center mt-10 ">
                    <button onClick={candidatar}
                        className="border border-gray-400 p-2 rounded-lg shadow shadow-black cursor-pointer">
                        {!vaga?.jaCandidatou ? "Candidatar-se" : "Cancelar candidatura"}
                    </button>
                </div>
            </div>

        </div>
    );

}