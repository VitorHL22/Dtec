import './App.css'
import { FormularioDeEvento } from "./assets/Componentes/FormularioDeEvento";
import { Tema } from "./assets/Componentes/Tema"
import { Banner } from './assets/Componentes/Banner'
//function no React é Componente

function App() {

  const temas = [
    {
      id: 1,
      nome: 'front-end'
    },
    {
      id: 2,
      nome: 'back-end'
    },
    {
      id: 3,
      nome: 'devops'
    },
    {
      id: 4,
      nome: 'inteligencia artificial'
    },
    {
      id: 5,
      nome: 'data science',
    },
    {
      id: 6,
      nome: 'cloud',
    }
  ]

  const eventos = [
    {
      capa: 'http://..',
      tema: temas[0],
      data: new Date(),
      titulo: 'Mulheres no front'
    }
  ]
  return (
    <main>
      <header>
        <img src="/logo.png" alt="Logo" />
      </header>

      <Banner />

      <FormularioDeEvento />

      {temas.map(function (item) {
        return(
        <section key ={item.id}>
          <Tema tema={item} />
          <Cardevento evento ={eventos[0]}/>
        </section>
        )
      })}
    </main>
  )
}


export default App