'use client'

import { ConsultaCandidatoDTO } from "@/resources/candidato/candidatoResource";



export const CardUsuario: React.FC<ConsultaCandidatoDTO> = ({ nome, id, cidade, estado, idade }) => {


    return (
        < a href={`/candidato/${id}`} target="_blank"
            className="border border-gray-300 bg-white rounded-lg shadow-md shadow-gray-400 cursor-pointer w-72 p-2  h-32 ">
            <div className="flex items-center">
                <div style={{ backgroundImage: `url(http://localhost:8080/candidato/foto/${id})` }}
                    className="border border-gray-100 w-20 h-20 rounded-full bg-cover bg-no-repeat" />
                <div>
                    <p className="font-bold">{nome}</p>
                    <p className=" pl-1">{idade} Anos</p>
                </div>
            </div>
            <div className="flex pt-1">
                <i className="material-symbols scale-75 text-gray-700">location_on</i>
                <p className="text-gray-700">{cidade}/{estado}</p>
            </div>
        </a>
    )
}