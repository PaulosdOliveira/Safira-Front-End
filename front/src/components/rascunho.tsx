'use client'

import { CadastroModeloDeProposta, ModeloDeProposta } from "@/resources/empresa/rascunho/rascunhoResource";
import { useFormik } from "formik";
import { useState } from "react"


interface cardRascunhoProps extends ModeloDeProposta {
    apagarRascunho?: (event: any) => void;
}

export const CardRascunho: React.FC<cardRascunhoProps> = ({ apagarRascunho, descricao, id, titulo }) => {

    const [moreOpen, setMoreOpen] = useState<boolean>(false);

    return (
        <div className="w-[265px] flex my-4">
            <div className="border w-[210px]   text-center rounded-md  flex items-start pl-2">
                <p className="text-[1.5em] px-1  w-[91%]">{titulo}</p>
                <i onClick={() => setMoreOpen(!moreOpen)} className="material-symbols  scale-75 cursor-pointer">more_vert</i>
            </div>
            <div id="mais_opcoes" className={`border  w-[49px]  bg-white ${moreOpen ? '' : 'hidden'}`}>
                <ul>
                    <li onClick={apagarRascunho} className="cursor-pointer">Excluir</li>
                </ul>
            </div>
        </div>
    )
}


interface gerente {
    condition: boolean;
    children: React.ReactNode;
    enviarForm: (dadosCadastrais: CadastroModeloDeProposta) => void;

}
export const GerenciadorDeRascunhos: React.FC<gerente> = ({ children, condition, enviarForm }) => {
    // TRUE: VISUALIZA RASCUNHOS; FALSE: CADASTRA NOVO
    const [visualizar, setVisualizar] = useState<boolean>(true);
    const { handleChange, handleSubmit, values } = useFormik<CadastroModeloDeProposta>({
        initialValues: { descricao: "", titulo: "" },
        onSubmit: submit,
    })

    async function submit() {
        if (values.titulo?.length && values.descricao?.length) {
            enviarForm(values);
            setVisualizar(true);
        }
    }
    return (
        <>
            {
                visualizar ? (

                    <div className=" ">
                        <div className="text-right  pr-14">
                            <h1 onClick={() => setVisualizar(!visualizar)} title="Novo" className="material-symbols cursor-pointer ">add</h1>
                        </div>
                        {children}
                    </div>

                ) : (
                    <div className=" w-[400px] p-2 pb-10 border rounded-lg bg-white">
                        <h2 className="text-center mb-10">Cadastrar rascunho</h2>
                        <form className="flex flex-col items-center gap-3" onSubmit={handleSubmit}>
                            <input onChange={handleChange} value={values.titulo} id="titulo" placeholder="Titulo" type="text" className="rounded-md h-10 w-[280px]" />
                            <input onChange={handleChange} value={values.descricao} id="descricao" placeholder="Descrição" type="text" className="rounded-md h-10 w-[280px]" />
                            <input value="Salvar" placeholder="Descrição" type="submit" className="rounded-md h-10 w-[280px] cursor-pointer" />
                            <button className="hover:underline" onClick={() => setVisualizar(true)}>Voltar</button>
                        </form>
                    </div>
                )
            }
        </>
    )

}
