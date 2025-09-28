'use client'
import { useFormik } from "formik"
import { dadosCadastroCandidato, dadosFormularioCadastroCandidato, formValidation, valoresIniciais } from "./formSchema"
import React, { useEffect, useState } from "react";
import { CandidatoService } from "@/resources/candidato/servico";
import { accessToken, dadosLogin, ServicoSessao } from "@/resources/sessao/sessao";
import { QualificacaoService } from "@/resources/qualificacao/qualificacaoService";
import { Qualificacao, qualificacaoUsuario } from "@/resources/qualificacao/qualificacaoResource";
import { cidade, estado, UtilsService } from "@/resources/utils/utils";
import { Option } from "../page";
import { useRouter } from "next/navigation";
import { CadastroFormacao } from "@/resources/formacao/formacaoResource";
import { CadastroExperiencia } from "@/resources/experiencia/experineciaResource";
import { CadastroCurso } from "@/resources/curso/cursoResource";
import { Curso, Experiencia, Formacao, QualificacaoComponent } from "@/components/perfilCandidato/CompoentsCadastroCandidato";
import { dadosFormCadastroEmpresa } from "@/app/empresa/cadastro/formSchema";





export default function cadastroCandidato() {

    const [urlFoto, setUrlFoto] = useState<string>("");
    const [nomePdf, setNomePdf] = useState<string>("Selecionar");
    const service = CandidatoService();
    const utils = UtilsService();
    const sessaoService = ServicoSessao();
    const router = useRouter();
    const [estados, setEstados] = useState<estado[]>([]);
    const [cidades, setCidades] = useState<cidade[]>([]);
    const [addFormacao, setAddFormacao] = useState<boolean>(false);
    const [addExperiencia, setAddExperiencia] = useState<boolean>(false);
    const [addCurso, setAddCurso] = useState<boolean>(false);
    const [addQualificacoes, setAddQualificacoes] = useState<boolean>(false);
    const [formacoes, setFornacoes] = useState<CadastroFormacao[]>([]);
    const [experiencias, setExperiencias] = useState<CadastroExperiencia[]>([]);
    const [cursos, setCursos] = useState<CadastroCurso[]>([]);

    /// SELEÇÃO QUALIFICAÇÃO
    const qualificacaoService = QualificacaoService();
    const [resultQualificacoes, setResultQualificacoes] = useState<Qualificacao[]>([]);
    const [qualificacoes, setQualificacoes] = useState<qualificacaoUsuario[]>([]);
    const [idQualificacaoSelecionada, setIdQualificacaoSelecionada] = useState<number | undefined>(undefined);



    const { errors, handleChange, handleSubmit, values } = useFormik<dadosFormularioCadastroCandidato>({
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
            cpf: values.cpf, email: values.email,
            nome: values.nome, pcd: values.pcd, senha: values.senha,
            sexo: values.sexo, trabalhando: values.trabalhando, descricao: values.descricao,
            dataNascimento: values.dataNascimento, tel: values.tel, idCidade: values.idCidade,
            idEstado: values.idEstado, cursos: cursos, experiencias: experiencias, formacoes: formacoes,
            qualificacoes: qualificacoes
        };
        const resultado = await service.cadastrar(dadosCadastrais);

        if (resultado.status === 201) {
            alert("Cadastro realizado com sucesso")
            const login: dadosLogin = {
                login: dadosCadastrais.email,
                senha: dadosCadastrais.senha
            }
            const token: accessToken = await service.logar(login);
            await service.salvarFoto(values.foto, token.token + '');
            sessaoService.criarSessao(token);

            if (values.curriculo)
                await service.salvarCurriculo(values.curriculo, token.token + "");
            router.push("/");
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

    // ADICIONAR FORMAÇÃO
    function adicionarFormacao() {
        const instituicao = document.getElementById("fInstituicao") as HTMLInputElement
        const curso = document.getElementById("fCurso") as HTMLInputElement
        const nivel = document.getElementById("fNivel") as HTMLSelectElement
        const situacao = document.getElementById("fSituacao") as HTMLSelectElement

        if (instituicao.value.length && curso.value.length) {
            const formacao: CadastroFormacao = { curso: curso.value, instituicao: instituicao.value, nivel: nivel.value, situacao: situacao.value }
            setFornacoes(pre => [...pre, formacao]);
            instituicao.value = "";
            curso.value = "";
        }
    }

    // ADICIONAR EXPERIENCIA
    function adicionarExperiencia() {
        const empresa = document.getElementById("eEmpresa") as HTMLInputElement
        const cargo = document.getElementById("eCargo") as HTMLInputElement
        const descricao = document.getElementById("eDescricao") as HTMLTextAreaElement
        const duracao = document.getElementById("eDuracao") as HTMLInputElement

        if (empresa.value.length && cargo.value.length && descricao.value.length && duracao.value.length) {
            const experiencia: CadastroExperiencia = { cargo: cargo.value, descricao: descricao.value, empresa: empresa.value, duracao: duracao.value };
            setExperiencias(pre => [...pre, experiencia]);
            empresa.value = "";
            cargo.value = "";
            descricao.value = "";
            duracao.value = "";
        }
    }

    // ADICIONAR CURSO
    function adicionarCurso() {
        const instituicao = document.getElementById("cInstituicao") as HTMLInputElement
        const curso = document.getElementById("cCurso") as HTMLInputElement
        const carga = document.getElementById("cCargaHoraria") as HTMLTextAreaElement
        if (instituicao.value.length && curso.value.length && carga.value.length) {
            const cursoComplementar: CadastroCurso = { cargaHoraria: parseInt(carga.value), curso: curso.value, instituicao: instituicao.value };
            setCursos(pre => [...pre, cursoComplementar]);
            instituicao.value = "";
            curso.value = "";
            carga.value = "";
        }
    }


    // BUSCANDO QUALIFICAÇÕES NO BANCO DE DADOS
    async function buscarQualificacoes(nome: string) {
        if (!nome || nome.trim().length === 0) {
            setResultQualificacoes([]);
        } else {
            const qualificacoesEncontradas: Qualificacao[] = await qualificacaoService.buscarQualificacoes(nome);
            setResultQualificacoes(qualificacoesEncontradas);
        }
    }
    // RENDERIZAR RESULTADO DA BUSCA PRO QUALIFICAÇÕES
    const renderizarQUalificacoesEncontradas = () => {
        return resultQualificacoes.map(q => {

            function mudarTexto() {
                const inputNomeQualificacao = document.getElementById("nome_qualificacao") as HTMLInputElement;
                inputNomeQualificacao.value = `${q.nome}`;
                setIdQualificacaoSelecionada(q.id);
                setResultQualificacoes([]);
            }
            return (
                <p className="cursor-pointer hover:bg-gray-100"
                    key={q.id} onClick={mudarTexto}>
                    {q.nome}
                </p>
            )
        })
    }
    // SELECIONAR QUALIFICAÇÃO

    function selecionarQualificacao() {
        if (idQualificacaoSelecionada) {
            const inputNomeQualificacao = document.getElementById("nome_qualificacao") as HTMLInputElement;
            const nivel = document.getElementById("nivel") as HTMLSelectElement;
            if (idQualificacaoSelecionada && nivel.length && inputNomeQualificacao.value.length) {

                if (!qualificacoes.some((item) => item.idQualificacao === idQualificacaoSelecionada
                )) {
                    //PARA ENVIAR AO BACK END
                    const qualificacao: qualificacaoUsuario = {
                        idQualificacao: idQualificacaoSelecionada,
                        nivel: nivel.value, nome: inputNomeQualificacao.value
                    };
                    setQualificacoes(pre => [...pre, qualificacao]);
                }
                inputNomeQualificacao.value = "";
            }
        }
    }

    const renderizarQualificacoes = () => {
        return qualificacoes.map(q => {
            return (
                <QualificacaoComponent click={() => setQualificacoes(pre => pre.filter(item => item.idQualificacao !== q.idQualificacao))}
                    idQualificacao={q.idQualificacao} nivel={`` + q.nivel} nome={`${q.nome}`} key={q.idQualificacao}
                />
            )
        })
    }


    const renderizarFormacoes = () => {
        return formacoes.map((f, index) => {
            return (
                <Formacao key={index} click={() => setFornacoes(pre => pre.filter(item => item.curso !== f.curso && item.instituicao !== f.instituicao))}
                    instituicao={f.instituicao} nivel={f.nivel} curso={f.curso} situacao={f.situacao} />
            )
        })
    }

    const renderizarExperiencias = () => {
        return experiencias.map(e => {
            return (<Experiencia click={() => setExperiencias(prev => prev.filter(item => item.empresa !== e.cargo && item.cargo !== e.cargo))}
                key={crypto.randomUUID()} empresa={`${e.empresa}`} cargo={e.cargo + ""} descricao={`${e.descricao}`} duracao={`${e.duracao}`} />)
        }
        )
    }

    const renderizarCurso = () => {
        return cursos.map(e => {
            return (<Curso click={() => setCursos(pre => pre.filter(item => item.curso !== e.curso && item.instituicao !== e.instituicao))}
                key={crypto.randomUUID()} carga={e.cargaHoraria ? e.cargaHoraria : 0} curso={`${e.curso}`} instituicao={`${e.instituicao}`} />)
        }
        )
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

    async function selecionarEstado(idEstado: string) {
        values.idEstado = idEstado;
        values.idCidade = "";
        const cidades = await utils.buscarCidadesdeEstado(parseInt(idEstado));
        setCidades(cidades);
    }


    return (
        <div className="bg-gray-100">
            <header className="h-[100px] shadow-sm shadow-gray-200 flex flex-col justify-end items-center py-2 z-10 bg-white">
                <div className="w-80 h-20  bg-cover"
                    style={{
                        backgroundPosition: "center center",
                        backgroundImage: `url(${"https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-ab98-622f-8ea1-1a044a1eed60/raw?se=2025-08-31T07%3A05%3A54Z&sp=r&sv=2024-08-04&sr=b&scid=4b3e33c9-b272-5a86-be4d-694409c802f2&skoid=c953efd6-2ae8-41b4-a6d6-34b1475ac07c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-08-31T00%3A48%3A05Z&ske=2025-09-01T00%3A48%3A05Z&sks=b&skv=2024-08-04&sig=GTnYTKvKp65xR6pok4gX2vzXaWr%2Bzi0N70zb8gXkMss%3D"})`
                    }} />
                <nav className="w-[100%]">
                    <ul className="text-gray-950 text-right">
                        <li className="inline-block hover:underline pr-4 pb-1 text-blue-600"><a target="_self" href="/empresa/login">Login para empresas</a></li>
                    </ul>
                </nav>
            </header>
            <main className="font-[arial] pt-10">
                <h2 className="text-center">Construa o seu perfil profissional</h2>
                <form onSubmit={handleSubmit}
                    className=" w-[370px] sm:w-[600px] md:w-[700px] border-[.7px] border-gray-500 shadow-lg shadow-gray-400  mt-3 p-5 rounded-lg bg-white  m-auto">
                    <div id="Foto" className="flex mt-6 mb-2   w-[100%]" >
                        <label className=" foto rounded-full m-auto cursor-pointer border border-gray-500 bg-cover bg-no-repeat w-36 h-36"
                            style={{ backgroundImage: `url(${urlFoto})` }}>
                            <input id="foto" onChange={capturarFoto} className="hidden" type="file" />
                        </label>
                    </div>
                    <div className="text-center min-h-[5px]">
                        <span className="text-[.6em]  text-red-700 m-auto ">{errors.foto}</span>
                    </div>
                    <div className="mb-10 mt-3 text-center">
                        <label className="bg-gray-900 p-2 rounded-md text-white cursor-pointer" htmlFor="foto">Seleione uma foto</label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-fit m-auto mb-10">
                        <div className="grid ">
                            <label htmlFor="cpf">CPF: </label>
                            <input id="cpf" name="cpf" onChange={handleChange} maxLength={14} className="border border-gray-400  h-10 rounded-sm sm:w-[260px] "
                                type="text" placeholder="000.000.000-00" value={values.cpf} />
                            <span className="text-[.6em] min-h-[16px]  text-red-700 ">{errors.cpf}</span>
                        </div>
                        <div className="grid">
                            <label htmlFor="email">Email:</label>
                            <input id="email" name="email" onChange={handleChange} className="border  border-gray-400  h-10 rounded-sm w-[260px] "
                                type="email" placeholder="usuario@exemplo.com" value={values.email} />
                            <span className="text-[.6em] min-h-[16px]  text-red-700 ">{errors.email}</span>
                        </div>
                        <div className="grid">
                            <label htmlFor="nome">Nome:</label>
                            <input id="nome" name="nome" onChange={handleChange} className="border  border-gray-400  h-10 rounded-sm w-[260px] "
                                type="text" placeholder="Nome completo" value={values.nome} />
                            <span className="text-[.6em] min-h-[16px]  text-red-700 ">{errors.nome}</span>
                        </div>
                        <div className="grid">
                            <label htmlFor="tel">Telefone para contato:</label>
                            <input id="tel" name="tel" onChange={handleChange} className="border border-gray-400  h-10 rounded-sm w-[260px]"
                                type="tel" placeholder="(**) *****-****" value={values.tel} />
                            <span className="min-h-[16px]" />
                        </div>
                        <div className="grid">
                            <label htmlFor="senha">Senha:</label>
                            <input id="senha" name="senha" onChange={handleChange} className="border  border-gray-400  h-10 rounded-sm w-[260px]"
                                type="password" placeholder="Senha" value={values.senha} />
                            <span className="text-[.6em] min-h-[16px]  text-red-700 ">{errors.senha}</span>
                        </div>
                        <div className="grid">
                            <label htmlFor="confirma_senha">Senha:</label>
                            <input id="confirma_senha" name="confirma_senha" onChange={handleChange} className="border  border-gray-400  h-10 rounded-sm w-[260px] "
                                type="password" placeholder="Confirme sua senha" value={values.confirma_senha} />
                            <span className="text-[.6em] min-h-[16px]  text-red-700 ">{errors.confirma_senha}</span>
                        </div>
                        <div className="grid">
                            <label htmlFor="estado">Estado:</label>
                            <select id="estado" name="idEstado" onChange={(event) => selecionarEstado(event.target.value)} className="border border-gray-400  h-10 rounded-sm">
                                <option value="">Todos</option>
                                {renderizarOptionEstados()}
                            </select>
                            <span className="text-[.6em] min-h-[16px]  text-red-700 ">{errors.idEstado}</span>
                        </div>
                        <div className="grid">
                            <label htmlFor="cidade">Cidade:</label>
                            <select id="cidade" name="idCidade" onChange={handleChange} className="border border-gray-400  h-10 rounded-sm" value={values.idCidade}>
                                <option value="">Todos</option>
                                {renderizarOptionsCidade()}
                            </select>
                            <span className="text-[.6em] min-h-[16px]  text-red-700 ">{errors.idCidade}</span>
                        </div>
                        <div className="grid">
                            <label htmlFor="pcd">Você é PCD?:</label>
                            <select id="pcd" name="pcd" className="border border-gray-400  h-10 rounded-sm"
                                onChange={() => values.pcd = !values.pcd}>
                                <option>NÃO</option>
                                <option>SIM</option>
                            </select>
                        </div>
                        <div className="grid">
                            <label htmlFor="sexo">Sexo:</label>
                            <select id="sexo" name="sexo" onChange={handleChange} className="border border-gray-400  h-10 rounded-sm " value={values.sexo}>
                                <option>MASCULINO</option>
                                <option>FEMININO</option>
                            </select>
                        </div>
                        <div className="grid">
                            <label htmlFor="trabalhando">Está empregado?:</label>
                            <select id="trabalhando" name="trabalhando" className="border border-gray-400  h-10 rounded-sm"
                                onChange={() => values.trabalhando = !values.trabalhando}>
                                <option>NÃO</option>
                                <option>SIM</option>
                            </select>
                            <span className=" min-h-[16px]">{}</span>
                        </div>
                        <div className="grid">
                            <label htmlFor="dataNascimento">Data de nascimento:</label>
                            <input id="dataNascimento" name="dataNascimento" onChange={handleChange} className="h-10 rounded-sm border"
                                type="date" placeholder="Senha" />
                            <span className="text-[.6em] min-h-[16px]  text-red-700 ">{errors.dataNascimento}</span>
                        </div>
                    </div>
                    <h3>Adicione suas formações <span className="text-[.6em]">(Opcional/Importante)</span></h3>
                    <i onClick={() => setAddFormacao(!addFormacao)} className="material-symbols cursor-pointer">{addFormacao ? "done" : "add"}</i>
                    {addFormacao && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-fit">
                                <div className="grid">
                                    <input id="fInstituicao" type="text" placeholder="Instituição"
                                        className="h-8 rounded-md border" />
                                </div>
                                <div className="grid">
                                    <input id="fCurso" type="text" placeholder="Curso"
                                        className="h-8 rounded-sm border" />
                                </div>
                                <div className="grid">
                                    <label htmlFor="fNivel" className="">Nivel: </label>
                                    <select className="border  h-9 rounded-sm" id="fNivel">
                                        <option>TECNICO </option>
                                        <option>TECNOLOGO </option>
                                        <option>GRADUACAO </option>
                                        <option>POS_GRADUACAO </option>
                                        <option>MESTRADO </option>
                                        <option>DOUTORADO </option>
                                    </select>
                                </div>
                                <div className="grid">
                                    <label htmlFor="fSituacao" className="">Situação: </label><div />
                                    <select className="border h-9 rounded-sm" id="fSituacao">
                                        <option value="CONCLUIDO">Concluido</option>
                                        <option value="EM_ANDAMENTO">Em andamento</option>
                                    </select>
                                </div>
                                <div className="" >
                                    <div className="w-36 h-9 flex flex-col justify-center border text-center  rounded-md cursor-pointer" onClick={adicionarFormacao}>Adicionar</div>
                                </div>
                            </div>
                            {renderizarFormacoes()}
                        </>
                    )}

                    <h3>Suas experiencia <span className="text-[.6em]">(Opcional/Importante)</span></h3>
                    <i onClick={() => setAddExperiencia(!addExperiencia)} className="material-symbols cursor-pointer">{addExperiencia ? "done" : "add"}</i>
                    {addExperiencia && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-fit">
                                <div>
                                    <input id="eEmpresa" type="text" placeholder="Empresa" className="w-[210px] h-8 rounded-sm border" />
                                </div>
                                <div>
                                    <input id="eCargo" type="text" placeholder="Cargo" className="w-[210px] h-8 rounded-sm border" />

                                </div>
                                <div className="grid">
                                    <label htmlFor="eDuracao">Duração:</label>
                                    <input id="eDuracao" type="text" placeholder="Ex: 1 ano e 7 meses"
                                        className=" h-8 rounded-sm border" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 pt-10">
                                <label htmlFor="eDescricao">Descrição:</label>
                                <textarea id="eDescricao" placeholder="Descrição" className="rounded-lg mt-3 h-32 pl-1 mb-5" />
                            </div>

                            <div className="">
                                <div className="m-auto w-36 h-9 flex flex-col justify-center border text-center  rounded-md cursor-pointer" onClick={adicionarExperiencia}>Adicionar</div>
                            </div>
                            {renderizarExperiencias()}
                        </>

                    )}
                    <h3>Cursos complementares <span className="text-[.6em]">(Opcional)</span></h3>
                    <i onClick={() => setAddCurso(!addCurso)} className="material-symbols cursor-pointer">{addCurso ? "done" : "add"}</i>
                    {addCurso && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-fit">
                                <div className="grid">
                                    <label htmlFor="cInstituicao">Instituição:</label>
                                    <input id="cInstituicao" type="text" placeholder="Instituição" className="h-8 w-[220px] border" />
                                </div>
                                <div className="grid">
                                    <label htmlFor="cCurso">Curso:</label>
                                    <input id="cCurso" type="text" placeholder="Nome do curso" className="h-8 w-[220px] border" />
                                </div>
                                <input id="cCargaHoraria" type="number" placeholder="Carga horária" className="h-8 w-[220px] border" />
                                <div className="w-36 h-8  flex flex-col justify-center border text-center rounded-sm cursor-pointer" onClick={adicionarCurso}>Adicionar</div>
                            </div>
                            {renderizarCurso()}
                        </>
                    )
                    }
                    <h3>Qualificações <span className="text-[.6em]">(Opcional/Importante)</span></h3>
                    <i onClick={() => setAddQualificacoes(!addQualificacoes)} className="material-symbols cursor-pointer">{addQualificacoes ? "done" : "add"}</i>
                    {addQualificacoes && (
                        <>
                            <div className="grid  gap-2 w-fit">
                                <div className="grid ">
                                    <label htmlFor="nivel">Nivel:</label>
                                    <select className="border border-gray-500 pl-2 w-fit h-8" id="nivel" onChange={handleChange}>
                                        <option value="BASICO">Básico</option>
                                        <option value="INTERMEDIARIO">Intermediario</option>
                                        <option value="INTERMEDIARIO">Avançado</option>
                                    </select>
                                </div>
                                <div className=" relative">
                                    <div className="grid relative">

                                        <label htmlFor="nome_qualificacao">Qualificação:</label>
                                        <input onChange={(event) => buscarQualificacoes(event.target.value)} id="nome_qualificacao" type="text" placeholder="Busque aqui" className="w-[210px] rounded-md h-8 border" />
                                    </div>
                                    <div className={`border border-gray-200 w-[210px] absolute top-[100%] z-10  bg-white `}>
                                        {renderizarQUalificacoesEncontradas()}
                                    </div>
                                </div>
                            </div>
                            <div className="w-36 h-9 flex flex-col justify-center border text-center my-5 rounded-md cursor-pointer" onClick={selecionarQualificacao}>Adicionar</div>

                            <div className=" text-nowrap flex gap-x-3 px-4 overflow-x-auto ">
                                {renderizarQualificacoes()}
                            </div>
                        </>
                    )
                    }

                    <div className="grid grid-cols-1 pt-10">
                        <label htmlFor="descricao">Descrição:</label>
                        <textarea id="descricao" name="descricao" placeholder="Fale sobre seu eu profissional" className="rounded-lg mt-3 h-32 sm:h-56 pl-1 " value={values.descricao} onChange={handleChange} />
                        <span className="text-[.6em] min-h-[16px]  text-red-700 ">{errors.descricao}</span>
                        <input type="submit" value="Enviar" className="cursor-pointer w-[230px] h-10  border rounded-lg text-white bg-gray-800 mt-16 m-auto" />
                    </div>
                </form>
            </main>


            <footer className="border mt-20 h-40"></footer>
        </div>

    )
}