const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3001;

let livros = [
    { id: 1, nome: "Biblioteca da meia noite", autor: "Matt Haig", ano: 2020, cover: "https://i.pinimg.com/1200x/0b/be/3f/0bbe3f2e912495ebe7d8efa9b3c78c0a.jpg" },
    { id: 2, nome: "A quarta asa", autor: "Rebeca Yarros", ano: 2023, cover: "https://i.pinimg.com/1200x/b0/43/26/b0432685fecd41cee92e99816cc4de54.jpg" },
    { id: 3, nome: "A Hora da Estrela", autor: "Clarice Lispector", ano: 1977, cover: "https://i.pinimg.com/736x/a2/3c/30/a23c30cfacb9f28a3801cf7ad88e9604.jpg" },
    { id: 4, nome: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", ano: 1943, cover: "https://i.pinimg.com/736x/17/5f/3e/175f3e31cdcbc334e75e2fcc46b57531.jpg" },
    { id: 5, nome: "Minha versão de você", autor: "Christina Lauren", ano: 2017, cover: "https://i.pinimg.com/736x/e4/0f/0e/e40f0eab09dc1b39fb8fc62752bc6f8d.jpg" }
];

// Rota inicial
app.get('/', (req, res) => {
    res.send("API de Livros Rodando");
});

// Retorna todos os livros
app.get('/livros', (req, res) => {
    res.json(livros);
});

// Retorna livro por ID
app.get('/livros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const livro = livros.find(u => u.id === id);

    if (livro) {
        res.json(livro);
    } else {
        res.status(404).json({ mensagem: "Livro não encontrado" });
    }
});

// Busca por nome
app.get('/livros/nome/:nome', (req, res) => {
    const buscaNome = req.params.nome.toLowerCase();
    const resultados = livros.filter(u => u.nome.toLowerCase().includes(buscaNome));
    if (resultados.length > 0) {
        res.json(resultados);
    } else {
        res.status(404).json({ mensagem: "Livro Não Encontrado" });
    }
});

// Busca por autor
app.get('/livros/autor/:autor', (req, res) => {
    const autor = req.params.autor.toLowerCase();
    const resultados = livros.filter(u => u.autor.toLowerCase() === autor);
    if (resultados.length > 0) {
        res.json(resultados);
    } else {
        res.status(404).json({ mensagem: "Autor Não Encontrado" });
    }
});

// Busca por ano
app.get('/livros/ano/:ano', (req, res) => {
    const ano = parseInt(req.params.ano);
    const resultados = livros.filter(u => u.ano === ano);
    if (resultados.length > 0) {
        res.json(resultados);
    } else {
        res.status(404).json({ mensagem: "Ano do livro desconhecido" });
    }
});

// Deletar livro
app.delete('/livros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    livros = livros.filter(u => u.id !== id);
    res.json({ mensagem: "Livro removido com sucesso" });
});

// Criar livro
app.post('/livros', (req, res) => {
    const novoLivro = {
        id: livros.length ? livros[livros.length - 1].id + 1 : 1,
        nome: req.body.nome,
        autor: req.body.autor,
        ano: req.body.ano,
        cover: req.body.cover || "https://via.placeholder.com/150"
    };
    livros.push(novoLivro);
    res.status(201).json(novoLivro);
});

// Editar livro
app.put('/livros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const livro = livros.find(u => u.id === id);

    if (!livro) {
        return res.status(404).json({ mensagem: "Livro não encontrado" });
    }

    livro.nome = req.body.nome || livro.nome;
    livro.autor = req.body.autor || livro.autor;
    livro.ano = req.body.ano || livro.ano;
    livro.cover = req.body.cover || livro.cover;

    res.json(livro);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
