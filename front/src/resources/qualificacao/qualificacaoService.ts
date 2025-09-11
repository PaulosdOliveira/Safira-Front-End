import { Qualificacao } from "./qualificacaoResource";

class Service {
    urlBase: string = "http://localhost:8080/qualificacao"


    async buscarQualificacoes(nome: string): Promise<Qualificacao[]> {
        const resultado = await fetch(`${this.urlBase}?nome=${nome}`, {
            method: 'GET',
        })

        return resultado.json();
    }


    async deletarQualificacaoUsuario(idQualificacao?: number, token?: string) {
        await fetch(`${this.urlBase}/${idQualificacao}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }



}

export const QualificacaoService = () => new Service();