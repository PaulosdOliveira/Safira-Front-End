'use client'
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
            <header className=" h-[120px] shadow-sm shadow-gray-200 flex flex-col justify-end items-center py-2 z-10">
                <div className="w-80 h-20  bg-cover"
                style={{ backgroundPosition: "center center",
                    backgroundImage: `url(${"https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-ab98-622f-8ea1-1a044a1eed60/raw?se=2025-08-31T07%3A05%3A54Z&sp=r&sv=2024-08-04&sr=b&scid=4b3e33c9-b272-5a86-be4d-694409c802f2&skoid=c953efd6-2ae8-41b4-a6d6-34b1475ac07c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-08-31T00%3A48%3A05Z&ske=2025-09-01T00%3A48%3A05Z&sks=b&skv=2024-08-04&sig=GTnYTKvKp65xR6pok4gX2vzXaWr%2Bzi0N70zb8gXkMss%3D"})`}}/>
                <nav className="w-[100%]">
                    <ul className="text-gray-950 text-right">
                        <li className="inline-block hover:underline pr-4 pb-1"><a target="_self" href="/candidato/login">Login para candidatos</a></li>
                    </ul>
                </nav>
            </header>
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
        </div>
    )
}