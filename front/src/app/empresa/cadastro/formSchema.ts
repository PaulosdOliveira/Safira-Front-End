import * as yup from 'yup';


export interface dadosFormCadastroEmpresa {
    cnpj: string;
    nome: string;
    email: string;
    senha: string;
    descricao: string;
    foto: File | null;
}

export interface dadosCadastroEmpresa {
    cnpj: string;
    nome: string;
    email: string;
    senha: string;
    descricao: string;
}

export const validation = yup.object().shape({
    cnpj: yup.string().trim().required("Campo obrigatório"),
    nome: yup.string().trim().required("Campo obrigatório"),
    email: yup.string().trim().required("Campo obrigatório"),
    senha: yup.string().trim().required("Campo obrigatório"),
    descricao: yup.string().trim().required("Campo obrigatório"),
    foto: yup.mixed<Blob>().required("Selecione uma foto")
})

export const valoresIniciais: dadosFormCadastroEmpresa ={
    cnpj: '', descricao: '', email: '', foto: null, nome: '',
    senha: ''
}

