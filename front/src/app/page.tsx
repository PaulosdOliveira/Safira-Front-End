'use client'

import "@/app/styles/main-candidato.css"
import { ServicoSessao } from "@/resources/sessao/sessao";
import { dadosConsultaVagaDTO, initConsultaVaga } from "@/resources/vaga_emprego/DadosConsultaVaga";
import { VagaService } from "@/resources/vaga_emprego/service";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { CardVaga, cardVagaProps } from "./components/cardvaga";

export default function Home() {
  return (
    <div className="">
      <MainCandidato />
    </div>
  );
}


const MainCandidato = () => {

  const { values, handleChange } = useFormik<dadosConsultaVagaDTO>({
    initialValues: initConsultaVaga,
    onSubmit: pesquisar
  })
  const vagaService = VagaService();
  const sessao = ServicoSessao();
  const [estados, setEstado] = useState<string[]>([]);
  const [cidades, setCidades] = useState<string[]>([]);
  const [vagas, setVagas] = useState<cardVagaProps[]>([]);



  //CRIANDO CARD DE VAGA
  function criarCardVaga(dados: cardVagaProps, key: number) {
    return <CardVaga cidade={dados.cidade} nome_empresa={dados.nome_empresa}
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
      const estadosEncontados: string[] = await vagaService.buscarEstados();
      setEstado(estadosEncontados);
    })();

  }, [])


  useEffect(() => {
    (async () => {
      const vagasSugeridas: cardVagaProps[] = await vagaService.buscarVagasAlinhadas(sessao.getSessao()?.accessToken + "");
      setVagas(vagasSugeridas);
    })();


  }, [])

  async function buscarCidades(estado: string) {
    const cidadesEncontradas = await vagaService.buscaCidadesDoEstado(estado);
    setCidades(cidadesEncontradas);
  }


  // CORRIGIR DEPOIS
  async function selecionarEstado(estado: string) {
    values.estado = estado;
    values.cidade = "";
    if (estado.trim()) await buscarCidades(estado);
  }


  // PESQUISAR POR VAGAS  <<<<< --------------
  async function pesquisar() {
    const dados: dadosConsultaVagaDTO = {
      titulo: values.titulo,
      cidade: values.cidade,
      estado: values.estado,
      modelo: values.modelo,
      senioridade: values.senioridade,
      tipo_contrato: values.tipo_contrato
    }
    const lista: cardVagaProps[] = await vagaService.buscarVaga(dados, sessao.getSessao()?.accessToken + "")
    setVagas(lista);

  }

  // Criando options 
  function criaOption(texto: string, key: number) {
    return (
      <Option key={key} texto={texto} />
    )
  }

  // Renderizando os options de cidades
  function renderizarOptionsCidade() {
    return (
      cidades.map(criaOption)
    )
  }

  // Renderizando os options de estados
  function renderizarOptionEstados() {
    return estados.map(criaOption);
  }

  return (
    <div className="h-[400vh]">
      <header className="  shadow-lg shadow-gray-400  rounded-lg ">

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

          <div id="search" className=" w-[70%] m-auto border border-gray-500 rounded-lg shadow-lg shadow-gray-700">
            <h1 style={{ fontSize: '1.2em' }}
              className="text-black text-center font-bold py-3 ">Busque o seu Rumo Profissional</h1>

            <div className="border border-gray-500 box-border  bg-gray-500 rounded-full flex items-center w-[50%] h-[5.4vh] m-auto">
              <input id="titulo" onChange={handleChange} type="text" placeholder="Titulo da vaga" className="bg-white  rounded-bl-full rounded-tl-full w-[85%] " />
              <div onClick={() => pesquisar()} className="material-symbols cursor-pointer scale-125 text-white ml-3">search</div>
            </div>
            <div id="filtro" className="mt-2">

              <div className="select">
                <h2>Estado:</h2>
                <select onChange={(event) => selecionarEstado(event.target.value)} id="estado">
                  <Todos />
                  {renderizarOptionEstados()}
                </select>
              </div>

              <div className="select">
                <h2>Cidade:</h2>
                <select onChange={handleChange} id="cidade" value={values.cidade}>
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
      <main>
        <section className=" p-3 grid grid-cols-2 ">

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
  texto: string
}

const Option: React.FC<optionProps> = ({ texto }) => {
  return (
    <option>{texto}</option>
  )
}