


class ServicoFormacao {
    urlBase: string = "http://localhost:8080/formacao";


    async deletarFormacao(id: string, token: string) {
        await fetch(`${this.urlBase}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    async buscarFormacoes(curso: string, token: string) {
       const result =  await fetch(`${this.urlBase}?curso=${curso}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return result.json();
    }

}

export const FormacaoService = () => new ServicoFormacao();