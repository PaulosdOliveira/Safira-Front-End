'use client'

import { useFormik } from "formik";
import React from "react";
import { dadosCadastroVaga, valoresIniciais } from "./formSchema";
import { VagaService } from "@/resources/vaga_emprego/service";
import { ServicoSessao } from "@/resources/sessao/sessao";


export default function CadastroVaga() {


    const { handleChange, handleSubmit, values } = useFormik<dadosCadastroVaga>({
        initialValues: valoresIniciais,
        onSubmit: submit
    })

    async function submit() {
        const dadosCadastrais: dadosCadastroVaga = {
            cep: values.cep, descricao_vaga: values.descricao_vaga.replaceAll("###", ""),
            diasEmAberto: values.diasEmAberto, diferenciais: values.diferenciais.replaceAll("###", ""),
            exclusivoParaPcd: values.exclusivoParaPcd, horario: values.horario.replaceAll("###", ""),
            local_de_trabalho: values.local_de_trabalho.replaceAll("###", ""), modelo: values.modelo,
            nivel: values.nivel, principais_atividades: values.principais_atividades.replaceAll("###", ""),
            requisitos: values.requisitos.replaceAll("###", ""), salario: values.salario, exclusivoParaSexo: values.exclusivoParaSexo,
            tipoContrato: values.tipoContrato, titulo: values.titulo
        }
        await VagaService().cadastrar_vaga(dadosCadastrais, ServicoSessao().getSessao()?.accessToken + '');
    }

    function definirTeclasPermitidas(keyDown: React.KeyboardEvent<HTMLInputElement>) {
        if (keyDown.ctrlKey && keyDown.key.toLowerCase() == 'a') return;
        const permitidos = ['0', '9', '8', '7', '6', '5', '4', '3', '2', '1', '.', ',', 'Backspace', 'ArrowLeft', 'ArrowRight']

        if (!permitidos.includes(keyDown.key)) {
            keyDown.preventDefault();
        }
    }

    return (
        <div>
            <div className="border w-[60%] m-auto mt-12">
                <form onSubmit={handleSubmit}>
                    <div id="primeiro" className="grid grid-cols-2">

                        <input id="titulo" onChange={handleChange} type="text" placeholder="Titulo" />
                        <input id="diasEmAberto" onChange={handleChange} onKeyDown={definirTeclasPermitidas} type="number" inputMode="numeric" pattern="[0-9]*" />

                        <input id="salario" onChange={handleChange} type="text" placeholder="Salario" onKeyDown={definirTeclasPermitidas} />
                        <input id="cep" onChange={handleChange} type="text" placeholder="Cep" />
                        <select id="modelo" onChange={handleChange}>
                            <option>PRESENCIAL</option>
                            <option>HIBRIDO</option>
                            <option>REMOTO</option>
                        </select>
                        <select id="nivel" onChange={handleChange}>
                            <option >JUNIOR</option>
                            <option >PLENO</option>
                            <option >SENIOR</option>
                            <option >INDEFINIDO</option>
                        </select>
                        <select id="tipoContrato" onChange={handleChange}>
                            <option >CLT</option>
                            <option >PJ</option>
                            <option >ESTAGIO</option>
                            <option >TEMPORARIO</option>
                        </select>

                        <select id="exclusivoParaSexo" onChange={handleChange}>
                            <option >TODOS</option>
                            <option >MASCULINO</option>
                            <option >FEMININO</option>
                        </select>
                        <select id="exclusivoParaPcd" onChange={handleChange}>
                            <option value={`${true}`}>SIM</option>
                            <option value={`${false}`}>NÃO</option>
                        </select>
                    </div>
                    <div id="segundo" className="grid grid-cols-1">

                        <textarea id="descricao_vaga" onChange={handleChange} placeholder="Introdução" />
                        <textarea id="principais_atividades" onChange={handleChange} placeholder="Principais atividades" />
                        <textarea id="requisitos" onChange={handleChange} placeholder="Reuisitos" />
                        <textarea id="diferenciais" onChange={handleChange} placeholder="Diferenciais" />
                        <textarea id="local_de_trabalho" onChange={handleChange} placeholder="Local de trabalho" />
                        <textarea id="horario" onChange={handleChange} placeholder="Horário" />
                        <input type="submit" value="Enviar" />
                    </div>
                </form>
            </div>
        </div>
    )
}