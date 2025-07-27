import { Qualificacao, qualificacaoUsuario } from "../qualificacao/qualificacaoResource";

export interface dadosConsultaCandidato {
    idEstado?: string;
    idCidade?: string;
    qualificacoes: qualificacaoUsuario[]
    sexo: string;
    pcd: boolean;
    trabalhando: Boolean | null;
}

export class ConsultaCandidatoDTO {
    id?: number;
    nome?: string;
    cidade?: string;
    estado?: string;
    idade?: string;
}

export class PerfilCandidato {
    id?: string;
    nome?: string;
    cidade?: string;
    estado?: string;
    idade?: string;
    descricao?: string;
    sexo?: string;
    pcd?: boolean;
    tel?: string;
    email?: string;
    trabalhando?: boolean;
}



export const initConsultaCandidato: dadosConsultaCandidato = { qualificacoes: [], idCidade: '', idEstado: '', pcd: false, sexo: '', trabalhando: null }