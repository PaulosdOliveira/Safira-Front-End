'use client'

import { Qualificacao } from "@/resources/qualificacao/qualificacaoResource";


export const OptionQualificacao: React.FC<Qualificacao> = ({ id, nome }) => {
    return (
        <option id={`${id}`} value={id}>{nome}</option>
    );
}