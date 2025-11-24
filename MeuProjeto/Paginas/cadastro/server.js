import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import multer from "multer";
import authRoutes from "../routes/auth.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis do .env
dotenv.config();

const app = express();

// Middleware base
app.use(cors());
app.use(express.json());

// ==============================
//       AUTENTICAÇÃO
// ==============================
app.use("/api/auth", authRoutes);

// ==============================
//       ARQUIVOS ESTÁTICOS
// ==============================

// Servir o frontend principal (páginas de denúncias)
app.use(express.static(path.join(__dirname, "public")));

// Servir imagens de upload
const UPLOADS_DIR = path.join(__dirname, "uploads");
app.use("/uploads", express.static(UPLOADS_DIR));

// Garante que a pasta uploads exista
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// ==============================
//       MULTER (UPLOAD)
// ==============================
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const name = Date.now() + "-" + file.originalname;
        cb(null, name);
    }
});
const upload = multer({ storage });

// ==============================
//    SISTEMA DE DENÚNCIAS
// ==============================
const DATA_FILE = path.join(__dirname, "denuncias.json");

// GET denúncias
app.get("/denuncias", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).json({ erro: "Erro ao ler denúncias." });
        res.json(JSON.parse(data || "[]"));
    });
});

// POST denúncias
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

// ==============================
//       MONGODB
// ==============================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("📦 MongoDB conectado"))
    .catch(err => console.error("❌ Erro MongoDB:", err));

// ==============================
//       INICIAR SERVIDOR
// ==============================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});