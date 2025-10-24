import '../FormularioDeEvento/FormularioDeEvento.css'
import { Botao } from "../Botao";
import { CampoDeEntrada } from "../CampoDeEntrada";
import { CampoDeFormulario } from "../CampoDeFormulario";
import { Label } from "../Label";
import { VemLista } from '../VemLista';
import { TituloFormulario } from "../TitulodeFormulario";

export function FormularioDeEvento({ temas, aoSubmeter }) {

  function aoFormSubmetido (FormData) {
    console.log('Está na hora de criar um evento', FormData)
    const evento = {
      capa: FormData.get('capa'),
      tema: temas.find( function (item) {
        return item.id == FormData.get('tema')
      }),
      data: new Date(FormData.get('dataEvento')),
      titulo: FormData.get('nomeEvento')
    }
    aoSubmeter(evento)
  }

  return (
    <form className='form-evento' action={aoFormSubmetido} >
      <TituloFormulario> Preencha para criar um evento:</TituloFormulario>

      <div className='campos'>
        <CampoDeFormulario >
          <Label htmlFor='nomeEvento'>Qual é o nome do evento</Label>

          <CampoDeEntrada type="text" id='nomeEvento' name='nomeEvento' placeholder='Sumer dev hits' />
        </CampoDeFormulario >

        <CampoDeFormulario>
          <Label htmlFor='capa'>Qual é o endereço da imagem de capa</Label>

          <CampoDeEntrada type="text" id='capa' placeholder='http://...' name='capa' />

        </CampoDeFormulario >

        <CampoDeFormulario >
         
          <Label htmlFor='dataEvento'>Qual é a data do evento</Label>

          <CampoDeEntrada type="date" id='dataEvento' name='dataEvento' placeholder='dataEvento'/>

        </CampoDeFormulario>

        <CampoDeFormulario >

          <Label htmlFor='tema'>Qual é o tipo de evento</Label>
          <VemLista id="tema" name="tema" itens={temas} />

        </CampoDeFormulario>

      </div>
      <div className='acoes'>
        <Botao>
          Criar evento
        </Botao>
      </div>



    </form>
  )


}