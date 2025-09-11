


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

}

export const FormacaoService = () => new ServicoFormacao();