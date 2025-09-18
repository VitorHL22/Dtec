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
    {id: 4, nome: "Thiago tung sahur", idade: 26},
    {id: 5, nome: "Micael Brito", idade: 30}

]

app.get('/',(require,response) => {
    response.send("TESTE");
})
app.get('/usuarios',(require,response) => {
    response.json(usuarios)
})
app.get('/usuarios/:id', (require, response) => {
    const id = require.params.id;
    const usuario = usuarios.find(u => u.id ==id);
    if(usuario){
        response.json(usuario)
    }else{
        response.status(404).strictContentLength({mensagem: "Usuário Não Encontrado"})
    }

})

app.get('/usuarios/nome/:nome',(require, response) => {
    const nomezin = require.params.nome.toLowerCase();
    const result = usuarios.filter(user => user.nome.toLowerCase().includes(nomezin))
    if(result.length > 0){
        response.json(result)
    }else{
        response.status(404).json({mensagem: "Usuário Não Encontrado"})
    }
})

app.delete('/usuarios/:id',(require, response) => {
    const id = require.params.id
    usuarios = usuarios.filter(u => u.id != id);

    response.json({mensagem: "Usuário removido com sucesso!"})
})

app.post('/usuarios', (require, response) => {
    const ultimoId = usuarios.reduce((max, usuario) => Math.max(max, usuario.id), 0)
    const novo = {
        id: ultimoId + 1,
        nome: require.body.nome,
        idade: require.body.idade
    };
    usuarios.push(novo)
    response.status(201).json(novo);
})
app.get('/usuarios/idade/:idade', (require, response) => {
    const idade = parseInt(require.params.idade);
    const resultado = usuarios.filter(user => user.idade === idade);
    
    if (resultado.length > 0) {
        response.json(resultado);
    } else {
        response.status(404).json({ mensagem: "usuário não encontrado" });
    }
});

app.put('/usuarios/:id' ,(require, response) => {
    const ide = require.params.id
    const nome = require.body.nome
    const idade = require.body.idade
    const maninho = usuarios.find(obj =>  obj.id == id)

    if (!maninho) {
        return response.status(404).json({mensagem: "Usuário não encontrado"})
    } 
    maninho.nome = nome || maninho.nome
    maninho.idade = idade || maninho.idade
    response.json(maninho)
})