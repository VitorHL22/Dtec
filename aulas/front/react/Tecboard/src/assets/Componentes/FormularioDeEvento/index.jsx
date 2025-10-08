import '../FormularioDeEvento/FormularioDeEvento.css'

import {CampoDeEntrada} from "../CampoDeEntrada"
import{TituloFormulario} from '../TitulodeFormulario'
import {Label} from "../Label"
import { CampoDeFormulario } from '../CampoDeFormulario'
import {VemLista} from "../VemLista"

export function FormularioDeEvento () {
  return (
    <form className='form-evento'>
      <TituloFormulario>
        Preencha para criar um evento: 
      </TituloFormulario>

      <div className='campos'>

      <CampoDeFormulario>
        <Label htmlFor="nome">Qual é  o nome do evento?</Label>
        <CampoDeEntrada type="text" id='nome' placeholder='Sumer dev hits' />
      </CampoDeFormulario>

      <CampoDeFormulario>
        <Label htmlFor="dataEvento">Qual é a Data do Evento?</Label>
        <CampoDeEntrada type="date" id='nome' placeholder='Sumer dev hits' />
      </CampoDeFormulario>
      <CampoDeFormulario>
        <Label htmlFor="">Qual é  o nome do evento?</Label>
        <VemLista/> 
      </CampoDeFormulario>
      </div>
    </form>
  )
}