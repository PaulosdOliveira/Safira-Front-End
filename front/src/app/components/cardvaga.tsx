export interface cardVagaProps {
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
}

export const CardVaga: React.FC<cardVagaProps> = ({ cidade, nome_empresa, estado, modelo, nivel, salario, tipo_contrato, titulo, exclusivo_pcd, sexo_exclusivo, periodo }) => {
    return (
        <div className="border border-gray-200 w-72  p-3 m-auto rounded-2xl bg-white shadow shadow-gray-300 cursor-pointer">
            <div>
                <i className="material-symbols">Domain</i>
                <h2 className=" min-h-10 inline-block">{nome_empresa}</h2>
            </div>

            <div>
                <i className="material-symbols">Enterprise</i>
                <h2 className="inline-block">{titulo}</h2>
            </div>

            <div>
                <i className="material-symbols">Distance</i>
                <h2 className="inline-block">{`${cidade},${estado}`}</h2>
            </div>

            <div>
                <i className="material-symbols">home_work</i>
                <h2 className="inline-block">{modelo}</h2>
            </div>

            <div>
                <i className="material-symbols">contract</i>
                <h2 className="inline-block ">{tipo_contrato}</h2>
            </div>


            <div>
                <i className="material-symbols">work_history</i>
                <h2 className="inline-block ">{nivel}</h2>
            </div>

            <div>
                <i className="material-symbols">attach_money</i>
                <h2 className="inline-block font-serif">{salario}</h2>
            </div>

            <div>
                <i className="material-symbols">acute</i>
                <h2 className="inline-block">{periodo}</h2>
            </div>

            {sexo_exclusivo && (
                <div>
                    <i className="material-symbols">boy</i>
                    <h2 className="inline-block ">{`Exclusiva para o sexo ${sexo_exclusivo}`}</h2>
                </div>
            )}


            {exclusivo_pcd && (
                <div>
                    <i className="material-symbols">boy</i>
                    <h2 className="inline-block">Exclusiva para PCD</h2>
                </div>
            )}

        </div>
    )
}
