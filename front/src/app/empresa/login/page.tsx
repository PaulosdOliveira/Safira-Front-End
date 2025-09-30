'use client'
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ServicoEmpresa } from "@/resources/empresa/sevico"
import { accessToken, dadosLogin, formLoginValidator, ServicoSessao, valoresIniciais } from "@/resources/sessao/sessao"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"

export default function loginEmpresa() {

    const { handleChange, handleSubmit, errors, values } = useFormik<dadosLogin>({
        initialValues: valoresIniciais,
        onSubmit: submit,
        validationSchema: formLoginValidator
    })
    const service = ServicoEmpresa();
    const sessao = ServicoSessao();
    const router = useRouter();

    async function submit() {
        const token: accessToken = await service.logar(values);
        if (token) {
            sessao.criarSessao(token);
            router.push("/");
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-[rgb(249,249,249)]">
            <Header logado={false} />
            <main className=" h-full w-full font-[arial]  flex-1/2 py-10 ">
                <div className="py-16">
                    <h1 className="text-center">Bem vindo de volta!</h1>
                    <form onSubmit={handleSubmit} className="grid gap-4 pt-7">
                        <div className="grid gap-1 justify-center">
                            <label>Login:</label>
                            <input className="w-[300px] pl-3 rounded-lg bg-white  h-10 border border-gray-400" name="login" type="text" placeholder="Email ou CNPJ" onChange={handleChange} />
                        </div>

                        <div className="grid gap-1 justify-center">
                            <label>Senha:</label>
                            <input className="w-[300px] rounded-lg pl-4 m-auto h-10 bg-white border border-gray-400" name="senha" type="password" placeholder="Digite sua senha" onChange={handleChange} /><br />
                        </div>
                        <input className="w-[300px] rounded-full  h-10 cursor-pointer m-auto bg-black text-white" type="submit" value="Entrar" />
                        <p className="text-center cursor-pointer hover:underline">Esqueceu a senha?</p>
                    </form>
                    <p onClick={() => router.push("/empresa/cadastro")} className="text-center cursor-pointer hover:underline mt-4">Criar conta</p>
                    <a href="/candidato/login" className="text-center text-blue-700 block cursor-pointer hover:underline mt-4">Login para candidatos</a>
                </div>
            </main>
            <Footer />
        </div>
    )
}