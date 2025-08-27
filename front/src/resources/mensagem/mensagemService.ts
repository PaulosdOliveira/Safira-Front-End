import { ContatosProps, DadosContato, MensagemDTO } from "./mensagemResource";

class ServicoMensagem {
    urlBse: string = "http://localhost:8080/mensagem"



    async buscarChatsRecetes(token: string): Promise<ContatosProps[]> {
        const resultado = await fetch(`${this.urlBse}/contatos-recentes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return resultado.json();
    }

    async buscarDadosContato(idContato: string, token: string): Promise<DadosContato> {
        const resultado = await fetch(`${this.urlBse}/dados/${idContato}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return resultado.json();
    }


    async carregarMensagens(idDestinatario: string, token: string): Promise<MensagemDTO[]> {
        const resultado = await fetch(`${this.urlBse}/${idDestinatario}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return resultado.json();
    }

}

export const MensagemService = () => new ServicoMensagem();