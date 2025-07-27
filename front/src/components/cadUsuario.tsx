'use client'

import { ConsultaCandidatoDTO } from "@/resources/candidato/candidatoResource";



export const CardUsuario: React.FC<ConsultaCandidatoDTO> = ({ nome, id, cidade, estado, idade }) => {


    return (
        < a href={`/candidato/${id}`} target="_blank"
            className="border border-gray-300 bg-white rounded-lg shadow-md shadow-gray-400 cursor-pointer mx-6 w-72 p-2 mb-6 h-32">
            <div className="flex items-center">
                <div style={{ backgroundImage: `url(http://localhost:8080/candidato/foto/${id})` }}
                    className="border border-gray-100 w-20 h-20 rounded-full bg-cover bg-no-repeat" />
                <div>
                    <h2 className="font-bold">{nome}</h2>
                    <h2 className=" pl-1">{idade} Anos</h2>
                </div>
            </div>
            <div className="flex pt-1">
                <div className="material-symbols scale-75 text-gray-700">location_on</div>
                <h2 className="text-gray-700">{cidade}/{estado}</h2>
            </div>
        </a>
    )
}