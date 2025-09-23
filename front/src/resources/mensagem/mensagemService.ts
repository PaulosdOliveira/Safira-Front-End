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


    // BUSCANDO QUANTIDISDE DE NOTIFICAÇÕES DO USUÁRIO
    async getNofificacoes(token: string) {
        const result = await fetch(`${this.urlBse}/nofificacoes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return result.json();
    }

    // VISUALIZANDO MENSAGENS
    async visualizarMensagens(token: string, idDestino: string) {
        await fetch(`${this.urlBse}/visualizar?idDestinatario=${idDestino}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    //VISUALIZANDO MENSAGEM RECEBIDA NO CHAT
    async visualizarMensagem(token: string, idMensagem: string, idUsuarioLogado: string) {
        await fetch(`${this.urlBse}/visualizar/${idMensagem}/${idUsuarioLogado}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

}

export const MensagemService = () => new ServicoMensagem();