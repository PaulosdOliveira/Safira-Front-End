import { dadosCadastroEmpresa } from "@/app/empresa/cadastro/formSchema";
import { erroResposta } from "../candidato/servico";
import { dadosLogin } from "../sessao/sessao";

class EmpresaService {
    urlBase: string = "http://localhost:8080/empresa"


    async cadastrar(dadosCadastrais: dadosCadastroEmpresa) {

        const resultado = await fetch(this.urlBase, {
            method: 'POST',
            body: JSON.stringify(dadosCadastrais),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const resposta: erroResposta = { status: resultado.status }

        if (resultado.status === 200) {
            alert("Cadastro realizado com sucesso")
        } else {
            const erro = await resultado.json();
            resposta.erro = erro.erro;
        }
        return resposta;
    }


    async logar(dados: dadosLogin) {

        const resultado = await fetch(this.urlBase + "/login", {
            method: 'POST',
            body: JSON.stringify(dados),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        alert(resultado.status)
        if (resultado.status === 200) return resultado.json();
        else alert("Algo deu errado");
    }

    async salvarFotoEmpresa(foto: File, token: string) {
        alert(token + "-----------------------------")
        const dados = new FormData();
        dados.append("foto", foto);

        await fetch(this.urlBase + "/foto", {
            method: 'POST',
            body: dados,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }


    async carregarPerfil(id: string) {
        const resultado = await fetch(`${this.urlBase}/${id}`);
        return resultado.json();
    }
}

export const ServicoEmpresa = () => new EmpresaService();