'use client'


import { ServicoSessao, Sessao } from "@/resources/sessao/sessao";
import { useEffect, useState } from "react";
import MainCandidato from "./candidato/page";
import MainEmpresa from "./empresa/page";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/load/loadingPage";

export default function Home() {
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const router = useRouter();



  useEffect(() => {
    setTimeout(() => {
      const sessao = ServicoSessao().getSessao();
      if (!sessao) router.push("/candidato/login");
      setSessao(sessao);
    }, 5000)

  }, [])

  if (!sessao) return <Loading/>;

  // Página principal caso seja candidato
  if (sessao!.perfil === "candidato") {
    return (
      <div className="">
        <MainCandidato />
      </div>);
  }
  // Página principal caso seja candidato
  return <MainEmpresa />
}


