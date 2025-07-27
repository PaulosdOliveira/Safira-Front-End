'use client'


import { ServicoSessao } from "@/resources/sessao/sessao";
import { useEffect, useState } from "react";
import { MainEmpresa } from "./empresa/main";
import MainCandidato from "./candidato/page";

export default function Home() {
  const [perfil, setPerfil] = useState<any>("");

  useEffect(() => {
    setPerfil(ServicoSessao().getSessao()?.perfil);
  }, [])


  if (perfil === "candidato") {
    return (
      <div className="">
        <MainCandidato />
      </div>);
  }

  return <MainEmpresa />
}


