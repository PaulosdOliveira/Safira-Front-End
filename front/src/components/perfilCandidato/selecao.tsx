'use client'

interface qualificacaoSelecionadaProps {
    nomeQualificacao: string;
    idQualificacao: number;
    nivel: string;
    click: (event: any) => void;
}



export const QualificacaoSelecionada: React.FC<qualificacaoSelecionadaProps> = ({ click, idQualificacao, nivel, nomeQualificacao }) => {
    let cor = 'text-green-700';
    if (nivel == 'AVANCADO') cor = 'text-red-700';
    else if (nivel == 'INTERMEDIARIO') cor = 'text-yellow-400';

    return (

        <div className={` h-8  border border-gray-500 text-nowrap text-[.8em] w-fit  flex items-center gap-1  rounded-full mx-3 pl-2  font-bold  bg-gray-50`} >
           <span className="">{nomeQualificacao} - {nivel}</span> 
            <i onClick={() => click(idQualificacao)}
                className={`material-symbols cursor-pointer  scale-50 text-gray-800`}>close</i>
        </div>


    )
}