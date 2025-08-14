import { dadosCadastroVaga } from "@/app/vaga/cadastro/formSchema";
import { CandidaturaCandidato, dadosConsultaVagaDTO } from "./DadosVaga";

class Service {
    urlBase: string = "http://localhost:8080/vaga"


    async cadastrar_vaga(dadosCadastrais: dadosCadastroVaga, token: string) {
        const resultado = await fetch(this.urlBase, {
            method: 'POST',
            body: JSON.stringify(dadosCadastrais),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        alert(resultado.status)
    }


    async buscarVaga(dadosForm: dadosConsultaVagaDTO, token: string) {

        const params = new URLSearchParams({
            titulo: dadosForm.titulo,
            idEstado: dadosForm.idEstado != null ? dadosForm.idEstado + "" : "",
            idCidade: dadosForm.idCidade != null ? dadosForm.idCidade + "" : "",
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


    async carregarVaga(id: string, token: string) {

        const resultado = await fetch(`${this.urlBase}/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return resultado.json();
    }

    async candidatar_a_vaga(token: string, idVaga: string) {
        const resultado = await fetch(`${this.urlBase}/candidatar/${idVaga}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return resultado.status;
    }

    async buscar_candidaturas(token: string): Promise<CandidaturaCandidato[]>{
        const resultado = await fetch(`${this.urlBase}/candidaturas`,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return resultado.json();
    }

    async cancelar_candidatura(token: string, idVaga: string) {
        await fetch(`${this.urlBase}/cancelar-candidatura/${idVaga}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }


    async buscarVagasEmpresa(id_empresa: string) {
        const resultado = await fetch(`${this.urlBase}?idEmpresa=${id_empresa}`);
        return resultado.json();
    }

    // Buscando candidatos cadastrados em uma vaga
    async buscarCandidatosVaga(idVaga: string, token: string) {
        const resultado = await fetch(`${this.urlBase}/candidatos/${idVaga}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return resultado.json();
    }

    async selecionarCandidato(idCandidato: string, idVaga: string, token: string) {
        await fetch(`${this.urlBase}/candidato/selecionar/${idCandidato}/${idVaga}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    async dispesarCandidato(idCandidato: string, idVaga: string, token: string) {
        await fetch(`${this.urlBase}/candidato/dispensar/${idCandidato}/${idVaga}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    async buscarDadosCadastrais(idVaga: string, token: string) {
        const resultado = await fetch(`${this.urlBase}/dados-cadastrais/${idVaga}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return resultado.json();
    }


    async editarVaga(idVaga: string, dados: dadosCadastroVaga, token: string) {
        await fetch(`${this.urlBase}/${idVaga}`, {
            method: 'PUT',
            body: JSON.stringify(dados),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
    }

}

export const VagaService = () => new Service();