'use client'

// USADOS NO FORMULÁRIO DE CADASTRO

import { CadastroFormacao } from "@/resources/formacao/formacaoResource"
import { qualificacaoUsuario } from "@/resources/qualificacao/qualificacaoResource";
import React from "react";





interface formacaoProps extends CadastroFormacao {
    click?: () => void;
}

// PADROZIÇÃO DE FORMAÇÃO DO USUÁRIO
export const Formacao: React.FC<formacaoProps> = ({ curso, instituicao, nivel, click, situacao }) => {
    return (
        <div style={{ boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.4)' }}
            className="border border-gray-500  flex flex-col gap-y-1  p-2 rounded-md my-5 w-fit shrink-0">
            <span title="Apagar" onClick={click} className="-mt-2 cursor-pointer text-gray-900 material-symbols -ml-2">close</span>
            <span className="font-bold">{instituicao}</span>
            <span className="font-bold">{curso}</span>
            <span className="font-bold">{nivel}</span>
            <span className="font-bold">{situacao}</span>
        </div>
    )
}

interface experienciaPros {
    empresa: string;
    cargo: string;
    descricao: string;
    duracao: string;
    click?: () => void;
}


// EXIBIÇÃO DE EXPERIÊNCIAS
export const Experiencia: React.FC<experienciaPros> = ({ cargo, empresa, descricao, click, duracao }) => {
    return (
        <div style={{ boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.4)' }}
            className="border h-fit pb-3 min-w-32 max-w-fit flex flex-col gap-x-4 rounded-md px-2 pt-1 text-justify">
            <i onClick={click} className="material-symbols cursor-pointer -ml-2 text-right">close</i>
            <span className="font-bold"> {empresa}</span>
            <span className="font-bold">{cargo}</span>
            <span className="font-bold">{duracao}</span>
            <span className="font-bold">{descricao}</span>
        </div>
    )
}

interface cursoProps {
    instituicao: string;
    curso: string;
    carga: number;
    click: () => void;
}
// COMPONENTE DE CURSO COMPLEMENTAR
export const Curso: React.FC<cursoProps> = ({ curso, instituicao, carga, click }) => {
    return (
        <div style={{ boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.4)' }}
            className="flex flex-col min-w-36 max-w-fit h-fit  p-1.5 border border-gray-500 rounded-md text-nowrap text-justify shrink-0 mb-4">
            <span className="flex flex-row-reverse"><i onClick={click} className="cursor-pointer material-symbols scale-90">close</i></span>
            <label>Instituição:</label>
            <span className="font-bold">{instituicao}</span>
            <label>Curso:</label>
            <span className="font-bold">{curso}</span>
            <label>Carga Horária:</label>
            <span className="font-bold">{carga}</span>
        </div>
    )
}

interface qualificacaoProps extends qualificacaoUsuario {
    click: () => void
}

export const QualificacaoComponent: React.FC<qualificacaoProps> = ({ click, idQualificacao, nivel, nome }) => {
    return (
        <div className="w-fit flex flex-col items-end shrink-0">
            <div onClick={click}
                className=" text-right w-fit" >
                    <i className="material-symbols cursor-pointer">close</i>
                    </div>
            <div className="w-fit border border-gray-500 p-1 rounded-lg" key={idQualificacao}>
                {nome}-{nivel}
            </div>
        </div>
    )
}