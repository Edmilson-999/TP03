// Importar o módulo Express
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

const app = express();

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);

// Definir uma rota básica
app.get('/', (req, res) => {
    res.send('Olá, Mundo!.');
});

// Iniciar o servidor e escutar na porta especificada
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
