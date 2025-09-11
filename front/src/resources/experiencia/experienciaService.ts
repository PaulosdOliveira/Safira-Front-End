
class ServicoExperiencia {
    urlBase: string = "http://localhost:8080/experiencia";


    async deletarExperiencia(idEperiencia?: string, token?: string) {
        await fetch(`${this.urlBase}/${idEperiencia}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

}

export const ExperienciaService = () => new ServicoExperiencia();