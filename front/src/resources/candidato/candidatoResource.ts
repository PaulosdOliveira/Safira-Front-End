import { dadosFormularioCadastroCandidato } from "@/app/candidato/cadastro/formSchema";
import { CadastroCurso, Curso } from "../curso/cursoResource";
import { CadastroExperiencia, Experiencia } from "../experiencia/experineciaResource";
import { CadastroFormacao, Formacao } from "../formacao/formacaoResource";
import { QualificacaoSalva, qualificacaoUsuario } from "../qualificacao/qualificacaoResource";

export interface dadosConsultaCandidato {
    idEstado?: string;
    idCidade?: string;
    qualificacoes: qualificacaoUsuario[]
    sexo: string;
    pcd: boolean;
    trabalhando: Boolean | null;
    formacoes: string[]
}

export class ConsultaCandidatoDTO {
    id?: number;
    nome?: string;
    cidade?: string;
    estado?: string;
    idade?: string;
}

export class CandidatoCadastrado {
    id?: number;
    nome?: string;
    cidade?: string;
    estado?: string;
    idade?: string;
    status?: string;
}

export class PerfilCandidato {
    id?: string;
    nome?: string;
    cidade?: string;
    estado?: string;
    idade?: string;
    descricao?: string;
    pcd?: boolean;
    tel?: string;
    email?: string;
    trabalhando?: boolean;
    qualificacoes?: QualificacaoSalva[];
    formacoes?: Formacao[];
    cursos?: Curso[];
    experiencias?: Experiencia[];


}


export class DadosSalvosCandidato {
    id?: string;
    nome?: string;
    sexo?: "MASCULINO" | "FEMININO";
    idCidade?: string;
    idEstado?: string;
    dataNascimento?: Date;
    descricao?: string;
    pcd?: boolean;
    tel?: string;
    foto?: File | null;
    curriculo?: File | null;
    trabalhando?: boolean;
    formacoes?: CadastroFormacao[];
    experiencias?: CadastroExperiencia[];
    cursos?: CadastroCurso[];
    qualificacoes?: qualificacaoUsuario[];
}




export const initConsultaCandidato: dadosConsultaCandidato = { qualificacoes: [], idCidade: '', idEstado: '', pcd: false, sexo: '', trabalhando: null, formacoes: [] }


