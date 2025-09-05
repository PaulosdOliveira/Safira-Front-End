import { CadastroCurso } from "@/resources/curso/cursoResource";
import { CadastroExperiencia } from "@/resources/experiencia/experineciaResource";
import { CadastroFormacao } from "@/resources/formacao/formacaoResource";
import * as yup from "yup";

export interface dadosCadastroCandidato {
    cpf: string;
    nome: string;
    email: string;
    senha: string;
    dataNascimento?: Date;
    descricao: string;
    tel?: string;
    cep: string;
    pcd: boolean;
    trabalhando: boolean;
    sexo: "MASCULINO" | "FEMININO";
    idEstado: string;
    idCidade: string;
    formacoes: CadastroFormacao[];
    experiencias: CadastroExperiencia[];
    cursos: CadastroCurso[];

}



export interface dadosFormulario {
    cpf: string;
    nome: string;
    email: string;
    senha: string;
    confirma_senha: string;
    dataNascimento?: Date;
    descricao: string;
    tel?: string;
    cep: string;
    pcd: boolean;
    trabalhando: boolean;
    sexo: "MASCULINO" | "FEMININO";
    foto: File | null;
    curriculo?: File | null;
    idEstado: string;
    idCidade: string;
    formacoes: CadastroFormacao[];
    experiencias: CadastroExperiencia[];
    cursos: CadastroCurso[];
}


export const formValidation = yup.object().shape({
    cpf: yup.string().trim("Campo obrigatorio"),
    nome: yup.string().trim("Campo obrigatorio"),
    email: yup.string().trim("Campo obrigatorio"),
    senha: yup.string().trim("Campo obrigatorio"),
    confirma_senha: yup.string().oneOf([yup.ref("senha")], "As senhas precisam ser iguais"),
    cep: yup.string().trim("Campo obrigatorio"),
    descricao: yup.string().trim("Campo obrigatorio"),
    foto: yup.mixed<Blob>().required("Selecione uma foto"),
    pcd: yup.boolean().required("Selecione uma opção"),
    trabalhando: yup.boolean().required("Selecione uma opção"),
    dataNascimento: yup.date().required("Informe a sua data de nascimento")

})

export const valoresIniciais: dadosFormulario = { foto: null, cpf: "88899", cep: "44094018",
     descricao: "hhhhhhhhhhh", email: "p@ww", nome: "ppp", senha: "123", sexo: 'FEMININO', 
     tel: "75991995516", pcd: false, trabalhando: false, confirma_senha: "123", idCidade: '',
      idEstado: '',cursos: [], experiencias: [], formacoes: [],  }


/***   FORMULÁRIO DE QUALIFICAÇÕES */
export interface qualificacaoForm {
    idQualificacao: string;
    nivel: string;
}


export const qualificacaoFormValidation = yup.object().shape({
    qualificacao: yup.string().trim("Campo obrigatorio"),
    nivel: yup.string().trim("Campo obrigatório")
})

export const qualificacaoFormInitial: qualificacaoForm = { nivel: "BASICO", idQualificacao: '' };

/***   FORMULÁRIO DE QUALIFICAÇÕES */
