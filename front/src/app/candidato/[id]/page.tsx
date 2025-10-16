'use client'

import { useParams } from "next/navigation"
import React, {  } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PerfilCandidatoComponent } from "@/components/perfilCandidato";



export default function PagePerfilCandidato() {

    const id = useParams().id as string;



    if (id) {
        return (
            <div className="w-full min-h-[150vh] max-h-fit bg-gray-200 flex-col flex ">
                <div className="flex-1/2">
                    <Header />
                    <PerfilCandidatoComponent idCandidato={id} />
                </div>
                <Footer />
            </div>
        )
    }
    return <h1 className="text-black text-center">Nenhum perfil encontrado</h1>
}


