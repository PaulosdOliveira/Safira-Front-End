import { Qualificacao, qualificacaoUsuario } from "../qualificacao/qualificacaoResource";

export interface dadosConsultaCandidato {
    idEstado?: string;
    idCidade?: string;
    qualificacoes: qualificacaoUsuario[]
}

export class ConsultaCandidatoDTO{
    id?: number;
    nome?: string;
}



export const initConsultaCandidato: dadosConsultaCandidato = { qualificacoes: [], idCidade: '', idEstado: '' }