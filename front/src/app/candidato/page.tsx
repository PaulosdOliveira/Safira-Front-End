'use client'

import { CardVaga, cardVagaProps } from "@/components/cardvaga";
import { Loading } from "@/components/load/loadingPage";
import { Header, Menu } from "@/components/header";
import { ServicoSessao } from "@/resources/sessao/sessao";
import { cidade, estado, UtilsService } from "@/resources/utils/utils";
import { dadosConsultaVagaDTO, initConsultaVaga, PageCardVaga } from "@/resources/vaga_emprego/DadosVaga";
import { VagaService } from "@/resources/vaga_emprego/service";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Footer } from "@/components/footer"
import ReactPaginate from "react-paginate";



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
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [vagas, setVagas] = useState<PageCardVaga>();
  const divRef = useRef<HTMLDivElement | null>(null);
  // ATIVA A ANIMAÇÃO DOS CARDS DE VAGA
  const [buscando, setBuscando] = useState(false);
  // TELA DE CARREGAMENTO
  const [montado, setMontado] = useState(false);


  // PESQUISANDO AO MUDAR DE PÁGINA
  useEffect(() => {
    // IGNORANDO A PRIMEIRA RENDERIZAÇÃO
    if (montado) pesquisar();
  }, [pageNumber])

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
    return vagas?.vagas?.map(criarCardVaga);
  }


  // BUSCANDO ESTADOS PARA PREENCHER O <SELECT/>
  useEffect(() => {
    (async () => {
      const estadosEncontados: estado[] = await utilsService.buscarEstados();
      setEstado(estadosEncontados);
      setMontado(true);
    })();
  }, [])

  // BUSCANDO VAGAS ALINHADAS COM O PERFIL DO USUÁRIO
  useEffect(() => {
    (async () => {
      const vagasSugeridas: PageCardVaga = await vagaService.buscarVagasAlinhadas(sessao.getSessao()?.accessToken + "");
      setVagas(vagasSugeridas);
    })();
  }, [])

  // BSUCANDO CIDADES AO SELECIONAR UM ESTADO
  async function buscarCidades(idEstado: number) {
    const cidadesEncontradas = await utilsService.buscarCidadesdeEstado(idEstado);
    setCidades(cidadesEncontradas);
  }

  // FUNÇÃO DISPARADA AO SELECIONAR UM ESTADO
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
    divRef.current?.scrollIntoView({
      behavior: "instant",
      block: 'start'
    })
    setTimeout(async () => {
      const dados: dadosConsultaVagaDTO = {
        titulo: values.titulo,
        idCidade: values.idCidade,
        idEstado: values.idEstado,
        modelo: values.modelo,
        senioridade: values.senioridade,
        tipo_contrato: values.tipo_contrato,
        pageNumber: pageNumber
      }
      const pageVagas: PageCardVaga = await vagaService.buscarVaga(dados, sessao.getSessao()?.accessToken + "")
      setVagas(pageVagas);
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
    <div ref={divRef} className="min-h-[100vh] h-auto bg-[rgb(249,249,249)] font-[arial]">
      <Header logado={true} />
      <div className="pb-1">
        <div className="w-[100%] flex justify-center items-center h-20">
          <div className="flex items-center justify-center w-full">
            <input style={{boxShadow: '1px 1px .5px .5px rgba(0,0,0,0.300)'}}
              id="titulo" onChange={handleChange} type="text" placeholder="Titulo da vaga" className="rounded-lg pt-0.5 sm:w-[360px] w-[320px] h-[50px] pl-3 pr-13 border border-gray-400 bg-white shadow-gray-200" />
            <i onClick={() => { setPageNumber(0), pesquisar() }} className="material-symbols scale-125 text-gray-600 -ml-9 cursor-pointer">search</i>
          </div>
        </div>
      </div>
      <section id="filtro" className="mt-2 text-[.9em] flex justify-center flex-wrap">
        <div className="inline-block mx-[5px]">
          <p >Estado:</p>
          <select id="idEstado" className="cursor-pointer border border-gray-400 bg-white rounded-sm h-8 px-1"
            onChange={(event) => selecionarEstado(event.target)} >
            <option value="">Todos</option>
            {renderizarOptionEstados()}
          </select>
        </div>
        <div className="inline-block mx-[5px]">
          <p>Cidade:</p>
          <select className="cursor-pointer border  border-gray-400 bg-white rounded-sm h-8 px-1"
            onChange={handleChange} id="idCidade" value={values.idCidade}>
            <option value="">Todas</option>
            {renderizarOptionsCidade()}
          </select>
        </div>
        <div className="inline-block mx-[5px]">
          <p>Nivel:</p>
          <select className="cursor-pointer border  border-gray-400 bg-white rounded-sm h-8 px-1" onChange={handleChange} id="senioridade">
            <option value="">Todos</option>
            <option value="ESTAGIARIO">Estagiario</option>
            <option value="JUNIOR">Junior</option>
            <option>Pleno</option>
            <option>Senior</option>
          </select>
        </div>

        <div className="inline-block mx-[5px]">
          <p>Modelo:</p>
          <select className="cursor-pointer border  border-gray-400 bg-white rounded-sm h-8 px-1"
            onChange={handleChange} id="modelo">
            <option value="">Todos</option>
            <option value="PRESENCIAL">Presencial</option>
            <option>Híbrido</option>
            <option>Remoto</option>
          </select>
        </div>

        <div className="inline-block mx-[5px]">
          <p>Contrato:</p>
          <select className="cursor-pointer border  border-gray-400 bg-white rounded-sm h-8 px-1"
            onChange={handleChange} id="tipo_contrato" value={values.tipo_contrato}>
            <option value="">Todos</option>
            <option>ESTAGIO</option>
            <option>CLT</option>
            <option>PJ</option>
            <option>TEMPORARIO</option>
          </select>
        </div>
      </section>
      <main className="min-h-[500px] max-h-fit">
        <section id="vagas" className="flex flex-wrap justify-center mt-10 m-auto px-[2%] overflow-auto text-center">
          {vagas?.vagas?.length ? (
            <>
              {renderizarCards()}
            </>
          ) : (
            <>
              {buscando ? (
                <div>

                  <div className="h-16 w-16 border-t-4 rounded-full border-pink-500 animate-spin"></div>
                </div>
              ) : (
                <h2 className="font-[Fredericka_the_Great]">Nenhuma vaga à exibir</h2>)
              }
            </>
          )}
        </section>
        <div className="pt-2 h-fit my-10 w-fit m-auto flex items-center justify-center gap-x-3 ">
          <ReactPaginate 
            previousLabel="arrow_left"
            nextLabel="arrow_right"
            pageCount={vagas?.totalPages!}
            containerClassName={`flex gap-2 ${vagas?.totalPages! < 1? 'hidden' : ''}`}
            pageClassName="px-3 py-2 border rounded cursor-pointer hover:bg-gray-700"
            activeClassName="bg-blue-500 text-white"
            nextLinkClassName="material-symbols cursor-pointer"
            previousClassName="material-symbols cursor-pointer"
            onPageChange={(index) => { setPageNumber(index.selected) }}
          />
        </div>
      </main>
      <Footer />
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





