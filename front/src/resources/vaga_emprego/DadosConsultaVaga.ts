

export interface dadosConsultaVagaDTO {
    titulo: string;
    estado: string;
    cidade: string;
    senioridade: string;
    modelo: string;
    tipo_contrato: string;
}


export const initConsultaVaga: dadosConsultaVagaDTO = {cidade: '', estado: '', modelo: '', senioridade: '', titulo: '', tipo_contrato: ''};