import { CadastroCurso, Curso } from "@/resources/curso/cursoResource";
import { CadastroExperiencia, Experiencia } from "@/resources/experiencia/experineciaResource";
import { CadastroFormacao, Formacao } from "@/resources/formacao/formacaoResource";
import { qualificacaoUsuario } from "@/resources/qualificacao/qualificacaoResource";
import * as yup from "yup";

export interface dadosCadastroCandidato {
    cpf: string;
    nome: string;
    email: string;
    senha: string;
    dataNascimento?: Date;
    descricao: string;
    tel?: string;
    pcd: boolean;
    trabalhando: boolean;
    sexo: "MASCULINO" | "FEMININO";
    idEstado: string;
    idCidade: string;
    formacoes: CadastroFormacao[];
    experiencias: CadastroExperiencia[];
    cursos: CadastroCurso[];
    qualificacoes: qualificacaoUsuario[];
}



export interface dadosFormularioCadastroCandidato {
    cpf: string;
    nome: string;
    email: string;
    senha: string;
    confirma_senha: string;
    dataNascimento?: Date;
    descricao: string;
    tel?: string;
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
    cpf: yup.string().trim().required("Informe seu CPF").min(11, "Informe seu CPF"),
    nome: yup.string().trim().required("Campo obrigatorio***"),
    email: yup.string().trim().required("Campo obrigatorio***"),
    senha: yup.string().trim().required("Campo obrigatorio***"),
    confirma_senha: yup.string().oneOf([yup.ref("senha")], "As senhas precisam ser iguais***"),
    descricao: yup.string().trim().required("Adicione uma descrição"),
    foto: yup.mixed<Blob>().required("Selecione uma foto***"),
    dataNascimento: yup.date().required("Informe a sua data de nascimento***"),
    idEstado: yup.string().trim().required("Selecione o seu estado"),
    idCidade: yup.string().trim().required("Selecione a sua cidade")
})

export const valoresIniciais: dadosFormularioCadastroCandidato = {
    foto: null, cpf: "",
    descricao: "", email: "", nome: "", senha: "", sexo: 'MASCULINO',
    tel: "", pcd: false, trabalhando: false, confirma_senha: "", idCidade: '',
    idEstado: '', cursos: [], experiencias: [], formacoes: [],
}


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
