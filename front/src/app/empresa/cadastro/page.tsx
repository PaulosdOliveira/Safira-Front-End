'use client'

import { useFormik } from "formik"
import { dadosCadastroEmpresa, dadosFormCadastroEmpresa, validation, valoresIniciais } from "./formSchema"
import { useState } from "react"
import { ServicoEmpresa } from "@/resources/empresa/sevico";
import { accessToken, dadosLogin, ServicoSessao } from "@/resources/sessao/sessao";


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
        <>
            <div className="border border-gray-400 w-[66vw] m-auto mt-16 text-center rounded-sm py-8">
                <form onSubmit={handleSubmit} className="">
                    <div style={{ backgroundImage: `url(${urlFoto})` }} className=" w-24 h-24  flex m-auto bg-contain ">
                        <label className="border border-gray-500 w-full cursor-pointer rounded-full">

                            <input id="foto" onChange={capturarFoto} type="file" className="hidden" />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 mt-9">
                        <input id="cnpj" onChange={handleChange} type="text" placeholder="CNPJ" />
                        <input id="nome" onChange={handleChange} type="text" placeholder="Razão social" />
                    </div>
                    <div className="grid grid-cols-2 input-box">
                        <input id="email" onChange={handleChange} type="email" placeholder="Email" />
                        <input id="senha" onChange={handleChange} type="password" placeholder="Senha" />
                    </div>
                    <div className="grid grid-cols-1 input-box">
                        <textarea id="descricao" onChange={handleChange} spellCheck={true} lang="pt-br"
                            placeholder="Descrição" className="border border-gray-400 h-[20vh] w-[50vw] m-auto" />
                    </div>
                    <input className="px-2 cursor-pointer" type="submit" value="Cadastrar-se" />
                </form>
            </div>
        </>
    )

}
