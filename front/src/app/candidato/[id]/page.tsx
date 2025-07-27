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
                <h1>{perfil?.nome}</h1>
                <h1>{perfil?.idade}</h1>
                <h1>{perfil?.cidade}</h1>
                <h1>{perfil?.estado}</h1>
                <h1>{perfil?.email}</h1>
                <h1>{perfil?.tel}</h1>
                <h1>{perfil?.sexo}</h1>
                <h1>{perfil?.descricao}</h1>
            </main>
        )
    }
    return <h1 className="text-black text-center">Nenhum perfil encontrado</h1>
}