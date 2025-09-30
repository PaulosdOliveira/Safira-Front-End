'use client'

import { useFormik } from "formik"
import { dadosCadastroEmpresa, dadosFormCadastroEmpresa, validation, valoresIniciais } from "./formSchema"
import { useState } from "react"
import { ServicoEmpresa } from "@/resources/empresa/sevico";
import { accessToken, dadosLogin, ServicoSessao } from "@/resources/sessao/sessao";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";


export default function cadastroEmpresa() {

    const [urlFoto, setUrlFoto] = useState<string>("");
    const service = ServicoEmpresa();
    const sessaoService = ServicoSessao();
    const { handleChange, handleSubmit, values, errors } = useFormik<dadosFormCadastroEmpresa>({
        initialValues: valoresIniciais,
        onSubmit: submit,
        validationSchema: validation
    })

    function capturarFoto(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const foto = event.target.files[0];
            values.foto = foto;
            setUrlFoto(URL.createObjectURL(foto));
        }

    }

    async function submit() {
        const resposta = await service.cadastrar(values);
        if (resposta.status !== 200) alert(resposta.erro);
        else {
            const dados: dadosLogin = { login: values.cnpj, senha: values.senha }
            alert("OOOOOOOO")
            const token: accessToken = await service.logar(dados);
            alert(token.token + ": Token")
            sessaoService.criarSessao(token);
            if (values.foto)
                service.salvarFotoEmpresa(values.foto, token.token + "");
        }
    }

    return (
        <div className="bg-gray-50">
            <Header logado={false} />
            <div className="border border-gray-400 bg-white shadow-lg w-full sm:w-[660px] px-10 m-auto mt-16 text-center rounded-sm py-8 font-[arial] mb-16">
                <h1 className="my-5">Cadastro PJ</h1>
                <form onSubmit={handleSubmit} className="">
                    <div style={{ backgroundImage: `url(${urlFoto})` }} className=" w-32 h-32 mb-5 flex m-auto bg-cover rounded-full border border-gray-400">
                        <label className=" w-full cursor-pointer ">
                            <input id="foto" onChange={capturarFoto} type="file" className="hidden" />
                        </label>
                    </div>
                    <label className="bg-gray-900 p-2 rounded-md text-white cursor-pointer" htmlFor="foto">Seleione uma foto</label><br/>
                    <span className="text-[.6em] h-3 text-red-700 m-auto ">{errors.foto}</span>

                    <div className="grid sm:grid-cols-2 gap-x-4">
                        <div className="grid gap-x-3   text-left mt-14">
                            <label className="pl-1">Email:<strong className="text-red-700">*</strong></label>
                            <input className="h-10 rounded-lg pl-2 border" id="email" onChange={handleChange} type="email" placeholder="Email" />
                            <span className="text-[.6em]  h-3  text-red-700 m-auto ">{errors.email}</span>
                        </div>
                        <div className="grid mt-14 gap-x-3 text-left">
                            <label className="">CPNJ:<strong className="text-red-700">*</strong></label>
                            <input className="h-10 rounded-lg pl-2 border" id="cnpj" onChange={handleChange} type="text" placeholder="CNPJ" />
                            <span className="text-[.6em] h-3 text-red-700 m-auto ">{errors.cnpj}</span>
                        </div>

                        <div className="grid mt-9 gap-x-3 text-left">
                            <label className="pl-1">Razão social:<strong className="text-red-700">*</strong></label>
                            <input className="h-10 rounded-lg pl-2 border" id="nome" onChange={handleChange} type="text" placeholder="Razão social" />
                            <span className="text-[.6em] h-3 text-red-700 m-auto ">{errors.nome}</span>
                        </div>

                        <div className="grid  mt-9 gap-x-3 text-left">
                            <label className="pl-1">Senha:<strong className="text-red-700">*</strong></label>
                            <input className="h-10 rounded-lg pl-2 border" id="senha" onChange={handleChange} type="password" placeholder="Crie uma senha" />
                            <span className="text-[.6em] h-3 text-red-700 m-auto ">{errors.senha}</span>
                        </div>

                        <div className="grid mt-9 gap-x-3 text-left">
                            <label htmlFor="confirma_senha" className="pl-1" >Confirme sua senha:<strong className="text-red-700">*</strong></label>
                            <input className="h-10 rounded-lg pl-2 border" id="confirma_senha" onChange={handleChange} type="password" placeholder="Repita a senha" />
                            <span className="text-[.6em] h-3 text-red-700 m-auto ">{errors.senha}</span>
                        </div>
                    </div>
                    <div className="grid gap-3 my-14 text-left">
                        <label className="">Descrição:</label>
                        <textarea id="descricao" onChange={handleChange} spellCheck={true} lang="pt-br"
                            placeholder="Crie uma descrição para o perfil da empresa" className="border pl-1 rounded-sm h-[20vh] w-[100%] m-auto" />
                    </div>
                    <input className=" h-10 rounded-full w-[270px]  text-white bg-gray-900 px-2 cursor-pointer" type="submit" value="Cadastrar" />
                </form>
            </div>
            <Footer />
        </div>
    )

}
