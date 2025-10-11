'use client'

import { CursoJSX, ExperienciaJSX, FormacaoJSX } from "@/components/perfilCandidato/CompoentsPerfilCandidato";
import { DadosSalvosCandidato, PerfilCandidato } from "@/resources/candidato/candidatoResource";
import { CandidatoService } from "@/resources/candidato/servico";
import { ModeloDeProposta } from "@/resources/empresa/rascunho/rascunhoResource";
import { ServicoEmpresa } from "@/resources/empresa/sevico";
import { CadastroMensagemDTO } from "@/resources/mensagem/mensagemResource";
import { Qualificacao, QualificacaoSalva, qualificacaoUsuario } from "@/resources/qualificacao/qualificacaoResource";
import { QualificacaoService } from "@/resources/qualificacao/qualificacaoService";
import { ServicoSessao } from "@/resources/sessao/sessao";
import { CandidaturaCandidato } from "@/resources/vaga_emprego/DadosVaga";
import { VagaService } from "@/resources/vaga_emprego/service";
import { Client } from "@stomp/stompjs";
import { useFormik } from "formik";
import { useParams } from "next/navigation"
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { cidade, estado, UtilsService } from "@/resources/utils/utils";
import { Curso, ExperienciaAccordion, Formacao, QualificacaoComponent } from "@/components/perfilCandidato/CompoentsCadastroCandidato";
import { FormacaoService } from "@/resources/formacao/fiormacaoService";
import { ExperienciaService } from "@/resources/experiencia/experienciaService";
import { CursoService } from "@/resources/curso/cursoService";
import { Header, Menu } from "@/components/header";
import { Footer } from "@/components/footer";
import AsyncSelect from "react-select/async";
import { SectionOverflow } from "@/components/sectionOverflow";
import { PerfilCandidatoComponent } from "@/components/perfilCandidato";



export default function PagePerfilCandidato() {

    const id = useParams().id as string;
   
    

    if (id) {
        return (
            <div className="w-full min-h-[100vh] max-h-fit bg-gray-200">
                <Header />
                <PerfilCandidatoComponent idCandidato={id}/>
                <Footer />
            </div>
        )
    }
    return <h1 className="text-black text-center">Nenhum perfil encontrado</h1>
}


