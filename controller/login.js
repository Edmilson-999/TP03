const User = require("../models/User");
const bcrypt = require("bcrypt");
const env = require("dotenv");
const { createSecretToken } = require("../tokenGeneration/generateToken");

env.config();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).json({ message: "Deve indicar email e senha" });
        }

        const user = await User.findOne({ email });

        if (!(user && (await bcrypt.compare(password, user.password)))) {
            return res.status(404).json({ message: "Credenciais inválidas" });
        }

        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            domain: process.env.FRONTEND_URL, // Atualize com o domínio correto do frontend
            path: "/", // O cookie é acessível a partir de todas as rotas
            expires: new Date(Date.now() + 86400000), // O cookie expira em 1 dia
            secure: true, // O cookie será enviado apenas via HTTPS
            httpOnly: true, // O cookie não pode ser acessado por scripts no lado do cliente
            sameSite: "None", // O cookie é enviado em todas as requisições cross-site
        });

        res.json({ token });
    } catch (error) {
        console.error("Erro ao realizar login: ", error);
        res.status(500).json({ message: "Erro ao realizar login" });
    }
};

module.exports = login;
