'use client'

import { ConsultaCandidatoDTO } from "@/resources/candidato/candidatoResource";
import { ContatosProps } from "@/resources/mensagem/mensagemResource";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface cardProps extends ConsultaCandidatoDTO {
    load: boolean;
}
export const CardUsuario: React.FC<cardProps> = ({ nome, id, cidade, estado, idade, load }) => {


    return (
        < a href={`/candidato/${id}`} target="_blank"
            className={`border border-gray-300 bg-white rounded-lg shadow-md shadow-gray-400 cursor-pointer w-72 p-2 h-32 ${load ? 'animate-pulse' : ''}`}>
            <div className="flex items-center">
                <div style={{ backgroundImage: `url(http://localhost:8080/candidato/foto/${id})` }}
                    className="border border-gray-100 w-20 h-20 rounded-full bg-cover bg-no-repeat" />
                <div>
                    <p className="font-bold">{nome}</p>
                    <p className=" pl-1">{idade} Anos</p>
                </div>
            </div>
            <div className="flex pt-1">
                <i className="material-symbols scale-75 text-gray-700">location_on</i>
                <p className="text-gray-700">{cidade}/{estado}</p>
            </div>
        </a>
    )
}

export const CardContato: React.FC<ContatosProps> = ({ id, nome, ultimaMensagem, urlFoto, click, naoVizualizadas, load }) => {
    const router = useRouter();
    const [visualizou, setVisualizou] = useState<boolean>(naoVizualizadas! > 0);

    useEffect(() => {
        load!();
        setVisualizou(naoVizualizadas! < 1)
    }, [naoVizualizadas])

    function clicar() {
        naoVizualizadas = 0;
        click!();
        setVisualizou(true)
    }

    return (
        <div onClick={clicar} onLoad={() => alert("Apareceu")}
            className="border border-gray-200 hover:bg-gray-100 cursor-pointer">
            <div className="flex py-1">
                <div style={{ backgroundImage: `url(${urlFoto})` }}
                    className="border border-gray-200 w-14 h-14 md:w-14 md:h-14  sm:w-10 sm:h-10 rounded-full bg-cover" />
                <div className=" w-[70%] pl-1.5 flex flex-col justify-center">
                    <p className="md:text-[.9em] sm:text-[.8em] font-bold">{nome}</p>
                    <p className={`${visualizou ? '' : 'font-extrabold'} text-ellipsis overflow-hidden text-nowrap ml-1 md:text-[.9em] sm:text-[.8em] text-gray-900`}>{ultimaMensagem}</p>
                </div>
                <div className=" relative">
                    <span className={`rounded-full absolute text-blue-600 font-bold top-3 ${visualizou ? 'hidden' : ''}`}>{naoVizualizadas}</span>
                </div>
            </div>
        </div>
    )
}
