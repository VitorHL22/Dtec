import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Usuario.js";

const router = express.Router();

// Rota de Cadastro
router.post("/register", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        const existe = await User.findOne({ email });
        if (existe) return res.status(400).json({ msg: "Usuário já cadastrado!" });

        const hash = await bcrypt.hash(senha, 10);
        const novoUser = new User({ nome, email, senha: hash });
        await novoUser.save();

        res.json({ msg: "Cadastro realizado com sucesso!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erro interno no servidor" });
    }
});

// Rota de Login
router.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "Usuário não encontrado" });

        const match = await bcrypt.compare(senha, user.senha);
        if (!match) return res.status(401).json({ msg: "Senha incorreta" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({
            msg: "Login realizado com sucesso!",
            token,
            user: { nome: user.nome, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ msg: "Erro interno no servidor" });
    }
});

import { verificarToken } from "./auti.js";

router.get("/perfil", verificarToken, (req, res) => {
    res.json({ msg: "Token válido!", userId: req.user.id });
});


export default router;
