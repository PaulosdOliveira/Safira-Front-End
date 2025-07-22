
export class Qualificacao {
    id?: number;
    nome?: string;
}

export interface qualificacaoUsuario {
    idQualificacao: number;
    nivel: string;
}


export interface qualificacaoSelecionada {
    idQualificacao: number;
    nome: string;
    nivel: string;

}
