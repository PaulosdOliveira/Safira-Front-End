'use client'

interface qualificacaoSelecionadaProps {
    nomeQualificacao: string;
    idQualificacao: number;
    nivel: string;
    click: (event: any) => void;
}


export const Instrucao = () => {
    return (
        <div className="instrucao  flex items-center pl-3 pt-1 text-[.8em] font-semibold">
            <div className=" h-2 w-2 rounded-full bg-green-400 mr-1" />
            <span>Básico</span>
            <div className=" h-2 w-2 rounded-full bg-yellow-400 mr-1 ml-4 " />
            <span>Intermediario</span>
            <div className=" h-2 w-2 rounded-full bg-red-500 mr-1 ml-4" />
            <span>Avançado</span>
        </div>
    )
}

export const QualificacaoSelecionada: React.FC<qualificacaoSelecionadaProps> = ({ click, idQualificacao, nivel, nomeQualificacao }) => {
    let cor = 'border-green-700';
    if (nivel == 'AVANCADO') cor = 'border-red-700';
    else if (nivel == 'INTERMEDIARIO') cor = 'border-yellow-400';

    return (

        <div className={` h-8   border ${cor} flex items-center gap-1  rounded-full mx-3 pl-2 min-w-10 bg-white`} >
           <span>{nomeQualificacao}</span> 
        
            <i onClick={() => click(idQualificacao)}
                className={`material-symbols cursor-pointer  scale-90 ${cor}`}>close</i>
        </div>


    )
}