const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;
const arquivoDenuncias = path.join(__dirname, "denuncias.json");

app.get("/denuncias", (req, res) => {
  fs.readFile(arquivoDenuncias, "utf8", (err, data) => {
    if (err) return res.status(500).json({ erro: "Erro ao ler arquivo" });
    const denuncias = JSON.parse(data || "[]");
    res.json(denuncias);
  });
});

// 🟢 Adicionar nova denúncia
app.post("/denuncias", (req, res) => {
  const novaDenuncia = req.body;

  fs.readFile(arquivoDenuncias, "utf8", (err, data) => {
    const denuncias = err ? [] : JSON.parse(data || "[]");
    denuncias.push(novaDenuncia);

    fs.writeFile(arquivoDenuncias, JSON.stringify(denuncias, null, 2), (err) => {
      if (err) return res.status(500).json({ erro: "Erro ao salvar denúncia" });
      res.status(201).json(novaDenuncia);
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
