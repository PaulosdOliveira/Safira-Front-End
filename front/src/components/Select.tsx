'use client'

import { Option } from "@/app/candidato/page";
import { cidade, estado, UtilsService } from "@/resources/utils/utils";
import React, { useEffect, useState } from "react";



interface localizacaoProps {
    changeEstado?: (event: any) => void;
    changeCidade?: (event: any) => void;
    cidades?: cidade[];
}

export const SelectEstadoCidade: React.FC<localizacaoProps> = ({ changeEstado, changeCidade, cidades }) => {

    const [estados, setEstado] = useState<estado[]>([]);
    const utils = UtilsService();


    useEffect(() => {
        (async () => {
            const estadosEncontados: estado[] = await utils.buscarEstados();
            setEstado(estadosEncontados);
        })();

    }, [])


    // Criando options 
    function criaOption(texto: string, id: number) {
        return (
            <Option key={id} texto={texto} id={id} />
        )
    }

    // Renderizando os options de cidades
    function renderizarOptionsCidade() {
        if (cidades)
            return (
                cidades.map((cidade) => criaOption(cidade.nome, cidade.id))
            );
    }

    // Renderizando os options de estados
    function renderizarOptionEstados() {
        return estados.map((estado) => criaOption(estado.sigla, estado.id));
    }
    return (
        <div className="flex p-2">
            <div className="inline-block mx-3">
                <label>Estado:</label>
                <br />
                <select className="border border-gray-200 rounded-sm p-0.5 h-9"
                    id="idEstado" onChange={changeEstado}>
                    <option value={""}>Todos</option>
                    {renderizarOptionEstados()}
                </select>
            </div>
            <div className=" inline-block">
                <label>Cidade:</label>
                <br />
                <select className="border border-gray-200 rounded-sm p-0.5 h-9"
                    id="idCidade" onChange={changeCidade}>
                    <option value={""}>Todos</option>
                    {renderizarOptionsCidade()}
                </select>
            </div>



        </div>
    )
}