require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ambienteRoutes = require('./routes/cadastro_basico/ambiente/ambienteRoutes');
const authRoutes = require('./routes/auth/authRoutes');
const parceiroNegocioRoutes = require('./routes/cadastro_basico/parceiro_negocio/parceiroNegocioRoutes');
const cadBasAtivoRoutes = require('./routes/cadastro_basico/ativo/cadBasAtivoRouter');

const app = express();
const PORT = 3042;

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api', ambienteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', parceiroNegocioRoutes);
app.use('/api', cadBasAtivoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
