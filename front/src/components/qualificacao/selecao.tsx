'use client'

interface qualificacaoSelecionadaProps {
    nomeQualificacao: string;
    idQualificacao: number;
    nivel: string;
    click: (event: any) => void;
}


export const QualificacaoSelecionada: React.FC<qualificacaoSelecionadaProps> = ({ click, idQualificacao, nivel, nomeQualificacao }) => {
    let cor = 'text-green-600';
    if (nivel == 'AVANCADO') cor = 'text-red-500';
    else if (nivel == 'INTERMEDIARIO') cor = 'text-yellow-500';

    return (
        <div className="flex items-center" title={nivel}>
            <div className="border border-gray-200 flex bg-white  rounded-full  text-center mx-3 pl-2 min-w-10  text-nowrap" >
                {nomeQualificacao}
                <div onClick={() => click(idQualificacao)}
                    className={`material-symbols cursor-pointer  border scale-50 ${cor}`}>close</div>
            </div>

        </div>
    )
}