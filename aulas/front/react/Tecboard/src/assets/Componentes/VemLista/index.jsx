import '../VemLista/VemLista.css'

export function VemLista({ itens = [], ...rest }) {
    return (
        <select {...rest} defaultValue="" className='lista-suspensa-form'>
            <option disabled value=''>Selecione uma opção</option>

            {itens.map((item) => (
                <option key={item.id} value={item.id}>
                    {item.nome}
                </option>
            ))}
        </select>
    )
}
