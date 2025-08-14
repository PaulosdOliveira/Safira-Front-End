'use client'
import { useFormik } from "formik"
import { dadosCadastroCandidato, dadosFormulario, formValidation, qualificacaoForm, qualificacaoFormValidation, valoresIniciais } from "./formSchema"
import React, { useEffect, useState } from "react";
import { CandidatoService } from "@/resources/candidato/servico";
import { accessToken, dadosLogin, ServicoSessao } from "@/resources/sessao/sessao";
import { QualificacaoService } from "@/resources/qualificacao/qualificacaoService";
import { Qualificacao, qualificacaoFormInitial, qualificacaoSelecionada, qualificacaoUsuario } from "@/resources/qualificacao/qualificacaoResource";
import { cidade, estado, UtilsService } from "@/resources/utils/utils";
import { Option } from "../page";
import { Instrucao, QualificacaoSelecionada } from "@/components/qualificacao/selecao";
import { OptionQualificacao } from "@/components/qualificacao/optionQualificacao";





export default function cadastroCandidato() {

    const [cadastrou, setCadastrou] = useState<boolean>(false);
    const [urlFoto, setUrlFoto] = useState<string>("");
    const [nomePdf, setNomePdf] = useState<string>("Selecionar");
    const service = CandidatoService();
    const utils = UtilsService();
    const sessaoService = ServicoSessao();
    const [estados, setEstados] = useState<estado[]>([]);
    const [cidades, setCidades] = useState<cidade[]>([]);
    const { errors, handleChange, handleSubmit, values } = useFormik<dadosFormulario>({
        initialValues: valoresIniciais,
        onSubmit: submit,
        validationSchema: formValidation
    })

    //BUSCANDO ESTADOS NO BANCO DE DADOS
    useEffect(() => {
        (async () => {
            const estados = await utils.buscarEstados();
            setEstados(estados);
        })()
    }, [])

    //------->>> SUBMIT <<< ----------------------------
    async function submit() {

        const dadosCadastrais: dadosCadastroCandidato =
        {
            cep: values.cep, cpf: values.cpf, email: values.email,
            nome: values.nome, pcd: values.pcd, senha: values.senha,
            sexo: values.sexo, trabalhando: values.trabalhando, descricao: values.descricao,
            dataNascimento: values.dataNascimento, tel: values.tel, idCidade: values.idCidade,
            idEstado: values.idEstado
        };
        const resultado = await service.cadastrar(values);


        if (resultado.status === 201) {
            alert("Cadastro realizado com sucesso")
            const login: dadosLogin = {
                login: dadosCadastrais.email,
                senha: dadosCadastrais.senha
            }
            const token: accessToken = await service.logar(login);
            await service.salvarFoto(values.foto, token.token + '');
            sessaoService.criarSessao(token);
            setCadastrou(true);
            if (values.curriculo)
                await service.salvarCurriculo(values.curriculo, token.token + "");


        } else {
            alert(resultado.erro);
        }
    }



    // Captarando arquivo selecionado
    function capturarFoto(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const foto = event.target.files[0];
            const url = URL.createObjectURL(foto);
            setUrlFoto(url);
            values.foto = foto;
        }
    }

    // SELECIONANDO CURRICULO
    function selecionarPdf(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const curriculo = event.target.files[0];
            values.curriculo = curriculo;
            setNomePdf(curriculo.name);

        }
    }

    // Criando options 
    function criaOption(texto: string, id: number) {
        return (
            <Option key={id} texto={texto} id={id} />
        )
    }

    // Renderizando os options de cidades
    function renderizarOptionsCidade() {
        return (
            cidades.map((cidade) => criaOption(cidade.nome, cidade.id))
        );
    }

    // Renderizando os options de estados
    function renderizarOptionEstados() {
        return estados.map((estado) => criaOption(estado.sigla, estado.id));
    }

    async function selecionarEstado(estado: HTMLSelectElement) {
        values.idEstado = estado.value;
        values.idCidade = "";
        const cidades = await utils.buscarCidadesdeEstado(parseInt(estado.value));
        setCidades(cidades);
    }


    return (
        <>
            <main className={`${cadastrou ? 'hidden' : ''}`}>
                <form onSubmit={handleSubmit}
                    className=" w-[370px] sm:w-[600px] border border-gray-200 shadow-lg shadow-gray-400  mt-3 p-5 rounded-lg bg-white  m-auto">

                    <div id="Foto" className="flex my-6  w-[100%]" >
                        <label className=" foto rounded-full m-auto cursor-pointer border border-gray-300 bg-cover bg-no-repeat w-36 h-36"
                            style={{ backgroundImage: `url(${urlFoto})` }}>
                            <input name="foto" onChange={capturarFoto} className="hidden" type="file" />
                        </label>
                    </div>


                    <div className=" grid grid-cols-1 sm:grid-cols-2 gap-6 w-fit  m-auto">

                        <div className="grid">
                            <label>CPF: </label>
                            <input name="cpf" onChange={handleChange} className="border border-gray-400  h-10 rounded-lg sm:w-[260px] "
                                type="text" placeholder="CPF" value={values.cpf} />
                        </div>

                        <div className="grid">
                            <label>Email:</label>
                            <input name="email" onChange={handleChange} className="border  border-gray-400  h-10 rounded-lg w-[260px] "
                                type="email" placeholder="Email" value={values.email} />
                        </div>

                        <div className="grid">
                            <label>Nome:</label>
                            <input name="nome" onChange={handleChange} className="border  border-gray-400  h-10 rounded-lg w-[260px] "
                                type="text" placeholder="Nome completo" value={values.nome} />
                        </div>

                        <div className="grid">
                            <label>Telefone para contato:</label>
                            <input name="tel" onChange={handleChange} className="border border-gray-400  h-10 rounded-lg w-[260px]"
                                type="tel" placeholder="(**) *****-****" value={values.tel} />
                        </div>


                        <div className="grid">
                            <label>Senha:</label>
                            <input name="senha" onChange={handleChange} className="border  border-gray-400  h-10 rounded-lg w-[260px]"
                                type="password" placeholder="Senha" value={values.senha} />
                        </div>

                        <div className="grid">
                            <label>Senha:</label>
                            <input id="confirma_senha" onChange={handleChange} className="border  border-gray-400  h-10 rounded-lg w-[260px] "
                                type="password" placeholder="Confirme sua senha" value={values.confirma_senha} />
                        </div>

                        <div className="grid">
                            <label>Estado:</label>
                            <select name="idEstado" onChange={(event) => selecionarEstado(event.target)} className="border border-gray-400  h-10 rounded-sm">
                                <option value="">Todos</option>
                                {renderizarOptionEstados()}
                            </select>
                        </div>

                        <div className="grid">
                            <label>Cidade:</label>
                            <select name="idCidade" onChange={handleChange} className="border border-gray-400  h-10 rounded-sm" value={values.idCidade}>
                                <option value="">Todos</option>
                                {renderizarOptionsCidade()}
                            </select>
                        </div>

                        <div className="grid">
                            <label>Você é PCD?:</label>
                            <select name="pcd" className="border border-gray-400  h-10 rounded-sm"
                                onChange={() => values.pcd = !values.pcd}>
                                <option>NÃO</option>
                                <option>SIM</option>
                            </select>
                        </div>

                        <div className="grid">
                            <label>Sexo:</label>
                            <select name="sexo" onChange={handleChange} className="border border-gray-400  h-10 rounded-sm " value={values.sexo}>
                                <option>MASCULINO</option>
                                <option>FEMININO</option>
                            </select>
                        </div>


                        <div className="grid">
                            <label>Está empregado?:</label>
                            <select name="trabalhando" className="border border-gray-400  h-10 rounded-sm"
                                onChange={() => values.trabalhando = !values.trabalhando}>
                                <option>NÃO</option>
                                <option>SIM</option>
                            </select>
                        </div>

                        <div className="grid">
                            <label>Data de nascimento:</label>
                            <input name="dataNascimento" onChange={handleChange} className="h-10 rounded-lg"
                                type="date" placeholder="Senha" />
                        </div>

                    </div>
                    <div className="grid pt-7 place-items-center">
                        <label>Selecionar currículo:</label>
                        <label className="cursor-pointer text-center pt-3  h-13 w-40 rounded-sm  border">
                            {nomePdf}
                            <input name="curriculo" onChange={selecionarPdf} className="hidden" type="file" accept="application/pdf" />
                        </label>
                    </div>



                    <div className="grid grid-cols-1 pt-10">
                        <label>Descrição:</label>
                        <textarea name="descricao" placeholder="Fale sobre seu eu profissional" className="border border-gray-700 rounded-lg mt-3 h-32 pl-1 " value={values.descricao} onChange={handleChange} />
                        <input type="submit" value="Enviar" className="cursor-pointer w-[230px] h-10  border rounded-lg text-white bg-gray-800 mt-16 m-auto" />
                    </div>
                </form>
            </main>
            {cadastrou && (
                <>
                    <h1 className="text-center">Perfil criado!!</h1>
                    <h2 className="text-center">Adicione suas habilidades para completa-lo</h2>
                    <QualificacaoForm />

                </>
            )}

            <footer className="border mt-20 h-40"></footer>
        </>

    )
}



// 888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888

const QualificacaoForm = () => {


    const [qualificacoesSelecionadas, setQualificacoesSelecionadas] = useState<qualificacaoSelecionada[]>([]);
    const service = QualificacaoService();
    const { handleChange, handleSubmit, values } = useFormik<qualificacaoSelecionada>({
        initialValues: qualificacaoFormInitial,
        onSubmit: selecionar,
        validationSchema: qualificacaoFormValidation
    })
    const [select, setSelect] = useState<Qualificacao[]>([]);

    // Buscando qualificações no banco de dados
    useEffect(() => {
        (async () => {
            const qualificacoes: Qualificacao[] = await service.buscarQualificacoes();
            setSelect(qualificacoes);
        })();
    }, [])


    // Criando <option>'s de qualificação 
    function gerarOptionQualificacao(qualificacao: Qualificacao) {
        const id = qualificacao.id;
        return (
            <OptionQualificacao key={id} id={id} nome={qualificacao.nome} />
        )
    }

    // Renderizando <option>'s de qualificação 
    function renderizargerarOptionQualificacao() {
        return (
            select.map(gerarOptionQualificacao)
        );
    }


    function changeQualificacao(select: HTMLSelectElement) {
        const option = select.item(select.selectedIndex);
        values.idQualificacao = parseInt(option?.id + '')
        values.nome = option?.text + ''
    }

    // Selecionando qualificacao
    function selecionar() {
        if (!qualificacoesSelecionadas.some(
            (item) => item.idQualificacao === values.idQualificacao
        )) {
            const selecionada: qualificacaoSelecionada = { idQualificacao: values.idQualificacao, nivel: values.nivel, nome: values.nome }
            setQualificacoesSelecionadas(pre => [...pre, selecionada])
        }
    }


    // Removendo qualificação da lista de selecionadas e devolvendo ao select como ultimo item
    function removarSelecao(id: number) {
        setQualificacoesSelecionadas((prev) => prev.filter(item => item.idQualificacao !== id))
    }

    // Criando componente de qualificação selecionada
    function criarQualificacaoSelecionada(dados: qualificacaoSelecionada) {
        return (
            <QualificacaoSelecionada idQualificacao={dados.idQualificacao}
                key={dados.idQualificacao} nivel={dados.nivel} nomeQualificacao={dados.nome} click={removarSelecao} />
        )
    }

    function renderizar() {
        return (
            qualificacoesSelecionadas.map(criarQualificacaoSelecionada)
        );
    }

    // Transformando as qualificações selecionadas em modelos para serem salvos no banco de dados
    function criarQualificacaoUsuario(dados: qualificacaoSelecionada) {
        const qualificacao: qualificacaoUsuario = { idQualificacao: dados.idQualificacao, nivel: dados.nivel };
        return qualificacao;
    }

    // Enviando as qualificações ao back end
    async function cadastrarQualificacoes() {
        const token = ServicoSessao().getSessao()?.accessToken?.toString();
        alert(token)
        const qualificacoesUsuario = qualificacoesSelecionadas.map(criarQualificacaoUsuario)
        if (token)
            await CandidatoService().salvarQualificacoes(qualificacoesUsuario, token);
    }


    return (

        <div className="w-96 border text-center border-gray-300  shadow-lg shadow-gray-600 bg-white m-auto mb-64 test rounded-lg  font-bold text-gray-800 mt-24 p-5">
            <h2>Selecione as suas qualificações</h2>
            <div className="select-container ">
                <form onSubmit={handleSubmit}>

                    <select id="idQualificacao" className="mx-9 border border-gray-500" onChange={(event) => changeQualificacao(event.target)}>
                        <option></option>
                        {renderizargerarOptionQualificacao()}
                    </select>

                    <select className="border border-gray-500" id="nivel" onChange={handleChange}>
                        <option >BASICO</option>
                        <option >INTERMEDIARIO</option>
                        <option >AVANCADO</option>
                    </select>

                    <input className="cursor-pointer border p-1 mt-3" type="submit" value="Selecionar" />
                </form>
            </div>
            <div id="" className=" flex flex-wrap ">
                {renderizar()}
            </div>
            <Instrucao />
            <button onClick={() => cadastrarQualificacoes()}
                type="button"  className="cursor-pointer bg-gray-800 text-white rounded-md p-2 mt-9 w-20">Salvar</button>

            <hr className="my-7" />
            <a  href="http://localhost:3000" target="_self"
             className="cursor-pointer bg-blue-700 text-white rounded-md p-2 mt-9 w-20">Finalizar</a>
        </div>

    )
}

