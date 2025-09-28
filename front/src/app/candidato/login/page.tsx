'use client'

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CandidatoService } from "@/resources/candidato/servico"
import { accessToken, dadosLogin, formLoginValidator, ServicoSessao, valoresIniciais } from "@/resources/sessao/sessao";
import { useFormik } from "formik";


export default function LoginPageCandidato() {


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
            <Header />
            <main className="h-[90vh] w-[100vw] bg-stone-50 pt-20">

                <div className="border border-gray-400 bg-white w-[470px] max-h-screen m-auto  rounded-sm py-9 font-[arial]">
                    <h1 className="text-center">Bem vindo de volta!</h1>
                    <form onSubmit={handleSubmit} className="text-center">
                        <div className="mt-8">
                            <label className="w-[280px] mb-1 m-auto block text-left" htmlFor="login">Email ou CPF:</label>
                            <input id="login" onChange={handleChange} className="w-[290px] h-10 rounded-full pl-3 border border-gray-500" type="text" placeholder="Login" />
                        </div>

                        <div className="my-3">
                            <label className="w-[280px] mb-1 m-auto block text-left" htmlFor="login">Senha:</label>
                            <input id="senha" onChange={handleChange} className="w-[290px] h-10 rounded-full pl-3 border border-gray-500" type="password" placeholder="Senha" />
                        </div>

                        <div className="text-center my-10">
                            <input className="bg-gray-900  text-white w-[290px] h-10 rounded-full pl-3 text-center pr-1.5 cursor-pointer" type="submit" value="Entrar" />
                        </div>
                        <a href="#" className="hover:underline">Esqueceu a senha?</a><br /><br />
                        <a href="/candidato/cadastro" className="hover:underline">Criar conta</a>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    )
}