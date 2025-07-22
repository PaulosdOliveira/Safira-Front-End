'use client'

import "@/app/styles/main-candidato.css"
import { CardVaga, cardVagaProps } from "@/components/cardvaga";
import { ServicoSessao } from "@/resources/sessao/sessao";
import { cidade, estado, UtilsService } from "@/resources/utils/utils";
import { dadosConsultaVagaDTO, initConsultaVaga } from "@/resources/vaga_emprego/DadosVaga";
import { VagaService } from "@/resources/vaga_emprego/service";
import { useFormik } from "formik";
import { useEffect, useState } from "react";



export const MainCandidato = () => {

  const { values, handleChange } = useFormik<dadosConsultaVagaDTO>({
    initialValues: initConsultaVaga,
    onSubmit: pesquisar
  })
  const vagaService = VagaService();
  const utilsService = UtilsService();
  const sessao = ServicoSessao();
  const [estados, setEstado] = useState<estado[]>([]);
  const [cidades, setCidades] = useState<cidade[]>([]);
  const [vagas, setVagas] = useState<cardVagaProps[]>([]);



  //CRIANDO CARD DE VAGA
  function criarCardVaga(dados: cardVagaProps, key: number) {
    return <CardVaga id={dados.id} cidade={dados.cidade} nome_empresa={dados.nome_empresa}
      estado={dados.estado} exclusivo_pcd={dados.exclusivo_pcd} modelo={dados.modelo}
      nivel={dados.nivel} salario={dados.salario} tipo_contrato={dados.tipo_contrato}
      titulo={dados.titulo} sexo_exclusivo={dados.sexo_exclusivo} periodo={dados.periodo} key={key} />
  }


  // RENDERIZANDO CARDS DE VAGAS
  function renderizarCards() {
    return vagas.map(criarCardVaga);
  }


  useEffect(() => {
    (async () => {
      const estadosEncontados: estado[] = await utilsService.buscarEstados();
      setEstado(estadosEncontados);
    })();

  }, [])


  useEffect(() => {
    (async () => {
      const vagasSugeridas: cardVagaProps[] = await vagaService.buscarVagasAlinhadas(sessao.getSessao()?.accessToken + "");
      setVagas(vagasSugeridas);
    })();


  }, [])

  async function buscarCidades(idEstado: number) {
    const cidadesEncontradas = await utilsService.buscarCidadesdeEstado(idEstado);
    setCidades(cidadesEncontradas);
  }


  // CORRIGIR DEPOIS ********************************************************************************************************************
  async function selecionarEstado(estado: HTMLSelectElement) {
    values.idEstado = estado.value;
    values.idCidade = "";
    await buscarCidades(parseInt(estado.value));
  }


  // PESQUISAR POR VAGAS  <<<<< --------------
  async function pesquisar() {
    const dados: dadosConsultaVagaDTO = {
      titulo: values.titulo,
      idCidade: values.idCidade,
      idEstado: values.idEstado,
      modelo: values.modelo,
      senioridade: values.senioridade,
      tipo_contrato: values.tipo_contrato
    }
    const lista: cardVagaProps[] = await vagaService.buscarVaga(dados, sessao.getSessao()?.accessToken + "")
    setVagas(lista);

  }

  // Criando options 
  function criaOption(texto: string, id: number) {
    return (
      <Option key={id} texto={texto} id={id} />
    )
  }

  // Renderizando os options de cidades
  function renderizarOptionsCidade() {
    return (
      cidades.map((cidade) => criaOption(cidade.nome, cidade.id))
    );
  }

  // Renderizando os options de estados
  function renderizarOptionEstados() {
    return estados.map((estado) => criaOption(estado.sigla, estado.id));
  }

  return (
    <div className="h-[100vh]">
      <header className="  shadow-lg shadow-gray-400  rounded-lg border">

        <div className="shadow-lg shadow-gray-700 py-8 h-24 ">

          <div id="logo" className=" inline-block w-[20%]">
            <h1 className="inline-block">Logo Vagas</h1>
          </div>

          <nav className=" inline-block w-[80%] text-right">
            <h2 className="inline-block">Quem somos?</h2>
            <h2 className="inline-block">Fale com o suporte</h2>
            <h2 className="inline-block">Central de ajuda</h2>
            <h2 className="inline-block">Menu</h2>
          </nav>
        </div>


        <div id="imagem" className="pt-6">

          <div id="search" className=" w-[70%] m-auto border border-gray-200 rounded-lg shadow-lg shadow-gray-200">
            <h1 style={{ fontSize: '1.2em' }}
              className="text-black text-center font-bold py-3 ">Busque o seu Rumo Profissional</h1>

            <div className="border border-gray-300 box-border   rounded-full flex items-center w-[50%] h-[5.4vh] m-auto">
              <input id="titulo" onChange={handleChange} type="text" placeholder="Titulo da vaga" className=" font-bold rounded-bl-full rounded-tl-full w-[85%] pl-7 " />
              <div onClick={() => pesquisar()} className="material-symbols cursor-pointer scale-125 text-black ml-3">search</div>
            </div>
            <div id="filtro" className="mt-2">

              <div className="select">
                <h2>Estado:</h2>
                <select value={values.idEstado} onChange={(event) => selecionarEstado(event.target)} id="idEstado">
                  <Todos />
                  {renderizarOptionEstados()}
                </select>
              </div>

              <div className="select">
                <h2>Cidade:</h2>
                <select onChange={handleChange} id="idCidade" value={values.idCidade}>
                  <Todos />
                  {renderizarOptionsCidade()}
                </select>

              </div>


              <div className="select">

                <h2>Nivel:</h2>
                <select onChange={handleChange} id="senioridade">
                  <Todos />
                  <option value="ESTAGIARIO">Estagiario</option>
                  <option value="JUNIOR">Junior</option>
                  <option>Pleno</option>
                  <option>Senior</option>
                </select>
              </div>



              <div className="select">
                <h2>Modelo:</h2>
                <select onChange={handleChange} id="modelo">
                  <Todos />
                  <option value="PRESENCIAL">Presencial</option>
                  <option>Híbrido</option>
                  <option>Remoto</option>
                </select>
              </div>

              <div className="select">
                <h2>Contrato:</h2>
                <select onChange={handleChange} id="tipo_contrato" value={values.tipo_contrato}>
                  <Todos />
                  <option>ESTAGIO</option>
                  <option>CLT</option>
                  <option>PJ</option>
                  <option>TEMPORARIO</option>
                </select>

              </div>
            </div>

          </div>
        </div>
      </header>
      <main className="h-[100vh]">
        <section id="vagas" className=" p-3 flex items-start flex-wrap">
          {renderizarCards()}
        </section>
      </main>
    </div>
  )
}


const Todos = () => {
  return (
    <option value="">Todos</option>
  )
}

interface optionProps {
  texto: string;
  id: number;
}

export const Option: React.FC<optionProps> = ({ texto, id }) => {
  return (
    <option id={texto} value={id} >{texto}</option>
  )
}