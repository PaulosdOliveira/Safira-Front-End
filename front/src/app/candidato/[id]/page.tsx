'use client'

import { PerfilCandidato } from "@/resources/candidato/candidatoResource";
import { CandidatoService } from "@/resources/candidato/servico";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";


export default function PagePerfilCandidato() {

    const id = useParams().id;
    const [perfil, setPerfil] = useState<PerfilCandidato | null>(null);

    useEffect(() => {
        (async () => {
            if (id) {
                const perfilCandidato = await CandidatoService().carregarPerfil(`${id}`);
                if (perfilCandidato.id)
                    setPerfil(perfilCandidato)
            }

        })()
    }, [])

    if (perfil) {
        return (
            <main className="w-[100%] h-[100vh] bg-gray-020 p-5">
                <div style={{ backgroundImage: `url(http://localhost:8080/candidato/foto/${id})` }}
                    className="w-20 h-20 rounded-full bg-cover bg-no-repeat"></div>
                <p>{perfil?.nome}</p>
                <p>{perfil?.idade}</p>
                <p>{perfil?.cidade}</p>
                <p>{perfil?.estado}</p>
                <p>{perfil?.email}</p>
                <p>{perfil?.tel}</p>
                <p>{perfil?.sexo}</p>
                <pre className="font-[arial]">{perfil?.descricao}</pre>
            </main>
        )
    }
    return <h1 className="text-black text-center">Nenhum perfil encontrado</h1>
}