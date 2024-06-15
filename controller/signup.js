const User = require("../models/User"); 
const { createSecretToken } = require("../tokenGeneration/generateToken");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    try {
        const { email, password, name, username } = req.body;

        if (!(email && password && name && username)) {
            return res.status(400).send("Todos os campos são obrigatórios");
        }

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).send("Usuário com esse e-mail já existe!");
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            path: "/", // O cookie é acessível a partir de todas as rotas
            expires: new Date(Date.now() + 86400000), // O cookie expira em 1 dia
            secure: true, // O cookie será enviado apenas via HTTPS
            httpOnly: true, // O cookie não pode ser acessado por scripts no lado do cliente
            sameSite: "None",
        });

        console.log("Cookie criado com sucesso!");
        res.json(user);
    } catch (error) {
        console.log("Erro: ", error);
        
    }
};

module.exports = createUser;
