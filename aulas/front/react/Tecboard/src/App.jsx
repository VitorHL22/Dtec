import './App.css'
import { Banner } from './assets/Componentes/Banner'
import { FormularioDeEvento } from './assets/Componentes/FormularioDeEvento'
import { Tema } from './assets/Componentes/Tema'
import { CardEvento } from './assets/Componentes/CardEvento'
import { useState } from 'react'

//No react, componentes são FUNÇÕES


function App() {

  // Vamos criar um array / //Vamos criar uma lista de objetos
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
      nome: 'inteligência artificial'
    },
    {
      id: 5,
      nome: 'data science'
    },
    {
      id: 6,
      nome: 'cloud'
    }
  ]
/*  O use State cuida do nosso estado, ele retornar para nós um array de duas posições */
  const [eventos, setEventos ] = useState ([
    {
      capa: 'https://raw.githubusercontent.com/viniciosneves/tecboard-assets/refs/heads/main/imagem_1.png',
      tema: temas[0],
      data: new Date(),
      titulo: 'Mulheres no Front'
    }
  ] )

  function adicionarEvento(evento) {
    setEventos([...eventos, evento])
    
    /* eventos.push(evento)
    console.log('eventos =>', eventos) */
  }

  return (
    <main>
      <header>
        <img src="/logo.png" alt="Tecboard" />
      </header>
      <Banner />
      <FormularioDeEvento
        temas={temas}
        aoSubmeter={adicionarEvento} />

<section className="container">
      {temas.map(function (tema) {
        if(!eventos.some(function(evento){
          return evento.tema.id == tema.id
        }))
        {
          return null
        }
        return (
          <section key={tema.id} >
            <Tema tema={tema} />
            <div className="eventos">
            {eventos.filter(function (evento) {
              return evento.tema.id == tema.id
            })
            .map(function(item, index){
              return (
                <CardEvento evento={item} key={index}/>
              )
            })}
          </div>
          </section>
        )
      })}
      </section>
    </main>
  )
}
export default App