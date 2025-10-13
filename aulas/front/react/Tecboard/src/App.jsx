import './App.css'
import { FormularioDeEvento } from "./assets/Componentes/FormularioDeEvento";
import {Tema} from "./assets/Componentes/Tema"
//function no React é Componente

function App() {
 
  const temas =[
    {
      id:1,
      nome: 'front-end'
    },
    {
      id:2,
      nome: 'back-end'
    },
    {
      id:3,
      nome: 'devops'
    },
    {
      id:4,
      nome: 'inteligencia artificial'
    },
    {
      id:5,
      nome: 'data science',
    },
    {
      id:6,
      nome: 'cloud',
    }
  ]
  return (
   <main>
    <header>
      <img src="/logo.png" alt="Logo" />
    </header>


    <FormularioDeEvento/>
    <section>
      <Tema tema={temas[0]}></Tema>
    </section>
   </main>

  )
}


export default App