import './App.css'
import { FormularioDeEvento } from "./assets/Componentes/FormularioDeEvento";
//function no React é Componente




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