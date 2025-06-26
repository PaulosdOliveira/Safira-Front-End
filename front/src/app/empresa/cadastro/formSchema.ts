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
    cnpj: yup.string().trim("Campo obrigatório"),
    nome: yup.string().trim("Campo obrigatório"),
    email: yup.string().trim("Campo obrigatório"),
    senha: yup.string().trim("Campo obrigatório"),
    descricao: yup.string().trim("Campo obrigatório"),
    foto: yup.mixed<Blob>().required("Selecione uma foto")
})

export const valoresIniciais: dadosFormCadastroEmpresa ={
    cnpj: '', descricao: '', email: '', foto: null, nome: '',
    senha: ''
}

