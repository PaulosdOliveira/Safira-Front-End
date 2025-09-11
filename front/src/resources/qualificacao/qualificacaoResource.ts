
export class Qualificacao {
    id?: number;
    nome?: string;
}

// Modelo de visualização de qualificações salvas em um perfil
export class QualificacaoSalva{
    idCandidato?: number;
    idQualificacao?: number;
    nivel?: string;
    nome?: string;
}

export interface qualificacaoUsuario {
    idQualificacao?: number;
    nivel: string;
    nome: string;
}


export interface qualificacaoSelecionada {
    idQualificacao: number;
    nome: string;
    nivel: string;
}

export const qualificacaoFormInitial: qualificacaoSelecionada = { nivel: "BASICO", idQualificacao: 0, nome: '' };