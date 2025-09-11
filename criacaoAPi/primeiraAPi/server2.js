const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

let posts = [
  {id: uuidv4(), autor: "Charles Perrault", titulo: "Chapeuzinho Vermelho", conteudo: "Historinha", dataCriacao: "1697", comentarios: ["Ótimo"]},
  {id: uuidv4(), autor: "Jeff Kinney", titulo: "Diários de um Banana", conteudo: "Historrinha", dataCriacao: "01/04/2007", comentarios: ["Legal"]}
];

app.get('/', (require, response) => {
  response.send("Teste");
});

app.get('/posts', (require, response) => {
  response.json(posts);
});

app.get('/posts/:id', (require, response) => {
  const id = require.params.id;
  const encontrado = posts.find(p => p.id === id);

  if(encontrado){
    response.json(encontrado);
  } else {
    response.status(404).json({mensagem: "Post não encontrado"});
  }
});
app.post('/posts', (req, res) => {
  const { autor, titulo, conteudo } = req.body;
  const novo = {
    id: uuidv4(),
    autor,
    titulo,
    conteudo,
    dataCriacao: new Date().toISOString(),
    comentarios: []
  };
  posts.push(novo);
  res.status(201).json(novo);
});
app.put('/posts/:id', (require, response) => {
  const id = require.params.id;
  const { autor, titulo, conteudo } = require.body;
  const encontrado = posts.find(p => p.id === id);

  if(encontrado){
    encontrado.autor = autor || encontrado.autor;
    encontrado.titulo = titulo || encontrado.titulo;
    encontrado.conteudo = conteudo || encontrado.conteudo;
    response.json(encontrado);
  } else {
    response.status(404).json({mensagem: "não encontrado"});
  }
});
app.delete('/posts/:id', (require, response) => {
  const id = require.params.id;
  const index = posts.findIndex(p => p.id === id);

  if(index !== -1){
    posts.splice(index, 1);
    response.status(204).send();
  } else {
    response.status(404).json({mensagem: "Não encontrado"});
  }
});
app.post('/posts/:id/comentarios', (require, response) => {
  const id = require.params.id;
  const { comentario } = require.body;
  const postEncontrado = posts.find(p => p.id === id);

  if(postEncontrado){
    postEncontrado.comentarios.push(comentario);
    response.status(201).json(postEncontrado);
  } else {
    response.status(404).json({mensagem: "não encontrado"});
  }
});