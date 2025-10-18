'use client'
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { dadosCadastroVaga, valoresIniciais } from "./formSchema";
import { VagaService } from "@/resources/vaga_emprego/service";
import { ServicoSessao } from "@/resources/sessao/sessao";
import { cidade, estado, UtilsService } from "@/resources/utils/utils";
import { Option } from "@/app/candidato/page";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";



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
        await VagaService().cadastrar_vaga(values, ServicoSessao().getSessao()?.accessToken + '');
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
        <div className="font-[arial]">
            <Header />
            <div className=" w-[400px] sm:w-[600px] md:w-[680px] lg:w-[720px] border border-gray-300 bg-white m-auto mt-12 rounded-lg shadow-sm shadow-gray-200  p-5 mb-20">
                <h1 className="text-center ">Cadastro de vaga</h1>
                <hr className="text-gray-400 my-20 w-[90%] m-auto" />
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2  ">
                        <div className="grid">
                            <label>Adicione um titulo:</label>
                            <input className="border border-gray-400 h-10 rounded-lg" id="titulo" onChange={handleChange} type="text" placeholder="Titulo" />
                        </div>
                        <div className="grid">
                            <label>Prazo em dias:</label>
                            <input className="border border-gray-400 h-10 rounded-lg"
                                id="diasEmAberto" onChange={handleChange} onKeyDown={definirTeclasPermitidas} type="number" inputMode="numeric" pattern="[0-9]*" />
                        </div>
                        <div className="grid">
                            <label>Salario:</label>
                            <input className="border border-gray-400 h-10 rounded-lg" id="salario" onChange={handleChange} type="text" placeholder="Salario" onKeyDown={definirTeclasPermitidas} />
                        </div>
                        <div className="grid">
                            <label>Modelo:</label>
                            <select className="border border-gray-400 h-10 rounded-lg" id="modelo" onChange={handleChange}>
                                <option>PRESENCIAL</option>
                                <option>HIBRIDO</option>
                                <option>REMOTO</option>
                            </select>
                        </div>
                        <div className="grid">
                            <label>Nível exigido:</label>
                            <select className="border border-gray-400 h-10 rounded-lg" id="nivel" onChange={handleChange}>
                                <option >JUNIOR</option>
                                <option >PLENO</option>
                                <option >SENIOR</option>
                                <option >INDEFINIDO</option>
                            </select>
                        </div>
                        <div className="grid">
                            <label>Tipo de contrato:</label>
                            <select className="border border-gray-400 h-10 rounded-lg" id="tipoContrato" onChange={handleChange}>
                                <option >CLT</option>
                                <option >PJ</option>
                                <option >ESTAGIO</option>
                                <option >TEMPORARIO</option>
                            </select>
                        </div>
                        <div className="grid">
                            <label>Estado:</label>
                            <select className="border border-gray-400 h-10 rounded-lg" id="idEstado" onChange={(event) => selecionarEstado(event.target)}>
                                <option value={``}>Todos</option>
                                {renderizarOptionEstados()}
                            </select>
                        </div>
                        <div className="grid">
                            <label>Cidade:</label>
                            <select className="border border-gray-400 h-10 rounded-lg" id="idCidade" onChange={handleChange}>
                                <option value={``}>Todos</option>
                                {renderizarOptionsCidade()}
                            </select>
                        </div>
                        <div className="grid">
                            <label>Exclusividade de sexo:</label>
                            <select className="border border-gray-400 h-10 rounded-lg" id="exclusivoParaSexo" onChange={handleChange}>
                                <option >TODOS</option>
                                <option >MASCULINO</option>
                                <option >FEMININO</option>
                            </select>
                        </div>
                        <div className="grid">
                            <label>Excluiva para PCD?:</label>
                            <select className="border border-gray-400 h-10 rounded-lg" id="exclusivoParaPcd" onChange={handleChange}>
                                <option value={`${true}`}>SIM</option>
                                <option value={`${false}`}>NÃO</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-y-10 mt-10">

                        <div className="grid ">
                            <label>Descrição:</label>
                            <textarea className="h-[200px] border border-gray-400 pl-1 rounded-sm" id="descricao" onChange={handleChange} placeholder="Adicione uma introdução para a  descrição" />
                        </div>


                        <div className="grid ">
                            <label>pricipais atividades:</label>
                            <textarea className="h-[200px] border border-gray-400 pl-1 rounded-sm" id="principais_atividades" onChange={handleChange} placeholder="Descreva as pricipais atividades" />
                        </div>

                        <div className="grid ">
                            <label>Requisitos:</label>
                            <textarea className="h-[200px] border border-gray-400 pl-1 rounded-sm" id="requisitos" onChange={handleChange} placeholder="Requisitos" />
                        </div>

                        <div className="grid ">
                            <label>Diferenciais:</label>
                            <textarea className="h-[200px] border border-gray-400 pl-1 rounded-sm" id="diferenciais" onChange={handleChange} placeholder="Diferenciais" />
                        </div>

                        <div className="grid ">
                            <label>Local de trabalho:</label>
                            <textarea className="h-[200px] border border-gray-400 pl-1 rounded-sm" id="local_de_trabalho" onChange={handleChange} placeholder="Local de trabalho" />
                        </div>


                        <div className="grid ">
                            <label>Horario:</label>
                            <textarea className="h-[200px] border border-gray-400 pl-1 rounded-sm" id="horario" onChange={handleChange} placeholder="Informações sobre horario e escala" />
                        </div>

                        <div className="grid ">
                            <label>Texto selecionar candidato:</label>
                            <textarea className="h-[200px] border border-gray-400 pl-1 rounded-sm" value={values.mensagemConvocacao} id="mensagemConvocacao" onChange={handleChange} placeholder="Mensagem que candidato receberá ao ser selecionado" />
                        </div>
                        <div className="grid ">
                            <label>Texto dispensar candidato:</label>
                            <textarea className="h-[200px] border border-gray-400 pl-1 rounded-sm" value={values.mensagemDispensa} id="mensagemDispensa" onChange={handleChange} placeholder="Mensagem que candidato receberá ao ser dispensado" />
                        </div>
                    </div>
                    <div className="flex justify-center mt-8">
                        <input type="submit" value="Enviar" className="bg-gray-800 text-white p-1 rounded-md cursor-pointer w-56 h-10" />
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    )
}