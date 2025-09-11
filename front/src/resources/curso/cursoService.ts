
class ServicoCurso {
    urlBase: string = "http://localhost:8080/curso";

    async deletarCurso(idCurso?: string, token?: string) {
        await fetch(`${this.urlBase}/${idCurso}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

}

export const CursoService = () => new ServicoCurso();