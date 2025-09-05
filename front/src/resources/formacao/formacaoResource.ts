export class CadastroFormacao {
    instituicao?: string;
    curso?: string;
    nivel?: 'TECNICO' | 'TECNOLOGO' | 'GRADUACAO' | 'POS_GRADUACAO' | 'MESTRADO' | 'DOUTORADO';
    inicio?: Date;
    fim?: Date
}