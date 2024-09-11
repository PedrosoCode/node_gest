require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const sequelize = require('./config/db'); 
const ambienteRoutes = require('./routes/cadastro_basico/ambiente/ambienteRoutes');
const authRoutes = require('./routes/auth/authRoutes');
const parceiroNegocioRoutes = require('./routes/cadastro_basico/parceiro_negocio/parceiroNegocioRoutes');
const cadBasAtivoRoutes = require('./routes/cadastro_basico/ativo/cadBasAtivoRouter');
const cadBasItemRoutes = require('./routes/cadastro_basico/item/cadBasItemRouter');

const ordemServicoRoutes = require('./routes/ordem_servico/ordemServicoRoutes');

const app = express();
const PORT = 3042;

//TODO - Elaborar um módulo genérico para reutilização de código, eventualmente levar a função do modal de itens para lá

// Middlewares
app.use(cors());
app.use(express.json());

// caminho para servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api', ambienteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', parceiroNegocioRoutes);
app.use('/api', cadBasAtivoRoutes);
app.use('/api', cadBasItemRoutes);
app.use('/api', ordemServicoRoutes);

// Sincroniza o Sequelize com o banco de dados
sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
