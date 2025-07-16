export interface dadosCadastroVaga{
    titulo: string;
    diasEmAberto: string;
    salario: string;
    cep: string;
    nivel: string;
    modelo: string;
    tipoContrato: string;
    exclusivoParaSexo: string;
    exclusivoParaPcd: boolean;
    descricao_vaga: string;
    principais_atividades: string;
    requisitos: string;
    diferenciais: string;
    local_de_trabalho: string;
    horario: string;

}

export const valoresIniciais: dadosCadastroVaga = {cep: '', diasEmAberto: '', diferenciais: '', exclusivoParaPcd: false, horario: '', descricao_vaga: '', local_de_trabalho: '', modelo: '', nivel: '', principais_atividades: '', requisitos: '', salario: '', exclusivoParaSexo: '', tipoContrato: '', titulo: ''}