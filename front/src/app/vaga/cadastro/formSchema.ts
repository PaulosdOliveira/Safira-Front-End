export interface dadosCadastroVaga{
    titulo: string;
    diasEmAberto: string;
    salario: string;
    nivel: string;
    modelo: string;
    tipoContrato: string;
    exclusivoParaSexo: string;
    exclusivoParaPcd: boolean;
    descricao: string;
    principais_atividades: string;
    requisitos: string;
    diferenciais: string;
    local_de_trabalho: string;
    horario: string;
    idEstado: string;
    idCidade: string;
}

export const valoresIniciais: dadosCadastroVaga = {diasEmAberto: '', diferenciais: '', exclusivoParaPcd: false, horario: '', descricao: '', local_de_trabalho: '', modelo: '', nivel: '', principais_atividades: '', requisitos: '', salario: '', exclusivoParaSexo: '', tipoContrato: '', titulo: '', idCidade: '', idEstado: ''}