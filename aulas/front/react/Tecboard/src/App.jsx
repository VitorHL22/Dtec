import './App.css'

//function no React é Componente
function Label ({children, htmlFor}) {
  return(
    <label htmlFor={htmlFor}>
    {children}
    </label>
  )
}

function CampoDeFormulario ({ children }){
  return(
    <fieldset>
      {children}
    </fieldset>
  )
}
function TituloFormulario(props) {
  return (
    <h2>{props.children}</h2>
  )
}
function FormularioDeEvento () {
  return (
    <form className='form-evento'>
      <TituloFormulario>
        Preencha para criar um evento: 
      </TituloFormulario>
      <fieldset>

        <Label htmlFor="">Qual é  o nome do evento?</Label>

        <input type="text" id='nome' placeholder='Sumer dev hits' />
      </fieldset>

    </form>
  )
}

function App() {
 
  return (
   <main>
    <header>
      <img src="/logo.png" alt="Logo" />
    </header>

    <section>
      <img src="/banner.png" alt="Banner principal" />
    </section>
    <FormularioDeEvento></FormularioDeEvento>
   </main>

  )
}


export default App