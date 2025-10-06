import '../FormularioDeEvento/FormularioDeEvento.css'

import {CampoDeEntrada} from "../CampoDeEntrada"
export function FormularioDeEvento () {
  return (
    <form className='form-evento'>
      <TituloFormulario>
        Preencha para criar um evento: 
      </TituloFormulario>
      <CampoDeFormulario>


        <Label htmlFor="">Qual é  o nome do evento?</Label>

        <input type="text" id='nome' placeholder='Sumer dev hits' />
      </CampoDeFormulario>

    </form>
  )
}