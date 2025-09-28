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
        <div className="h-[100vh] w-[100vw]">
            <Header logado={false}/>
            <main className=" h-[100vh] w-[100vw] font-[arial] bg-transparent   pt-10">

                <div className="w-[500px] h-[470px] rounded-lg border border-gray-400  shadow-lg shadow-gray-200 py-16  bg-white m-auto">
                    <h1 className="text-center">Bem vindo de volta!</h1>
                    <form onSubmit={handleSubmit} className="grid gap-4 pt-7">
                        <input className="w-[300px]  rounded-full pl-4 m-auto h-10" name="login" type="text" placeholder="Email ou CNPJ" onChange={handleChange} />
                        <input className="w-[300px] rounded-full pl-4 m-auto h-10" name="senha" type="password" placeholder="Digite sua senha" onChange={handleChange} /><br />
                        <input className="w-[300px] rounded-full  h-10 cursor-pointer m-auto bg-black text-white" type="submit" value="Entrar" />
                        <p className="text-center cursor-pointer hover:underline">Esqueceu a senha?</p>
                    </form>
                    <p onClick={() => router.push("/empresa/cadastro")} className="text-center cursor-pointer hover:underline mt-4">Criar conta</p>
                </div>
            </main>
            <Footer/>
        </div>
    )
}