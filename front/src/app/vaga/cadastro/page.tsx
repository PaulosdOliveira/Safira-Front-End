'use client'
import "@/app/styles/cadastro-vaga.css"
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { dadosCadastroVaga, valoresIniciais } from "./formSchema";
import { VagaService } from "@/resources/vaga_emprego/service";
import { ServicoSessao } from "@/resources/sessao/sessao";
import { cidade, estado, UtilsService } from "@/resources/utils/utils";
import { Option } from "@/app/page";


export default function CadastroVaga() {

    const [estados, setEstado] = useState<estado[]>([]);
    const [cidades, setCidades] = useState<cidade[]>([]);
    const utilsService = UtilsService();
    const { handleChange, handleSubmit, values } = useFormik<dadosCadastroVaga>({
        initialValues: valoresIniciais,
        onSubmit: submit
    })

    async function submit() {
        alert(values.idCidade)
        alert(values.idEstado)
        const dadosCadastrais: dadosCadastroVaga = {
            descricao_vaga: values.descricao_vaga.replaceAll("###", ""),
            diasEmAberto: values.diasEmAberto, diferenciais: values.diferenciais.replaceAll("###", ""),
            exclusivoParaPcd: values.exclusivoParaPcd, horario: values.horario.replaceAll("###", ""),
            local_de_trabalho: values.local_de_trabalho.replaceAll("###", ""), modelo: values.modelo,
            nivel: values.nivel, principais_atividades: values.principais_atividades.replaceAll("###", ""),
            requisitos: values.requisitos.replaceAll("###", ""), salario: values.salario, exclusivoParaSexo: values.exclusivoParaSexo,
            tipoContrato: values.tipoContrato, titulo: values.titulo, idCidade: values.idCidade, idEstado: values.idEstado
        }
        await VagaService().cadastrar_vaga(dadosCadastrais, ServicoSessao().getSessao()?.accessToken + '');
    }


    useEffect(() => {
        (async () => {
            const estadosEncontados: estado[] = await utilsService.buscarEstados();
            setEstado(estadosEncontados);
        })();

    }, [])


    async function selecionarEstado(estado: HTMLSelectElement) {
        values.idEstado = estado.value;
        values.idCidade = "";
        const cidades = await utilsService.buscarCidadesdeEstado(parseInt(estado.value));
        setCidades(cidades);
    }


    // Criando options 
    function criaOption(texto: string, id: number) {
        return (
            <Option key={id} texto={texto} id={id} />
        )
    }

    // Renderizando os options de estados
    function renderizarOptionEstados() {
        return estados.map((estado) => criaOption(estado.sigla, estado.id));
    }

    // Renderizando os options de cidades
    function renderizarOptionsCidade() {
        return (
            cidades.map((cidade) => criaOption(cidade.nome, cidade.id))
        );
    }

    function definirTeclasPermitidas(keyDown: React.KeyboardEvent<HTMLInputElement>) {
        if (keyDown.ctrlKey && keyDown.key.toLowerCase() == 'a') return;
        const permitidos = ['0', '9', '8', '7', '6', '5', '4', '3', '2', '1', '.', ',', 'Backspace', 'ArrowLeft', 'ArrowRight']

        if (!permitidos.includes(keyDown.key)) {
            keyDown.preventDefault();
        }
    }

    return (
        <div className="main">
            <div className="form-container border border-gray-300 bg-white m-auto mt-12 rounded-lg shadow-2xl shadow-gray-600">
                <form onSubmit={handleSubmit}>
                    <div id="dados_simples" className="grid grid-cols-1">

                        <div className="component-form">
                            <label>Adicione um titulo:</label>
                            <input id="titulo" onChange={handleChange} type="text" placeholder="Titulo" />
                        </div>

                        <div className="component-form">
                            <label>Prazo em dias:</label>
                            <input id="diasEmAberto" onChange={handleChange} onKeyDown={definirTeclasPermitidas} type="number" inputMode="numeric" pattern="[0-9]*" />
                        </div>

                        <div className="component-form">
                            <label>Salario:</label>
                            <input id="salario" onChange={handleChange} type="text" placeholder="Salario" onKeyDown={definirTeclasPermitidas} />
                        </div>

                        <div className="component-form">
                            <label>Modelo:</label>
                            <select id="modelo" onChange={handleChange}>
                                <option>PRESENCIAL</option>
                                <option>HIBRIDO</option>
                                <option>REMOTO</option>
                            </select>
                        </div>


                        <div className="component-form">
                            <label>Nível exigido:</label>
                            <select id="nivel" onChange={handleChange}>
                                <option >JUNIOR</option>
                                <option >PLENO</option>
                                <option >SENIOR</option>
                                <option >INDEFINIDO</option>
                            </select>
                        </div>


                        <div className="component-form">
                            <label>Tipo de contrato:</label>
                            <select id="tipoContrato" onChange={handleChange}>
                                <option >CLT</option>
                                <option >PJ</option>
                                <option >ESTAGIO</option>
                                <option >TEMPORARIO</option>
                            </select>
                        </div>


                        <div className="component-form">
                            <label>Estado:</label>
                            <select id="idEstado" onChange={(event) => selecionarEstado(event.target)}>
                                <option value={``}>Todos</option>
                                {renderizarOptionEstados()}
                            </select>
                        </div>

                        <div className="component-form">
                            <label>Cidade:</label>
                            <select id="idCidade" onChange={handleChange}>
                                <option value={``}>Todos</option>
                                {renderizarOptionsCidade()}
                            </select>
                        </div>

                        <div className="component-form">
                            <label>Exclusividade de sexo:</label>
                            <select id="exclusivoParaSexo" onChange={handleChange}>
                                <option >TODOS</option>
                                <option >MASCULINO</option>
                                <option >FEMININO</option>
                            </select>
                        </div>

                        <div className="component-form">
                            <label>Excluiva para PCD?:</label>
                            <select id="exclusivoParaPcd" onChange={handleChange}>
                                <option value={`${true}`}>SIM</option>
                                <option value={`${false}`}>NÃO</option>
                            </select>
                        </div>
                    </div>
                    <div id="segundo" className="grid grid-cols-1">

                        <div className="component-form ">
                            <label>Adicione uma introdução para a  descrição:</label>
                            <textarea id="descricao_vaga" onChange={handleChange} placeholder="Introdução" />
                        </div>


                        <div className="component-form ">
                            <label>Descreva as pricipais atividades:</label>
                            <textarea id="principais_atividades" onChange={handleChange} placeholder="Principais atividades" />
                        </div>

                        <div className="component-form ">
                            <label>Requisitos da vaga:</label>
                            <textarea id="requisitos" onChange={handleChange} placeholder="Reuisitos" />
                        </div>

                        <div className="component-form ">
                            <label>Diferenciais paa a vaga:</label>
                            <textarea id="diferenciais" onChange={handleChange} placeholder="Diferenciais" />
                        </div>

                        <div className="component-form ">
                            <label>Fale sobre o local de trabalho:</label>
                            <textarea id="local_de_trabalho" onChange={handleChange} placeholder="Local de trabalho" />
                        </div>


                        <div className="component-form ">
                            <label>Informações sobre horario e escala:</label>
                            <textarea id="horario" onChange={handleChange} placeholder="Horário" />
                        </div>
                    </div>
                    <input type="submit" value="Enviar" />
                </form>
            </div>
        </div>
    )
}