
export class MensagemDTO {
   idEmpresa?: string;
   idCandidato?: number;
   texto?: string;
   horaEnvio?: string;
   perfilRemetente?: string;
}

export class CadastroMensagemDTO {
   idEmpresa?: string;
   idCandidato?: number;
   texto?: string;
   perfilRemetente?: string;
}

export class ContatosProps {
   id?: string;
   nome?: string;
   ultimaMensagem?: string;
   urlFoto?: string;
}

export class DadosContato{
   nome?: string;
   urlFoto?: string;
}