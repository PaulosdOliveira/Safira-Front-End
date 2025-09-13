export class CadastroFormacao {

    instituicao?: string;
    curso?: string;
    nivel?: string;
    situacao?: string;
}

export class Formacao {
    id?: string;
    instituicao?: string;
    curso?: string;
    nivel?: string;
    situacao?: string;
}

export class OptionFormacaoDTO {
    id?: string;
    curso?: string;
}