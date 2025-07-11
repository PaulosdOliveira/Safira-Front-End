import { Qualificacao } from "./qualificacaoResource";

class Service {
    urlBase: string = "http://localhost:8080/qualificacao"


    async buscarQualificacoes(): Promise<Qualificacao[]> {
        const resultado = await fetch(this.urlBase, {
            method: 'GET',
        })

        return resultado.json();
    }




}

export const QualificacaoService = () => new Service();