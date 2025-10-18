'use client'

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CandidatoService } from "@/resources/candidato/servico"
import { accessToken, dadosLogin, formLoginValidator, ServicoSessao, valoresIniciais } from "@/resources/sessao/sessao";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";


export default function LoginPageCandidato() {


    const service = CandidatoService();
    const sessao = ServicoSessao();
    const router = useRouter();
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
        if (token.token) {
            await sessao.criarSessao(token);
            router.push("/");
        }

    }


    return (
        <div className="w-full flex flex-col min-h-screen">
            <Header />
            <main className="w-full  flex-1/2  bg-slate-100  py-20 sm:px-0 px-1">
                <div className="sm:border border-gray-400 sm:bg-white w-full sm:w-[460px] rounded-2xl max-h-screen m-auto py-9 font-[arial]">
                    <h2 className="text-center">Bem vindo de volta!</h2>
                    <form onSubmit={handleSubmit} className="text-center">
                        <div className="mt-8">
                            <label className="w-[280px] mb-1 m-auto block text-left" htmlFor="login">Email ou CPF:</label>
                            <input id="login" onChange={handleChange} className="w-[290px] h-10 rounded-full pl-3 border border-gray-500 bg-white" type="text" placeholder="Login" />
                        </div>
                        <div className="my-3">
                            <label className="w-[280px] mb-1 m-auto block text-left" htmlFor="login">Senha:</label>
                            <input id="senha" onChange={handleChange} className="w-[290px] h-10 rounded-full pl-3 border border-gray-500 bg-white" type="password" placeholder="Senha" />
                        </div>

                        <div className="text-center my-10">
                            <input className="bg-gray-900  text-white w-[290px] h-10 rounded-full pl-3 text-center pr-1.5 cursor-pointer" type="submit" value="Entrar" />
                        </div>
                        <a href="#" className="hover:underline">Esqueceu a senha?</a><br /><br />
                        <a href="/candidato/cadastro" className="hover:underline">Criar conta</a>
                        <a href="/empresa/login" className="hover:underline block mt-2">Login para empresas</a>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    )
}