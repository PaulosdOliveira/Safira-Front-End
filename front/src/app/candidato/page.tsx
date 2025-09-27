'use client'

import { CardVaga, cardVagaProps } from "@/components/cardvaga";
import { Loading } from "@/components/load/loadingPage";
import { Header, Menu } from "@/components/header";
import { ServicoSessao } from "@/resources/sessao/sessao";
import { cidade, estado, UtilsService } from "@/resources/utils/utils";
import { dadosConsultaVagaDTO, initConsultaVaga } from "@/resources/vaga_emprego/DadosVaga";
import { VagaService } from "@/resources/vaga_emprego/service";
import { useFormik } from "formik";
import { useEffect, useState } from "react";



export default function MainCandidato() {

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
  // ATIVA A ANIMAÇÃO DOS CARDS DE VAGA
  const [buscando, setBuscando] = useState(false);
  // TELA DE CARREGAMENTO
  const [montado, setMontado] = useState(false);

  // TELA DE CARREGAMENTO

  //CRIANDO CARD DE VAGA
  function criarCardVaga(dados: cardVagaProps, key: number) {
    return <CardVaga id={dados.id} cidade={dados.cidade} nome_empresa={dados.nome_empresa}
      estado={dados.estado} exclusivo_pcd={dados.exclusivo_pcd} modelo={dados.modelo}
      nivel={dados.nivel} salario={dados.salario} tipo_contrato={dados.tipo_contrato}
      titulo={dados.titulo} sexo_exclusivo={dados.sexo_exclusivo} periodo={dados.periodo} key={key}
      load={buscando} />
  }


  // RENDERIZANDO CARDS DE VAGAS
  function renderizarCards() {
    return vagas.map(criarCardVaga);
  }


  useEffect(() => {
    (async () => {
      const estadosEncontados: estado[] = await utilsService.buscarEstados();
      setEstado(estadosEncontados);
      setMontado(true);
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



  async function selecionarEstado(estado: HTMLSelectElement) {
    values.idEstado = estado.value;
    values.idCidade = "";
    if (values.idEstado.length)
      await buscarCidades(parseInt(estado.value));
    else setCidades([]);
  }


  // PESQUISAR POR VAGAS  <<<<< --------------
  async function pesquisar() {
    setBuscando(true);
    setTimeout(async () => {
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
      setBuscando(false)
    }, 4000)

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

  if (!montado) return <Loading />

  return (
    <div className="min-h-[100vh] h-auto bg-[rgb(249,249,249)] font-[arial]">
      <Header />

      <div className="pb-1">
        <div className="w-[100%] flex justify-center items-center h-20">
          <div className="relative flex items-center">
            <input id="titulo" onChange={handleChange} type="text" placeholder="Titulo da vaga" className="rounded-lg pt-0.5 sm:w-[360px] w-[320px] h-[50px] pl-3 pr-13 border border-gray-300 bg-white" />
            <i onClick={() => pesquisar()} className="material-symbols scale-125 text-gray-600 -ml-9 cursor-pointer">search</i>
          </div>
        </div>

      </div>

      <section id="filtro" className="mt-2 text-[.9em] flex justify-center flex-wrap">
        <div className="inline-block mx-[5px]">
          <p >Estado:</p>
          <select id="idEstado" className="cursor-pointer border border-gray-200 bg-white rounded-sm h-8 px-1"
            onChange={(event) => selecionarEstado(event.target)} >
            <option value="">Todos</option>
            {renderizarOptionEstados()}
          </select>
        </div>

        <div className="inline-block mx-[5px]">
          <p>Cidade:</p>
          <select className="cursor-pointer border  border-gray-300 bg-white rounded-sm h-8 px-1"
            onChange={handleChange} id="idCidade" value={values.idCidade}>
            <option value="">Todas</option>
            {renderizarOptionsCidade()}
          </select>
        </div>


        <div className="inline-block mx-[5px]">
          <p>Nivel:</p>
          <select className="cursor-pointer border  border-gray-300 bg-white rounded-sm h-8 px-1" onChange={handleChange} id="senioridade">
            <option value="">Todos</option>
            <option value="ESTAGIARIO">Estagiario</option>
            <option value="JUNIOR">Junior</option>
            <option>Pleno</option>
            <option>Senior</option>
          </select>
        </div>

        <div className="inline-block mx-[5px]">
          <p>Modelo:</p>
          <select className="cursor-pointer border  border-gray-300 bg-white rounded-sm h-8 px-1"
            onChange={handleChange} id="modelo">
            <option value="">Todos</option>
            <option value="PRESENCIAL">Presencial</option>
            <option>Híbrido</option>
            <option>Remoto</option>
          </select>
        </div>

        <div className="inline-block mx-[5px]">
          <p>Contrato:</p>
          <select className="cursor-pointer border  border-gray-300 bg-white rounded-sm h-8 px-1"
            onChange={handleChange} id="tipo_contrato" value={values.tipo_contrato}>
            <option value="">Todos</option>
            <option>ESTAGIO</option>
            <option>CLT</option>
            <option>PJ</option>
            <option>TEMPORARIO</option>
          </select>
        </div>
      </section>
      <main className="">
        <section id="vagas" className="flex flex-wrap justify-center mt-10 m-auto px-[2%] overflow-auto text-center">
          {vagas.length ? (
            renderizarCards()
          ) : (
            <>
              {buscando ? (
                <div>
                  
                  <div className="h-16 w-16 border-t-4 rounded-full border-pink-500 animate-spin"></div>
                </div>
              ) : (
                <h2>Nenhuma vaga encontrada</h2>)
              }
            </>
          )}
        </section>
      </main>
    </div>
  )
}


interface optionProps {
  texto: string;
  id: number;
}
// Componente utilizado para tranformar lista[] em <option>
export const Option: React.FC<optionProps> = ({ texto, id }) => {
  return (
    <option id={texto} value={id} >{texto}</option>
  )
}





