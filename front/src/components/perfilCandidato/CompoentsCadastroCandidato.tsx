'use client'

// USADOS NO FORMULÁRIO DE CADASTRO

import { CadastroFormacao } from "@/resources/formacao/formacaoResource"
import { qualificacaoUsuario } from "@/resources/qualificacao/qualificacaoResource";
import React, { useState } from "react";





interface formacaoProps extends CadastroFormacao {
    click?: () => void;
}

// PADROZIÇÃO DE FORMAÇÃO DO USUÁRIO
export const Formacao: React.FC<formacaoProps> = ({ curso, instituicao, nivel, click, situacao }) => {
    return (
        <div
            className="border border-gray-500 bg-gray-50 shadow shadow-gray-300 flex flex-col gap-y-1  p-2 rounded-md my-5 w-fit shrink-0">
            <div className="text-right -mt-1 -mb-5 -mr-2.5">
                <span title="Apagar" onClick={click} className="-mt-2 cursor-pointer text-gray-900 material-symbols scale-75">delete</span>
            </div>
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


//ACCORDION DE EXPERIÊNCIAS ADICIONADAS NO FORMULÁRIO
export const ExperienciaAccordion: React.FC<experienciaPros> = ({ cargo, empresa, descricao, click, duracao }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`border-2 border-gray-400 bg-gray-100 w-full h-fit p-1 px-2 m-auto flex flex-col gap-x-4 rounded-md  shrink-0 `}>
            <i onClick={() => setOpen(!open)} className="material-symbols -mb-5 transition-all duration-700 cursor-pointer -ml-2 text-right z-10">{open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
            <span className="font-bold flex items-center gap-x-3 pl-3 text-[1.2em]"> 
                <i onClick={click} className="material-symbols  cursor-pointer -ml-2 text-right text-red-700 z-20">delete</i>
                <p className="text-">{cargo}</p>
            </span>
            {open && (
                <div className={`grid  text-gray-600 font-semibold px-1 `}>
                    <hr className="-mx-1 mt-1 text-gray-400" />
                    <span className=""><strong>Empresa:</strong>  {empresa}</span>
                    <span className=""><strong>Periodo:</strong> {duracao}</span>
                    <pre className="text-justify "><strong>Descrição:</strong><br /> {descricao}</pre>
                </div>
            )}
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
            className="flex flex-col w-56 text-wrap  h-fit  p-1.5 border border-gray-500 rounded-md  shrink-0 mb-4">
            <span className="flex flex-row-reverse"><i onClick={click} className="cursor-pointer material-symbols scale-90">delete</i></span>
            <label>Instituição:</label>
            <span className="font-bold">{instituicao}</span>
            <label>Curso:</label>
            <pre className="font-bold">{curso}</pre>
            <label>Carga Horária:</label>
            <span className="font-bold">{carga}</span>
        </div>
    )
}

interface qualificacaoProps extends qualificacaoUsuario {
    click: () => void
}

// COMPONENTE DE XIXBIÇÃO DE QUALIFICAÇÕES SELECIONADAS NO FORMULÁRIO
export const QualificacaoComponent: React.FC<qualificacaoProps> = ({ click, idQualificacao, nivel, nome }) => {
    return (

        <span style={{ boxShadow: '1px 1px 1px rgba(0,0,0,0.800)' }}
            className="w-fit flex items-center px-0.5 border border-gray-500 bg-gray-50  text-[.8em] rounded-lg relative" key={idQualificacao}>
            {nome}-{nivel}
            <i onClick={click} className="material-symbols cursor-pointer -top-2 scale-50 ">delete</i>
        </span>

    )
}