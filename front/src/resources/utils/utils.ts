export interface estado {
    id: number;
    sigla: string;
}

export interface cidade {
    id: number;
    nome: string;
}


class Utils {
    urlBase: string = "http://localhost:8080/utils";


    async buscarEstados() {
        const resultado = await fetch(`${this.urlBase}/estados`, {
            method: 'GET'
        })
        return resultado.json();
    }

    async buscarCidadesdeEstado(idEstado: number) {
        const resultado = await fetch(`${this.urlBase}/cidades/${idEstado}`, {
            method: 'GET'
        })
        return resultado.json();
    }
}

export const UtilsService = () => new Utils();