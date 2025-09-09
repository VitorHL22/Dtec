//Importação do Express
const express = require('express')
//Importação do cors
const cors = require('cors');

//Criar a aplicação
const app = express();

//Permitir trabalhar com JSON
app.use(express.json());
//Permitir trabalhar com cors
app.use(cors())

//Permitir trabalhar com Json
app.use(express.json());

//Porta onde a APi vai rodar
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})

let usuarios = [
    {id: 1, nome: "Bluezao", idade: 25},
    {id: 2, nome: "Diogo", idade: 34},
    {id: 3, nome: "Davi Brito", idade: 24},
    {id: 4, nome: "Thiago tung sahur", idade: 26}
]

app.get('/',(require,response) => {
    response.send("TESTE");
})
app.get('/usuarios',(require,response) => {
    response.json(usuarios)
})
app.get('/usuarios/:id', (req, res) => {
    const id =require.params.id
    const usuario = usuarios.find(usu => usu.id ==id);
    response.json(usuario)

}
)