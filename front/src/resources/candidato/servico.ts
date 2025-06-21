import { dadosCadastroCandidato } from "@/app/candidato/cadastro/formSchema";

class ServiceClass {

    urlBase: string = "http://localhost:8080/candidato"


    async cadastrar(dadosCadastrais: dadosCadastroCandidato) {

        const resultado = await fetch(this.urlBase, {
            method: 'POST',
            body: JSON.stringify(dadosCadastrais),
            headers: {
                'Content-Type': 'application/json'
            }

        })
   
       resultado.json().then(resposta =>{
        if(resposta.erro)alert(resposta.erro) ;
       })
    }

}

export const candidatoService = () => new ServiceClass();