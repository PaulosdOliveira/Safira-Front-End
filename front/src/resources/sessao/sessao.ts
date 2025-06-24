import { jwtDecode } from "jwt-decode";
import * as yup from 'yup';



export interface dadosLogin {
    cpfOuEmail: string;
    senha: string;
}

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
    perfil?: 'CANDIDATO' | 'EMPRESA'
    expiracao?: number;
}


class SessaoService {

    async criarSessao(token: accessToken) {
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
        }
    }

    setSessao(sessao: Sessao) {
        try {
            localStorage.setItem("sessao", JSON.stringify(sessao));
        } catch (erro) {
            alert(erro)
        }
    }
}


export const ServicoSessao = () => new SessaoService();