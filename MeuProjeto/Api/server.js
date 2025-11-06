const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, "denuncias.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));
app.use("/uploads", express.static(UPLOADS_DIR)); // servir imagens enviadas

// Garante que a pasta uploads exista
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// Configuração do multer (upload de imagens)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Rota para obter denúncias
app.get("/denuncias", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ erro: "Erro ao ler denúncias." });
    res.json(JSON.parse(data || "[]"));
  });
});

// Rota para enviar nova denúncia
app.post("/denuncias", upload.array("imagens"), (req, res) => {
  const { local, tipo, descricao } = req.body;
  const imagens = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
  const novaDenuncia = {
    local,
    tipo,
    descricao,
    imagens,
    data: new Date().toISOString()
  };

  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    let denuncias = [];
    if (!err && data) denuncias = JSON.parse(data);

    denuncias.push(novaDenuncia);

    fs.writeFile(DATA_FILE, JSON.stringify(denuncias, null, 2), err => {
      if (err) return res.status(500).json({ erro: "Erro ao salvar denúncia." });
      res.status(201).json(novaDenuncia);
    });
  });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
