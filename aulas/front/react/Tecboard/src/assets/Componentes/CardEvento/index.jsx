import './CardEvento.css'

export function CardEvento({evento}) {
    return (
        <div className='card-evento'>
            <img src={evento.capa} alt={evento.titulo} />
            <div  className='corpo'>
                <p className='tag'>
                    {evento.tema.nome}
                </p>
                <p>
                    {evento.data.toLocaleDateString('pt-BR')}
                </p>{/*Pega a data atual no local padrão Pt-BR */}
                <h4 className='titulo'>
                    {evento.titulo}
                </h4>
            </div>
        </div>
    )
}