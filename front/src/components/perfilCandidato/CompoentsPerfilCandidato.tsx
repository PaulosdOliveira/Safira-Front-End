'use client'

import { Curso } from "@/resources/curso/cursoResource"
import { Experiencia } from "@/resources/experiencia/experineciaResource"
import { Formacao } from "@/resources/formacao/formacaoResource"


export const FormacaoJSX: React.FC<Formacao> = ({ curso, situacao, id, instituicao, nivel }) => {
    return (
        <div className="shadow-md shadow-gray-300  pb-3 p-2 border border-gray-400 rounded-md">
            <h4>{nivel}</h4>
            <div className="flex flex-wrap items-center">
                <span className=" text-[1.2em] mr-1">Instituição: </span>
                <p className="-mb-1 font-bold">{instituicao}</p>
            </div>
            <div className="flex flex-wrap items-center">
                <span className=" text-[1.2em] mr-1">Curso: </span>
                <p className="-mb-1 font-bold">{curso}</p>
            </div>
            <div className="flex items-center">
                <span className=" text-[1.2em] mr-1">Situação: </span>
                <p className="-mb-1 font-bold">{situacao}</p>
            </div>

        </div>
    )
}


export const CursoJSX: React.FC<Curso> = ({ curso, id, instituicao, cargaHoraria }) => {
    return (
        <div className="shadow-md shadow-gray-300 p-2 border border-gray-400 rounded-md">
            <h4>{curso}</h4>
            <div className="flex items-center">
                <span className=" text-[1.2em] mr-1">Instituição: </span>
                <p className="-mb-1">{instituicao}</p>
            </div>
            <div className="flex items-center">
                <span className=" text-[1.2em] mr-1">Carga horaria: </span>
                <p className="-mb-1">{cargaHoraria}</p>
            </div>
        </div>
    )
}

export const ExperienciaJSX: React.FC<Experiencia> = ({ id, cargo, descricao, duracao, empresa }) => {
    return (
        <div className="shadow-md shadow-gray-300 p-2 border border-gray-400 rounded-md">
            <h4>{cargo}</h4>
            <div className="flex items-center ">
                <span className=" text-[1.2em] mr-1">Empresa: </span>
                <p className="-mb-1">{empresa}</p>
            </div>
            <div className="flex items-center">
                <span className=" text-[1.2em] mr-1">Duração: </span>
                <p className="-mb-1">{duracao}</p>
            </div>
            <div className="flex flex-wrap items-center">
                <span className=" text-[1.2em] mr-1">Descrição: </span>
                <p className="-mb-1 text-justif indent-1">{descricao}</p>
            </div>
        </div>
    )
}