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
        <div className=" w-full min-h-screen max-h-fit bg-gray-100 font-[arial]">
            <Header logado={true} />
            <div className="m-auto mb-20  pb-10 rounded-b-lg ">

                <div className=" mb-10 relative sm:px-2">
                    {/*Capa da empresa */}
                    <img
                        className="mt-5 h-32 md:h-36 lg:h-40  w-full m-auto"
                        src={`https://static.vecteezy.com/system/resources/previews/023/308/046/non_2x/abstract-grey-metallic-overlap-on-dark-circle-mesh-pattern-blank-space-design-modern-luxury-futuristic-background-vector.jpg`}
                        alt="Capa do perfil da empresa"
                    />
                    {/*Foto da empresa */}
                    <div
                        className="border-2 border-gray-800 h-16 w-16 rounded-lg absolute sm:left-14 left-6 top-20 md:top-24 lg:top-28 bg-no-repeat bg-contain"
                        style={{ backgroundImage: `url(${urlFotoEmpresa})` }}
                    />
                    {/*Nome da empresa */}
                    <a
                        href={`http://localhost:3000/empresa/${vaga?.id_empresa}`}
                        target="_blank"
                        className="text-black sm:pl-12 pl-6 mt-8 block">{vaga?.nome_empresa}
                    </a>
                </div>
                <h1 className="text-black font-bold sm:pl-12 pl-5">{vaga?.titulo}</h1>

                <section className=" flex flex-wrap gap-3 pt-2 sm:pl-12 pl-5"
                    id="detalhes_vaga">
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
                {/* SOBRE A VAGA */}
                <div className="flex flex-col gap-y-5 mt-5 sm:pl-12 pl-5  w-[90vw]  sm:w-[500px]">
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

                {sessao.getSessao()?.perfil === "candidato" && (
                    <div className=" flex flex-col items-center mt-10 ">
                        <button onClick={candidatar}
                            className="p-2 rounded-sm shadow-lg shadow-gray-800 bg-gray-800 text-white cursor-pointer">
                            {!candidatou ? "Candidatar-se" : "Cancelar candidatura"}
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}