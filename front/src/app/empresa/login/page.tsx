'use client'
import "@/app/styles/login-empresa.css"
import { ServicoEmpresa } from "@/resources/empresa/sevico"
import { accessToken, dadosLogin, formLoginValidator, ServicoSessao, valoresIniciais } from "@/resources/sessao/sessao"
import { Form, useFormik } from "formik"

export default function loginEmpresa() {

    const { handleChange, handleSubmit, errors, values } = useFormik<dadosLogin>({
        initialValues: valoresIniciais,
        onSubmit: submit,
        validationSchema: formLoginValidator
    })
    const service = ServicoEmpresa();
    const sessao = ServicoSessao();

    async function submit() {
        const login: dadosLogin = { login: values.login, senha: values.senha };
        const token: accessToken = await service.logar(login);
        sessao.criarSessao(token);
    }

    return (
        <main className="h-[100vh] w-[100vw]">
            <div className="form border border-gray-400 w-64 h-44 m-auto rounded-md bg-gray-50 shadow-lg shadow-gray-300">
                <form onSubmit={handleSubmit}>
                    <input name="login" type="text" placeholder="Email ou CNPJ" onChange={handleChange} />
                    <input name="senha" type="password" placeholder="Digite sua senha" onChange={handleChange} />
                    <input className="cursor-pointer" type="submit" value="Entrar" />
                </form>
            </div>
        </main>
    )
}