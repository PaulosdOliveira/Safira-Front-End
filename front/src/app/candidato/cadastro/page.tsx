'use client'
import { useFormik } from "formik"
import { dadosCadastroCandidato, formValidation, valoresIniciais } from "./formSchema"
import { useState } from "react";
import { candidatoService } from "@/resources/candidato/servico";





export default function cadastroCandidato() {

    const [curriculo, setCurriculo] = useState<File | null>(null);
    const [foto, setFoto] = useState<File | null>(null);
    const [urlFoto, setUrlFoto] = useState<string>("");
    const [urlPdf, setUrlPdf] = useState<string | null>(null);
    const service = candidatoService();
    const { errors, handleChange, handleSubmit, values } = useFormik<dadosCadastroCandidato>({
        initialValues: valoresIniciais,
        onSubmit: submit,
        validationSchema: formValidation
    })

    async function submit() {
        
        const dadosCadastrais: dadosCadastroCandidato =
        {
            cep: values.cep, cpf: values.cpf, email: values.email,
            nome: values.nome, pcd: values.pcd, senha: values.senha,
            sexo: values.sexo, trabalhando: values.trabalhando, descricao: values.descricao
        };

        
        await service.cadastrar(dadosCadastrais);
    }


    // Captarando arquivo selecionado
    function capturarFoto(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const foto = event.target.files[0];
            const url = URL.createObjectURL(foto);
            setUrlFoto(url);
            //values.foto = foto;
        }
    }


    function selecionarPdf(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const url = URL.createObjectURL(event.target.files[0]);
            setUrlPdf(url);
        }
    }


    return (
        <>

            <div className="border border-red-600 w-[60%] m-auto mt-30 p-5 rounded-lg">
                <form onSubmit={handleSubmit}
                    className=" w-[auto] grid grid-cols-2">

                    <input name="cpf" onChange={handleChange} className="border  border-black m-auto"
                        type="text" placeholder="CPF" value={values.cpf} />

                    <input name="nome" onChange={handleChange} className="border  border-black m-auto"
                        type="text" placeholder="Nome completo" value={values.nome} />

                    <input name="email" onChange={handleChange} className="border  border-black m-auto"
                        type="email" placeholder="Email" value={values.email} />

                    <input name="senha" onChange={handleChange} className="border  border-black m-auto"
                        type="password" placeholder="Senha" value={values.senha} />

                    <select name="sexo" onChange={handleChange} className="border rounded-sm p-1" value={values.sexo}>
                        <option>MASCULINO</option>
                        <option>FEMININO</option>
                    </select>

                    <div className="border w-48 ml-2">
                        <h2 className="inline-block">PCD?</h2>
                        <label>
                            <input onClick={() => values.pcd = true} 
                            type="radio" name="pcd" value="true" className="appearance-auto"></input>
                            Sim
                        </label>

                        <label>
                            <input
                             onClick={ () => values.pcd = false}  className="appearance-auto"
                             type="radio" name="pcd" value="false"></input>
                            Não
                        </label>
                    </div>

                    <input name="tel" onChange={handleChange} className="border  border-black m-auto"
                        type="tel" placeholder="(**) *****-****" value={values.tel} />

                    <input name="cep" onChange={handleChange} className="border  border-black m-auto"
                        type="text" placeholder="Cep" value={values.cep} />


                    <div className="border w-48 ml-2">
                        <h2 className="inline-block">Trabalha?</h2>
                        <label>
                            <input  onChange={() => values.trabalhando = true}
                            type="radio" name="trabalhando"  ></input>
                            Sim
                        </label>

                        <label>
                            <input onChange={() => values.trabalhando = false}
                            type="radio" name="trabalhando" ></input>
                            Não
                        </label>
                    </div>

                    <label style={{ backgroundImage: `url(${urlFoto})` }} className="cursor-pointer  h-20 w-20 rounded-full ml-12 border bg-cover ">
                        <input name="foto" onChange={handleChange} className="hidden" type="file" />
                    </label>

                    <label className="cursor-pointer  h-20 w-20 rounded-full ml-12 bg-gray-600">
                        <input name="curriculo" onChange={selecionarPdf} className="hidden" type="file" accept="application/pdf" />
                    </label>
                    <textarea className="border border-gray-400 mt-3" value={values.descricao} onChange={handleChange} />
                    <input type="submit" value="Enviar" className="cursor-pointer" />
                </form>
                {urlPdf && (
                    <embed
                        src={urlPdf}
                        width="100%"
                        height="600px"
                        title="Currículo"
                    >
                    </embed>
                )}
            </div >

        </>

    )
}