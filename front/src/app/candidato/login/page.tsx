'use client'

import { CandidatoService } from "@/resources/candidato/servico"
import { accessToken, dadosLogin, formLoginValidator, ServicoSessao, valoresIniciais } from "@/resources/sessao/sessao";
import { useFormik } from "formik";


export default function candidatoLoginPage() {


    const service = CandidatoService();
    const sessao = ServicoSessao();
    const { handleChange, errors, handleSubmit, values } = useFormik<dadosLogin>({
        initialValues: valoresIniciais,
        onSubmit: submit,
        validationSchema: formLoginValidator
    })

    async function submit() {
        const dados: dadosLogin =
        {
            login: values.login,
            senha: values.senha

        }
        const token: accessToken = await service.logar(dados);
        await sessao.criarSessao(token);

    }


    return (
        <>
            <div className="border border-gray-700 w-80 max-h-screen m-auto mt-36 rounded-sm py-9">
                <form onSubmit={handleSubmit} className="text-center">
                    <div className="input-box">
                        <label className=" block text-left pl-8" htmlFor="login">Email ou CPF</label>
                        <input id="login" onChange={handleChange} className="w-64" type="text" placeholder="Login" />
                    </div>

                    <div className="input-box">
                        <label className=" block text-left pl-8" htmlFor="login">Senha</label>
                        <input id="senha" onChange={handleChange} className="w-64" type="password" placeholder="Senha" />
                    </div>

                    <div className="text-center">
                        <input className="bg-gray-700  text-white w-44 text-center pr-1.5 cursor-pointer" type="submit" value="Entrar" />
                    </div>
                </form>

            </div>

        </>
    )
}