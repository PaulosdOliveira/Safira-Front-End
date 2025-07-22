'use client'



interface t {
    nome: string;
    id?: number;
}


export const CardUsuario: React.FC<t> = ({ nome, id }) => {

    
    return (
        < a href={`/candidato/${id}`} target="_blank"
         className="border border-gray-300 bg-white flex items-center w-96 rounded-lg shadow-md shadow-gray-400 cursor-pointer ml-6">
            <div style={{ backgroundImage: `url(http://localhost:8080/candidato/foto/${id})` }}
                className="border border-gray-100 w-20 h-20 rounded-full bg-contain"></div>
            <h2>{nome}</h2>
        </a>
    )
}