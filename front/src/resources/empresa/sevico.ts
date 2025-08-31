import { dadosCadastroEmpresa } from "@/app/empresa/cadastro/formSchema";
import { erroResposta } from "../candidato/servico";
import { dadosLogin } from "../sessao/sessao";
import { CadastroModeloDeProposta, ModeloDeProposta } from "./rascunho/rascunhoResource";

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

    // CADASTRAR RASCUNHO
    async cadastrarRascunho(dadosCadastrais: CadastroModeloDeProposta, token: string): Promise<ModeloDeProposta> {
        const resultado = await fetch(`${this.urlBase}/rascunho`, {
            method: 'POST',
            body: JSON.stringify(dadosCadastrais),
            headers: {
                'Content-Type': 'application/json',
                'AUthorization': `Bearer ${token}`
            }
        })
        if (resultado.status === 201) alert("Criado com sucesso");
        return resultado.json();
    }


    // BUSCAR RASCUNHOS SALVOS
    async buscarRascunhos(token: string): Promise<ModeloDeProposta[]> {
        const resultado = await fetch(`${this.urlBase}/rascunho`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return resultado.json();
    }


    async excluir_rascunho(token: string, idRascunho: string) {
        await fetch(`${this.urlBase}/rascunho/${idRascunho}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }
}

export const ServicoEmpresa = () => new EmpresaService();