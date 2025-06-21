import * as yup from "yup";

export interface dadosCadastroCandidato {
    cpf: string;
    nome: string;
    email: string;
    senha: string;
    descricao: string;
    tel?: string;
    cep: string;
    pcd: boolean;
    trabalhando: boolean;
    sexo: "MASCULINO" | "FEMININO";
}



export interface dadosFormulario {
    cpf: string;
    nome: string;
    email: string;
    senha: string;
    descricao: string;
    tel?: string;
    cep: string;
    pcd: boolean;
    trabalhando: boolean;
    sexo: "MASCULINO" | "FEMININO";
    foto?: File | null;
    curriculo?: File | null;
}

export const formValidation = yup.object().shape({
    cpf: yup.string().trim("Campo obrigatorio"),
    nome: yup.string().trim("Campo obrigatorio"),
    email: yup.string().trim("Campo obrigatorio"),
    senha: yup.string().trim("Campo obrigatorio"),
    cep: yup.string().trim("Campo obrigatorio"),
    descricao: yup.string().trim("Campo obrigatorio"),
    foto: yup.mixed<Blob>().required("Selecione uma foto"),
    pcd: yup.boolean().required("Selecione uma opção"),
    trabalhando: yup.boolean().required("Selecione uma opção")

})

export const valoresIniciais: dadosFormulario = { cpf: "88899", cep: "440954", descricao: "hhhhhhhhhhh", email: "p@ww", nome: "ppp", senha: "123", sexo: 'FEMININO', tel: "75991995516", pcd: false, trabalhando: false }