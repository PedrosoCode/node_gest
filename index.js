// index.js

//TODO - adicionar autenticação de usuário via jwt e hashs de senha + salt
//TODO - crud completo de ambientes
//TODO - variáveis de ambiente

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const ambienteRoutes = require('./routes/cadastro_basico/ambiente/ambienteRoutes');
const ativoRoutes = require('./routes/cadastro_basico/ativo/cadBasAtivoRouter');

const app = express();
const PORT = 3042;

// Middlewares
app.use(cors());

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', ambienteRoutes);
app.use('/api', ativoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
