const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let books = [];

// Listar livros
app.get('/books', (req, res) => {
  res.json(books);
});

// Adicionar livro
app.post('/books', (req, res) => {
  books.push(req.body);
  res.json({ message: 'Livro adicionado!', book: req.body });
});

// Editar livro
app.put('/books/:index', (req, res) => {
  const index = req.params.index;
  books[index] = req.body;
  res.json({ message: 'Livro atualizado!' });
});

// Deletar livro
app.delete('/books/:index', (req, res) => {
  const index = req.params.index;
  books.splice(index, 1);
  res.json({ message: 'Livro deletado!' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});