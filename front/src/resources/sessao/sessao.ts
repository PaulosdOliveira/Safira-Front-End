import { jwtDecode } from "jwt-decode";
import * as yup from 'yup';



export interface dadosLogin {
    login: string;
    senha: string;
}

export const valoresIniciais: dadosLogin = { login: '', senha: '' }

export const formLoginValidator = yup.object().shape({
    login: yup.string().trim("Campo obrigatório"),
    senha: yup.string().trim("Campo obrigatório")
})

export class accessToken {
    token?: string;
}

export class Sessao {
    id?: string;
    nome?: string;
    accessToken?: string;
    perfil?: 'candidato' | 'empresa'
    expiracao?: number;
}


class SessaoService {

    criarSessao(token: accessToken) {
        if (token.token) {
            const tokenDecodificado: any = jwtDecode(token.token);
            const sessao: Sessao = {
                accessToken: token.token,
                id: tokenDecodificado.id,
                nome: tokenDecodificado.nome,
                perfil: tokenDecodificado.perfil,
                expiracao: tokenDecodificado.exp
            }
            alert(sessao.nome)
            this.setSessao(sessao);
        } else {
            alert("ERRO: " + token)
        }
    }

    setSessao(sessao: Sessao) {
        try {
            localStorage.setItem("sessao", JSON.stringify(sessao));
        } catch (erro) {
            alert(erro)
        }
    }

    getSessao() {
        try {
            const sessao = localStorage.getItem("sessao");
            const login: Sessao = JSON.parse(sessao ? sessao : '');
            return login;
        } catch (erro) {
            return null;
        }
    }

    sair() {
        try {
            localStorage.removeItem("sessao");
        } catch (error) {

        }
    }
}


export const ServicoSessao = () => new SessaoService();