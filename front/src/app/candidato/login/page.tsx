'use client'

import { Footer } from "@/components/footer";
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
            <header className=" h-[120px] shadow-sm shadow-gray-200 flex flex-col justify-end items-center py-2 z-10">
                <div className="w-80 h-20  bg-cover"
                    style={{
                        backgroundPosition: "center center",
                        backgroundImage: `url(${"https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-ab98-622f-8ea1-1a044a1eed60/raw?se=2025-08-31T07%3A05%3A54Z&sp=r&sv=2024-08-04&sr=b&scid=4b3e33c9-b272-5a86-be4d-694409c802f2&skoid=c953efd6-2ae8-41b4-a6d6-34b1475ac07c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-08-31T00%3A48%3A05Z&ske=2025-09-01T00%3A48%3A05Z&sks=b&skv=2024-08-04&sig=GTnYTKvKp65xR6pok4gX2vzXaWr%2Bzi0N70zb8gXkMss%3D"})`
                    }} />
                <nav className="w-[100%]">
                    <ul className="text-gray-950 text-right">
                        <li className="inline-block hover:underline pr-4 pb-1"><a target="_self" href="/empresa/login">Login para empresas</a></li>
                    </ul>
                </nav>
            </header>
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
            <Footer/>
        </>
    )
}