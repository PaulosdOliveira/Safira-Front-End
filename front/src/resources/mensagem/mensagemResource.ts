
export class MensagemDTO {
   id?: string;
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
   isNew?: boolean;
   indexContato?: number;
   ultimaMensagem?: string;
   urlFoto?: string;
   naoVizualizadas?: number;
   click?: () => void;
   load?: () => void;
   mensagens?: MensagemDTO[] = [];
}

export class DadosContato {
   nome?: string;
   urlFoto?: string;
   
}