import { dadosConsultaVagaDTO } from "./DadosVaga";

class Service {
    urlBase: string = "http://localhost:8080/vaga"


    async buscarVaga(dadosForm: dadosConsultaVagaDTO, token: string) {

        const params = new URLSearchParams({
            titulo: dadosForm.titulo,
            estado: dadosForm.estado,
            cidade: dadosForm.cidade,
            senioridade: dadosForm.senioridade,
            modelo: dadosForm.modelo,
            tipo_contrato: dadosForm.tipo_contrato
        })


        const resultado = await fetch(`${this.urlBase}/buscar?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return resultado.json();
    }


    async buscarVagasAlinhadas(token: string) {
        const resultado = await fetch(this.urlBase + "/alinhada", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return resultado.json();
    }


    // Buscando os diferentes estados dos candidatos cadastrados
    async buscarEstados() {
        const resultado = await fetch(this.urlBase + "/estados", {
            method: 'GET'
        })
        return resultado.json();
    }

    async buscaCidadesDoEstado(estado: string) {
        const resultado = await fetch(`${this.urlBase}/cidades/${estado}`, {
            method: 'GET'
        })
        return resultado.json();
    }

    async carregarVaga(id: string, token: string) {

        const resultado = await fetch(`${this.urlBase}/buscar/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return resultado.json();
    }

    async candidatar_a_vaga(token: string, idVaga: string){
        await fetch(`${this.urlBase}/candidatar/${idVaga}`,{
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

}

export const VagaService = () => new Service();