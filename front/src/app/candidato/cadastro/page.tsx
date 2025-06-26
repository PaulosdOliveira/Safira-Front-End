'use client'
import { useFormik } from "formik"
import { dadosCadastroCandidato, dadosFormulario, formValidation, valoresIniciais } from "./formSchema"
import { useState } from "react";
import { candidatoService } from "@/resources/candidato/servico";
import { accessToken, dadosLogin, ServicoSessao } from "@/resources/sessao/sessao";




export default function cadastroCandidato() {

    const [urlFoto, setUrlFoto] = useState<string>("");
    const [nomePdf, setNomePdf] = useState<string>("Selecionar");
    const [urlPdf, setUrlPdf] = useState<string | null>(null);
    const service = candidatoService();
    const sessaoService = ServicoSessao();
    const { errors, handleChange, handleSubmit, values } = useFormik<dadosFormulario>({
        initialValues: valoresIniciais,
        onSubmit: submit,
        validationSchema: formValidation
    })


    //------->>> SUBMIT <<< ----------------------------
    async function submit() {

        const dadosCadastrais: dadosCadastroCandidato =
        {
            cep: values.cep, cpf: values.cpf, email: values.email,
            nome: values.nome, pcd: values.pcd, senha: values.senha,
            sexo: values.sexo, trabalhando: values.trabalhando, descricao: values.descricao
        };
        const resultado = await service.cadastrar(dadosCadastrais);


        if (resultado.status === 201) {
            alert("Cadastro realizado com sucesso")
            const login: dadosLogin = {
                login: values.email,
                senha: values.senha
            }
            const token: accessToken = await service.logar(login);
            await service.salvarFoto(values.foto, token.token + '');
            await sessaoService.criarSessao(token);
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


    return (
        <>

            <div className="border border-red-600 w-[60%] m-auto mt-30 p-5 rounded-lg">
                <form onSubmit={handleSubmit}
                    className=" w-[auto] grid grid-cols-2">

                    <input name="cpf" onChange={handleChange} className="border  border-black m-auto"
                        type="text" placeholder="CPF" value={values.cpf} />

                    <input name="nome" onChange={handleChange} className="border  border-black m-auto"
                        type="text" placeholder="Nome completo" value={values.nome} />

                    <input name="email" onChange={handleChange} className="border  border-black m-auto"
                        type="email" placeholder="Email" value={values.email} />

                    <input name="senha" onChange={handleChange} className="border  border-black m-auto"
                        type="password" placeholder="Senha" value={values.senha} />

                    <select name="sexo" onChange={handleChange} className="border rounded-sm p-1" value={values.sexo}>
                        <option>MASCULINO</option>
                        <option>FEMININO</option>
                    </select>

                    <div className="border w-48 ml-2">
                        <h2 className="inline-block">PCD?</h2>
                        <label>
                            <input onClick={() => values.pcd = true}
                                type="radio" name="pcd" value="true" className="appearance-auto"></input>
                            Sim
                        </label>

                        <label>
                            <input
                                onClick={() => values.pcd = false} className="appearance-auto"
                                type="radio" name="pcd" value="false"></input>
                            Não
                        </label>
                    </div>

                    <input name="tel" onChange={handleChange} className="border  border-black m-auto"
                        type="tel" placeholder="(**) *****-****" value={values.tel} />

                    <input name="cep" onChange={handleChange} className="border  border-black m-auto"
                        type="text" placeholder="Cep" value={values.cep} />


                    <div className="border w-48 ml-2">
                        <h2 className="inline-block">Trabalha?</h2>
                        <label>
                            <input onChange={() => values.trabalhando = true}
                                type="radio" name="trabalhando"  ></input>
                            Sim
                        </label>

                        <label>
                            <input onChange={() => values.trabalhando = false}
                                type="radio" name="trabalhando" ></input>
                            Não
                        </label>
                    </div>

                    <label style={{ backgroundImage: `url(${urlFoto})` }} className="cursor-pointer  h-20 w-20 rounded-full ml-12 border bg-cover ">
                        <input name="foto" onChange={capturarFoto} className="hidden" type="file" />
                    </label>

                    <label className="cursor-pointer text-center pt-3  h-13 w-40 rounded-sm ml-6 mt-2 border">
                        {nomePdf}
                        <input name="curriculo" onChange={selecionarPdf} className="hidden" type="file" accept="application/pdf" />
                    </label>
                    <textarea name="descricao" className="border border-gray-400 mt-3" value={values.descricao} onChange={handleChange} />
                    <input type="submit" value="Enviar" className="cursor-pointer" />
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

        </>

    )
}