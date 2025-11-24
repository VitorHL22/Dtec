import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function verificarToken(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Acesso negado!" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(400).json({ msg: "Token inválido!" });
    }
}

