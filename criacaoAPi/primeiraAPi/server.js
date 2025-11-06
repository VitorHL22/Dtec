//CARREGAR VARIÁVEIS DE AMBIENTE
require('dotenv').config()

//Importando o express
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//importação models
const Pessoa = require ('./models/Pessoa')
const User = require ('./models/User')

const PORT = process.env.PORT || 3009;
const mongoURI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET

//CONEXÃO MONGODB
mongoose.connect(mongoURI)
  .then(() => console.log("Conectado ao MongoDb Atlas"))
  .catch(error => {
    console.error("Falha na Conexão ao MongoDB",error.message);
    process.exit(1);
  })

  const generateToken = (id) => {
    returnjwt.sing({id}, JWT_SECRET, {expiresIn: "1d"})
  }

//Função protetora dos endpoints
const protect = (req, res, next) => {
  let token;

  if(req.headers.authorization && req.header.authorization.startsWith('bearer')){
    try{
    token = req.headers.authorization.split(' ') [1]; 
    jwt.verify(token, JWT_SECRET);
    next()
    }catch(error ){
      return res.status(401).json({mensagem: "token invalido"})
    }
  }
}

//Criando minha aplicação
const app = express()

//Permitir trabalhar com json
app.use(express.json())
app.use(cors())





app.get('/',(req,res) => {
  res.send("PÁGINA INICIAL")
})


app.get('/usuarios',async (req,res) => {
    try {
      const usuarios = await Pessoa.find({});
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({mensagem: "Erro ao buscar usuários",erro: error.message})
    }
})

app.get('/usuarios/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const usuario = await Pessoa.findById(id);

      if(usuario){
        res.json(usuario)
      }else{
        res.status(404).json({mensagem: "Usuário Não encontrado"})
      }
    } catch (error) {
      res.status(400).json({mensagem: "Erro de Servidor", erro: error.message})
    }
})

app.get('/usuarios/nome/:nome', async (req,res) => {
  try{
    const buscaNome = req.params.nome;
    const resultados = await Pessoa.find({
      nome: {$regex: buscaNome, $options: 'i'}
    });
    if (resultados.length > 0) {
      res.json(resultados);
    }else {
      res.status(404).json({mensagem: "Usuário Não Encontrado"})
    }
  } catch (error) {
    console.error("Erro na busca", error);
    res.status(500).json({mensagem: "Erro no servidor", erro: error.message})
  }
    
})

app.get('/usuarios/idade/:idade', async (req,res) => {
  try{
    const buscaIdade = req.params.idade;
    const resultados = await Pessoa.find({
      idade: buscaIdade
    });
    if (resultados.length > 0) {
      res.json(resultados);
    }else {
      res.status(404).json({mensagem: "Usuário Não Encontrado"})
    }
  } catch (error) {
    console.error("Erro na busca", error);
    res.status(500).json({mensagem: "Erro no servidor", erro: error.message})
  }
})

app.delete('/usuarios/:id',  protect, async (req, res) => {
  try {
    const id = req.params.id;
    const usuarioDeletado = await Pessoa.findByIdAndDelete(id);

    if(!usuarioDeletado) {
      return res.status(404).json({mensagem: "Usuário Não Encontrado"})
    }
    res.json({mensagem: "Usuário deletado", usuario: usuarioDeletado});
  }catch (error) {
    res.status(400).json({mensagem: "Erro ao deletar", erro: error.message})
  } 
})

// A sua rota POST para criar um novo usuário
app.post('/usuarios', async (req, res) => {
    try {
      const novoUsuario = await Pessoa.create({
        nome: req.body.nome,
        idade: req.body.idade
      });
      res.status(201).json(novoUsuario);
    }catch (error) {
      res.status(400).json({mensagem: "Dados Inválidos ou Erro ao salvar", erro: error.message})
    }
});

app.put('/usuarios/:id', async (req,res) => {
  try {
    const id = req.params.id
    const nome = req.body.nome
    const idade = req.body.idade
    const usuarioAtualizado = await Pessoa.findByIdAndUpdate(
      id,
      {nome, idade},
      {new: true, runValidators: true}
    )
    if (!usuarioAtualizado){
      return res.status(404).json({mensagem: " Usuário Não Encontrado"})
    }
    res.json(usuarioAtualizado)
  }catch{
    res.status(400).json({mensagem: "Erro ao atualizar", erro: error.message})
  }
})
//RoTAS ADMIN - Criação de  usuario
app.post('/api/register-admin', async (req,res) => {
  const {email, password}  = req.body
  try{
    const userExists = await User.findOne({email})
    if(userExists) {
      return res.status(400).json({mensagem: "Usuário já existe"})
    }
    const user = await User.create({email, password})
    res.status(201).json({mensagem: "Usuário criado com sucesso"})
  }catch(error)  {
    res.status(500).json({mensagem: " Erro no registro", erro: error.message})
  }
})

//Rota de Login 

app.post('api/login-admin', async (req, res) => {
  const {email, password } = req.body
  try {
     const user = await User.findOne({email}).select('+password');
     if(user && (await user.matchPassword(password))) {
      res.json({
        email: user.email,
        token: generateToken(user._id),
        mensagem: "Login Realizado"
      })
     } else {
      res.status(401).json({mensagem: "Credencial Inválida"})
     }
  }catch(error) {
    res.status(500).json({mensagem: "Erro de Login", erro: error.message})
  }
})

//Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor na porta ${PORT}`)
})
