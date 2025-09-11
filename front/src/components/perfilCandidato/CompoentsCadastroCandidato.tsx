'use client'


import { CadastroFormacao } from "@/resources/formacao/formacaoResource";
// USADOS NO FORMULÁRIO DE CADASTRO

import { qualificacaoUsuario } from "@/resources/qualificacao/qualificacaoResource";
import React from "react";





interface formacaoProps extends CadastroFormacao {
    click?: () => void;
}

// PADROZIÇÃO DE FORMAÇÃO DO USUÁRIO
export const Formacao: React.FC<formacaoProps> = ({ curso, instituicao, nivel, click, situacao }) => {
    return (
        <div className="border flex flex-col gap-y-1  p-2 rounded-md my-5">
            <p onClick={click} className="-mt-2 text-right cursor-pointer text-red-700">Apagar</p>
            <span>
                <strong>
                    Instituição:{' '}
                </strong>
                {instituicao}
            </span>
            <span>
                <strong>Curso:{' '}
                </strong>
                {curso}
            </span>
            <span>
                <strong>
                    Nivel:{' '}
                </strong>
                {nivel}
            </span>
            <span>
                <strong>
                    Situação:{' '}
                </strong>
                {situacao}
            </span>

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

export const Experiencia: React.FC<experienciaPros> = ({ cargo, empresa, descricao, click, duracao }) => {
    return (
        <div className="grid">
            <div onClick={click} className="w-full cursor-pointer text-right pr-2 text-red-700">Excluir</div>
            <div className="border text-nowrap flex gap-x-4 h-12 rounded-md px-2 pt-1   overflow-auto">
                <p><strong>Empresa:</strong> {" " + empresa}</p>
                <p><strong>Cargo:</strong> {" " + cargo}</p>
                <p><strong>Descrição:</strong>{" " + descricao}</p>
                <p><strong>Duração:</strong>{" " + duracao}</p>
            </div>

        </div>
    )
}

interface cursoProps {
    instituicao: string;
    curso: string;
    carga: number;
    click: () => void;
}
export const Curso: React.FC<cursoProps> = ({ curso, instituicao, carga, click }) => {
    return (
        <div className="">
            <div onClick={click} className="w-full cursor-pointer text-right pr-2 text-red-700">Excluir</div>
            <div className="flex text-nowrap gap-x-3 overflow-auto h-9 px-1 border rounded-md">
                <span>Instituição: {" " + instituicao}</span>
                <span>Curso: {" " + curso}</span>
                <span>Carga horaria: {" " + carga}</span>
            </div>
        </div>
    )
}

interface qualificacaoProps extends qualificacaoUsuario {
    click: () => void
}

export const QualificacaoComponent: React.FC<qualificacaoProps> = ({ click, idQualificacao, nivel, nome }) => {
    return (
        <div className="w-fit flex flex-col items-end">
            <div onClick={click}
                className="text-red-700 text-right cursor-pointer w-fit mr-2" >Excluir</div>
            <div className="w-fit border border-gray-500 p-1 rounded-lg" key={idQualificacao}>
                {nome}-{nivel}
            </div>
        </div>
    )
}