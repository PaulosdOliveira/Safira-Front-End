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
    const { handleChange, handleSubmit, values } = useFormik<dadosFormCadastroEmpresa>({
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
        const dadosCadastrais: dadosCadastroEmpresa = {
            cnpj: values.cnpj,
            descricao: values.descricao,
            email: values.email,
            nome: values.nome,
            senha: values.senha
        }
        const resposta = await service.cadastrar(dadosCadastrais);
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
        <Header logado={false}/>
            <div className="border border-gray-300 bg-white shadow w-full sm:w-[660px] px-10 m-auto mt-16 text-center rounded-sm py-8 font-[arial] mb-16">
                <h1 className="my-5">Cadastro PJ</h1>
                <form onSubmit={handleSubmit} className="">
                    <div style={{ backgroundImage: `url(${urlFoto})` }} className=" w-32 h-32 mb-5 flex m-auto bg-cover rounded-full border border-gray-400">
                        <label className=" w-full cursor-pointer ">
                            <input id="foto" onChange={capturarFoto} type="file" className="hidden" />
                        </label>
                    </div>
                    <label className="bg-gray-900 p-2 rounded-md text-white cursor-pointer" htmlFor="foto">Seleione uma foto</label>
                    <div className="grid gap-3 w-[50%] m-auto text-left mt-8">
                        <label className="pl-3">CPNJ:</label>
                        <input className="h-10 rounded-lg pl-2" id="cnpj" onChange={handleChange} type="text" placeholder="CNPJ" />
                    </div>
                    <div className="grid grid-cols-2 mt-9 gap-3 text-left">
                        <label className="pl-3">Email:</label>
                        <label className="pl-3">Razão social:</label>
                        <input className="h-10 rounded-full pl-2" id="email" onChange={handleChange} type="email" placeholder="Email" />
                        <input className="h-10 rounded-full pl-2" id="nome" onChange={handleChange} type="text" placeholder="Razão social" />
                    </div>
                    <div className="grid grid-cols-2 mt-9 gap-3 text-left">
                        <label className="pl-3">Email:</label>
                        <label htmlFor="confirma_senha" className="pl-3" >Confirme sua senha:</label>
                        <input className="h-10 rounded-full pl-2" id="senha" onChange={handleChange} type="password" placeholder="Crie uma senha" />
                        <input className="h-10 rounded-full pl-2" id="confirma_senha" onChange={handleChange} type="password" placeholder="Repita a senha" />
                    </div>
                    <div className="grid gap-3 my-14 text-left">
                        <label className="">Descrição:</label>
                        <textarea id="descricao" onChange={handleChange} spellCheck={true} lang="pt-br"
                            placeholder="Crie uma descrição para o perfil da empresa" className="border border-gray-400 h-[20vh] w-[100%] m-auto" />
                    </div>
                    <input className=" h-10 rounded-full w-[270px]  text-white bg-gray-900 px-2 cursor-pointer" type="submit" value="Cadastrar-se" />
                </form>
            </div>
            <Footer/>
        </div>
    )

}
