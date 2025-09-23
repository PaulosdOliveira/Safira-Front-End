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
        <div className="flex my-4 w-fit">
            <div className="border border-gray-500 w-[210px] text-center rounded-md  flex items-start pl-2  bg-white">
                <p className="text-[1.3em] px-1  w-[91%]">{titulo}</p>
                <i onClick={() => setMoreOpen(!moreOpen)} className="material-symbols  scale-75 cursor-pointer">more_vert</i>
            </div>
            <div id="mais_opcoes" className={`border  w-[49px] h-fit ml-2 rounded-md  bg-white ${moreOpen ? '' : 'hidden'}`}>
                <span onClick={apagarRascunho} className="cursor-pointer">Excluir</span>
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
            values.titulo = "";
            values.descricao = "";
        }
    }
    return (
        <div className="w-full  max-h-[69vh] overflow-auto">
            {
                visualizar ? (
                    <div className="flex flex-col items-center">
                        <div className="text-right  w-[210px] ">
                            <i onClick={() => setVisualizar(!visualizar)} title="Novo" className="material-symbols cursor-pointer">Note_Add</i>
                        </div>
                        {children}
                    </div>

                ) : (
                    <div className="sm:w-[400px] w-full sm:m-auto  pt-10 p-2 pb-10 border border-gray-400 rounded-lg bg-white ">
                        <h2 className="text-center mb-10">Cadastrar rascunho</h2>
                        <form className="flex flex-col items-center gap-3 gap-y-5" onSubmit={handleSubmit}>
                            <div className="grid">
                                <label>Titulo:</label>
                                <input onChange={handleChange} value={values.titulo} id="titulo" placeholder="Titulo" type="text" className="rounded-md h-10 w-[280px] border" />
                            </div>
                            <div className="grid">
                                <label>Descrição:</label>
                                <textarea onChange={handleChange} value={values.descricao} id="descricao" placeholder="Texto padrão" className="rounded-md h-24 w-[280px] border" />
                            </div>
                            <input value="Salvar" placeholder="Descrição" type="submit" className="rounded-md h-10 w-[280px] cursor-pointer border" />
                            <button className="hover:underline text-blue-700" onClick={() => setVisualizar(true)}>Voltar</button>
                        </form>
                    </div>
                )
            }
        </div>
    )

}
