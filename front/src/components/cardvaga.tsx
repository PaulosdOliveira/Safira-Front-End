export interface cardVagaProps {
    id: number;
    nome_empresa: string;
    titulo: string;
    cidade: string;
    estado: string;
    modelo: string;
    tipo_contrato: string;
    nivel: string;
    salario: number;
    sexo_exclusivo?: string;
    exclusivo_pcd: boolean;
    periodo: string;
    load: boolean;
}

export const CardVaga: React.FC<cardVagaProps> = ({ id, cidade, nome_empresa, estado, modelo, nivel, salario, tipo_contrato, titulo, exclusivo_pcd, sexo_exclusivo, periodo, load }) => {
    let icone_modelo = "Domain";
    if (modelo === "HIBRIDO") icone_modelo = "home_work";
    else if (modelo === "REMOTO") icone_modelo = "home";

    return (
        <a href={`/vaga/${id}`} target="_blank"
            className={`border vaga border-gray-400 w-80 min-h-[370px] max-h-fit p-3 rounded-md bg-white shadow-sm shadow-gray-500 cursor-pointer m-5 ${load ? 'animate-pulse' : ''}`}>
            <h2 className="pb-8 pt-4 text-center">{titulo}</h2>
            <div className="flex items-center gap-x-1 ">
                <i className="material-symbols w-fit ">Domain</i>
                <p className="text-nowrap w-fit pt-1">{nome_empresa}</p>
            </div>

            <hr className="text-gray-400 my-2" />
            <div className="flex gap-x-1">
                <i className="material-symbols ">Distance</i>
                <p className="inline-block ">{`${cidade},${estado}`}</p>
            </div>
            <hr className="text-gray-400 my-2" />
            <div className="flex gap-x-1">
                <i className="material-symbols ">{icone_modelo}</i>
                <p className="inline-block pt-0.5">{modelo}</p>
            </div>
            <hr className="text-gray-400 my-2" />
            <div className="flex gap-x-1">
                <i className="material-symbols ">contract</i>
                <p className="inline-block ">{tipo_contrato}</p>
            </div>
            <hr className="text-gray-400 my-2" />

            <div className="flex gap-x-1">
                <i className="material-symbols">work_history</i>
                <p className="inline-block ">{nivel}</p>
            </div>
            <hr className="text-gray-400 my-2" />
            <div className="flex">
                <i className="material-symbols">attach_money</i>
                <p className="inline-block font-extrabold">{salario}</p>
            </div>


            {!sexo_exclusivo && (
                <div>
                    <hr className="text-gray-400 my-2" />
                    <div className="flex">
                        <i className="material-symbols">boy</i>
                        <p className="inline-block ">{`Exclusiva para o sexo ${sexo_exclusivo}`}</p>
                    </div>
                </div>
            )}


            {!exclusivo_pcd && (
                <div>
                    <hr className="text-gray-400 my-2" />
                    <div className="flex">
                        <i className="material-symbols">boy</i>
                        <p className="inline-block">Exclusiva para PCD</p>
                    </div>
                </div>
            )}

            <hr className="text-gray-400 my-2" />
            <div className="flex gap-x-1">
                <i className="material-symbols">acute</i>
                <p className="inline-block font-bold">{periodo}</p>
            </div>
        </a>
    )
}
