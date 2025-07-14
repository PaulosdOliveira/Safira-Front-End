
// Dados do formulário de busca por vagas
export interface dadosConsultaVagaDTO {
    titulo: string;
    estado: string;
    cidade: string;
    senioridade: string;
    modelo: string;
    tipo_contrato: string;
}

// Valores inicias do formulário de busca por vagas
export const initConsultaVaga: dadosConsultaVagaDTO = { cidade: '', estado: '', modelo: '', senioridade: '', titulo: '', tipo_contrato: '' };



export interface dadosVaga {
    id: number;
    id_empresa: string;
    nome_empresa: string;
    titulo: string;
    descricao: string;
    dataHoraPublicacao: Date;
    dataHoraEncerramento: Date;
    salario: number;
    nivel: string;
    estado: string;
    cidade: string;
    modelo: string;
    ExclusivoParaSexo: string;
    ExclusivoParaPcd: boolean;
    tipoContrato: string;
    jaCandidatou: boolean;
}


