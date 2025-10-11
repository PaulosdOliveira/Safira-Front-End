import { cardVagaProps } from "@/components/cardvaga";




// Dados do formulário de busca por vagas
export interface dadosConsultaVagaDTO {
    titulo: string;
    idEstado: string;
    idCidade: string;
    senioridade: string;
    modelo: string;
    tipo_contrato: string;
    pageNumber: number;
}

// Valores inicias do formulário de busca por vagas
export const initConsultaVaga: dadosConsultaVagaDTO = { idCidade: '', idEstado: '', modelo: '', senioridade: '', titulo: '', tipo_contrato: '', pageNumber: 0 };



export interface dadosVaga {
    id: number;
    id_empresa: string;
    nome_empresa: string;
    titulo: string;
    dataHoraPublicacao: string;
    dataHoraEncerramento: string;
    diasEmAberto: string;
    salario: number;
    nivel: string;
    estado: string;
    cidade: string;
    modelo: string;
    exclusivoParaSexo: string;
    exclusivoParaPcd: boolean;
    tipoContrato: string;
    jaCandidatou: boolean;
    descricao: string;
    principais_atividades: string;
    requisitos: string;
    diferenciais: string;
    local_de_trabalho: string;
    horario: string;
    mensagemConvocacao: string;
    mensagemDispensa: string;
}


// PAGINA DE VAGAS CADASTRADAS POR UMA EMPRESA
export class PageVagaEmprego {
    id?: string;
    titulo?: string;
    tempo_decorrido?: string;
    qtd_candidatos?: string;
    totalPages?: number;
}


// Vaga na qual candidato se cadastrou
export class CandidaturaCandidato {
    idVaga?: string;
    tituloVaga?: string;
    nomeEmpresa?: string;
    idEmpresa?: string;
    status?: string;
    finalizada?: boolean;
}


export class PageCardVaga {
    vagas?: cardVagaProps[];
    pageNumber?: number;
    totalPages?: number;
}