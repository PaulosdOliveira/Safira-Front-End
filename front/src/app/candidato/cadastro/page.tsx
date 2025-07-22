'use client'
import { useFormik } from "formik"
import '@/app/styles/cadastro-candidato.css'
import { dadosCadastroCandidato, dadosFormulario, formValidation, qualificacaoForm, qualificacaoFormInitial, qualificacaoFormValidation, valoresIniciais } from "./formSchema"
import React, { useEffect, useState } from "react";
import { CandidatoService } from "@/resources/candidato/servico";
import { accessToken, dadosLogin, ServicoSessao } from "@/resources/sessao/sessao";
import { QualificacaoService } from "@/resources/qualificacao/qualificacaoService";
import { Qualificacao, qualificacaoUsuario } from "@/resources/qualificacao/qualificacaoResource";
import { cidade, estado, UtilsService } from "@/resources/utils/utils";
import { Option } from "../main";





export default function cadastroCandidato() {

    const [cadastrou, setCadastrou] = useState<boolean>(false);
    const [urlFoto, setUrlFoto] = useState<string>("");
    const [nomePdf, setNomePdf] = useState<string>("Selecionar");
    const [urlPdf, setUrlPdf] = useState<string | null>(null);
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
            const url = URL.createObjectURL(event.target.files[0]);
            const curriculo = event.target.files[0];
            values.curriculo = curriculo;
            setNomePdf(curriculo.name);
            setUrlPdf(url);
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
            <main className="">

                <div id="direita" className="h-[auto] pb-28 w-[100vw] ">

                    <div id="form"
                        className="border border-gray-200 shadow-lg shadow-gray-400 m-auto mt-3 p-5 rounded-lg bg-white">
                        <form onSubmit={handleSubmit}
                            className=" w-[auto]">

                            <div id="Foto" className="flex my-4" >
                                <label className=" foto rounded-full m-auto cursor-pointer border border-gray-300 bg-cover bg-no-repeat"
                                    style={{ backgroundImage: `url(${urlFoto})` }}>
                                    <input name="foto" onChange={capturarFoto} className="hidden" type="file" />
                                </label>
                            </div>


                            <div id="Conteudo" className="grid grid-cols-1">
                                <div className="input-container">
                                    <label>CPF: </label>
                                    <input name="cpf" onChange={handleChange} className="border  border-black m-auto"
                                        type="text" placeholder="CPF" value={values.cpf} />
                                </div>

                                <div className="input-container">
                                    <label>Nome:</label>
                                    <input name="nome" onChange={handleChange} className="border  border-black m-auto"
                                        type="text" placeholder="Nome completo" value={values.nome} />
                                </div>

                                <div className="input-container">
                                    <label>Email:</label>
                                    <input name="email" onChange={handleChange} className="border  border-black m-auto"
                                        type="email" placeholder="Email" value={values.email} />
                                </div>

                                <div className="input-container">
                                    <label>Senha:</label>
                                    <input name="senha" onChange={handleChange} className="border  border-black m-auto"
                                        type="password" placeholder="Senha" value={values.senha} />
                                </div>

                                <div className="input-container">
                                    <label>Senha:</label>
                                    <input name="confirma_senha" onChange={handleChange} className="border  border-black m-auto"
                                        type="password" placeholder="Confirme sua senha" value={values.confirma_senha} />
                                </div>

                                <div className="input-container">
                                    <label>Data de nascimento:</label>
                                    <input name="dataNascimento" onChange={handleChange} className="border  border-black m-auto"
                                        type="date" placeholder="Senha" />
                                </div>

                                <div className="input-container">
                                    <label>Sexo:</label>
                                    <select name="sexo" onChange={handleChange} className="" value={values.sexo}>
                                        <option>MASCULINO</option>
                                        <option>FEMININO</option>
                                    </select>
                                </div>

                                <div className="input-container">
                                    <label>Estado:</label>
                                    <select name="idEstado" onChange={(event) => selecionarEstado(event.target)} className="" value={values.idEstado}>
                                        <option value="">Todos</option>
                                        {renderizarOptionEstados()}
                                    </select>
                                </div>

                                <div className="input-container">
                                    <label>Cidade:</label>
                                    <select name="idCidade" onChange={handleChange} className="" value={values.idCidade}>
                                        <option value="">Todos</option>
                                        {renderizarOptionsCidade()}
                                    </select>
                                </div>

                                <div className="input-container">
                                    <label>Você é PCD?:</label>
                                    <select name="pcd" onChange={() => values.pcd = !values.pcd}>
                                        <option>NÃO</option>
                                        <option>SIM</option>
                                    </select>
                                </div>

                                <div className="input-container">
                                    <label>Trabalha atualmente?:</label>
                                    <select name="trabalhando"
                                        onChange={() => values.trabalhando = !values.trabalhando}>
                                        <option>NÃO</option>
                                        <option>SIM</option>
                                    </select>

                                </div>

                                <div className="input-container">
                                    <label>Telefone para contato:</label>
                                    <input name="tel" onChange={handleChange} className="border  border-black m-auto"
                                        type="tel" placeholder="(**) *****-****" value={values.tel} />
                                </div>




                                <div className="input-container">
                                    <label>Selecionar currículo:</label>
                                    <label className="cursor-pointer text-center pt-3  h-13 w-40 rounded-sm mt-2 border">
                                        {nomePdf}
                                        <input name="curriculo" onChange={selecionarPdf} className="hidden" type="file" accept="application/pdf" />
                                    </label>

                                </div>
                            </div>
                            <div className="grid grid-cols-1">
                                <textarea name="descricao" className="border border-gray-400 mt-3 h-32
                        " value={values.descricao} onChange={handleChange} />


                                <input type="submit" value="Enviar" className="cursor-pointer w-[50%] " />
                            </div>

                        </form>
                        {urlPdf && (
                            <embed
                                src={urlPdf}
                                width="100%"
                                height="600px"
                                title="Currículo"
                            >
                            </embed>
                        )}
                    </div >
                </div>
                {!cadastrou && (
                    <QualificacaoForm />
                )}
            </main>
        </>

    )
}



const QualificacaoForm = () => {

    // Id da qualificação atual
    const [id, setId] = useState<number>(0);
    const [qualificacoesSelecionadas, setQualificacoesSelecionadas] = useState<qualificacaoSelecionadaProps[]>([]);
    const service = QualificacaoService();
    const { handleChange, handleSubmit, values } = useFormik<qualificacaoForm>({
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
            <OptionQualificacao key={id} id={id} nome={qualificacao.nome} click={setId} />
        )
    }

    // Renderizando <option>'s de qualificação 
    function renderizargerarOptionQualificacao() {
        return (
            select.map(gerarOptionQualificacao)
        );
    }

    // Selecionando qualificacao
    function selecionar() {
        const selecionada: qualificacaoSelecionadaProps = { nivel: values.nivel, nomeQualificacao: values.qualificacao, idQualificacao: id, click: () => true }
        setQualificacoesSelecionadas(pre => [...pre, selecionada]);
        removerItem(selecionada.nomeQualificacao)
        values.qualificacao = "";
        alert(id)
    }

    // Removendo item selecionado do <select>
    function removerItem(nome: string) {
        setSelect((prev) => prev.filter(item => item.nome !== nome))
    }

    // Removendo qualificação da lista de selecionadas e devolvendo ao select como ultimo item
    function removarSelecao(nomeIdQualificacao: string) {
        const textoDividido = nomeIdQualificacao.split(" ");
        const qualificacaoRemovida: Qualificacao = {
            id: parseInt(textoDividido[0]),
            nome: textoDividido[1]
        };
        setQualificacoesSelecionadas((prev) => prev.filter(item => item.nomeQualificacao !== textoDividido[1]))
        setSelect(pre => [...pre, qualificacaoRemovida])
    }

    // Criando componente de qualificação selecionada
    function criarQualificacaoSelecionada(dados: qualificacaoSelecionadaProps) {
        return (
            <QualificacaoSelecionada idQualificacao={dados.idQualificacao}
                key={dados.idQualificacao} nivel={dados.nivel} nomeQualificacao={dados.nomeQualificacao} click={removarSelecao} />
        )
    }

    function renderizar() {
        return (
            qualificacoesSelecionadas.map(criarQualificacaoSelecionada)
        );
    }

    // Transformando as qualificações selecionadas em modelos para serem salvos no banco de dados
    function criarQualificacaoUsuario(dados: qualificacaoSelecionadaProps) {
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

        <div className="border text-center border-gray-300  shadow-lg shadow-gray-600 bg-white m-auto mb-64 test rounded-lg  font-bold text-gray-800">
            <h1>Selecione as suas qualificações</h1>
            <div className="select-container border ">
                <form onSubmit={handleSubmit}>

                    <select value={values.qualificacao} id="qualificacao" className="mx-9" onChange={handleChange}>
                        <option></option>
                        {renderizargerarOptionQualificacao()}
                    </select>

                    <select id="nivel" onChange={handleChange}>
                        <option >BASICO</option>
                        <option >INTERMEDIARIO</option>
                        <option >AVANCADO</option>
                    </select>

                    <input className="cursor-pointer" type="submit" value="Selecionar" />
                </form>
            </div>

            <div id="selecionados" className="border">
                {renderizar()}
            </div>
            <input onClick={() => cadastrarQualificacoes()}
                type="button" value="Enviar" className="cursor-pointer" />
        </div>

    )
}

export interface qualificacaoSelecionadaProps {
    nomeQualificacao: string;
    idQualificacao: number;
    nivel: string;
    click: (event: any) => void;
}


const QualificacaoSelecionada: React.FC<qualificacaoSelecionadaProps> = ({ idQualificacao, nomeQualificacao, click, nivel }) => {

    return (
        <div className="border flex" >
            {nomeQualificacao} | {nivel}
            <div onClick={() => click(idQualificacao + " " + nomeQualificacao)}
                className="ml-10 cursor-pointer">x</div>
        </div>

    );
}

export interface qualificacaoProps {
    id?: number;
    nome?: string;
    click: (event: any) => void;
}

export const OptionQualificacao: React.FC<qualificacaoProps> = ({ id, nome, click }) => {
    return (
        <option id={id + ''} onClick={() => click(id)}>{nome}</option>
    );
}