import './CardEvento.css'

export function CardEvento(evento) {
    return (
        <div>
            <img src={evento.capa} alt={evento.titulo} />
            <div>
                
            </div>
        </div>
    )
}