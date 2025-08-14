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
        <main className="h-[100vh] w-[100vw]">
            <div className="form border border-gray-400 w-64 pb-5 m-auto rounded-md bg-gray-50 shadow-lg shadow-gray-300 mt-20">
                <form onSubmit={handleSubmit} className="grid gap-4 pt-7">
                    <input className="w-56 m-auto h-10" name="login" type="text" placeholder="Email ou CNPJ" onChange={handleChange} />
                    <input className="w-56 m-auto h-10" name="senha" type="password" placeholder="Digite sua senha" onChange={handleChange} /><br />
                    <input className="cursor-pointer w-20 m-auto bg-black text-white rounded-lg" type="submit" value="Entrar" />
                </form>
            </div>
        </main>
    )
}