require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db'); // Importa o Sequelize
const ambienteRoutes = require('./routes/cadastro_basico/ambiente/ambienteRoutes');
const authRoutes = require('./routes/auth/authRoutes');
const parceiroNegocioRoutes = require('./routes/cadastro_basico/parceiro_negocio/parceiroNegocioRoutes');
const cadBasAtivoRoutes = require('./routes/cadastro_basico/ativo/cadBasAtivoRouter');

const app = express();
const PORT = 3042;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', ambienteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', parceiroNegocioRoutes);
app.use('/api', cadBasAtivoRoutes);

// Sincroniza o Sequelize com o banco de dados
sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
