import { dadosCadastroCandidato } from "@/app/candidato/cadastro/formSchema";
import { dadosLogin } from "../sessao/sessao";

class ServiceClass {

    urlBase: string = "http://localhost:8080/candidato"


    // Cadastro de candidato
    async cadastrar(dadosCadastrais: dadosCadastroCandidato) {

        const resultado = await fetch(this.urlBase, {
            method: 'POST',
            body: JSON.stringify(dadosCadastrais),
            headers: {
                'Content-Type': 'application/json'
            }

        })

        const resposta: erroResposta = {
            status: resultado.status
        }
        if (resposta.status != 201) {
            const erro = await resultado.json();
            resposta.erro = erro.erro;
        }
        return resposta
    }


    // Método de login de usuário
    async logar(dadosLogin: dadosLogin) {
        const resultado = await fetch(this.urlBase + "/login", {
            method: 'POST',
            body: JSON.stringify(dadosLogin),
            headers: {
                'Content-Type': 'application/json'
            }

        })

        alert(resultado.status)

        if (resultado.status === 404) {
            alert("Usuário não encontrado")
            return null;
        }
        return resultado.json();

    }


    // Salvar foto do candidato
    async salvarFoto(foto: File | null, token: string) {
        const dados = new FormData;
        dados.append("foto", foto ? foto : '');
        const resultado = await fetch(this.urlBase + "/foto", {
            method: 'PUT',
            body: dados,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        alert(resultado.status + "Foto")
    }


    // SALVANDO CURRÍCULO DO USUÁRIO
    async salvarCurriculo(curriculo: File | null, token: string) {
        const dados = new FormData();
        if (curriculo) dados.append("curriculoPdf", curriculo);
        await fetch(this.urlBase + "/curriculo", {
            method: 'PUT',
            body: dados,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

}




export const candidatoService = () => new ServiceClass();



export interface erroResposta {
    erro?: string;
    status: number;
}