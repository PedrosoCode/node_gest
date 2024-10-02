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

//TODO - Rota para CRUD de técnicos
        //NOTE - SCHEMA Já criado no banco de dados

//TODO - Rota para CRUD de agendamentos de manutenção
        //NOTE - SCHEMA já criado no banco de dados
        //REVIEW - Verificar a viabilidade criar agendamentos automaticamente a partir de OS


//REVIEW - Nos controladores de CRUD de itens, alterar para incluir também o campo codigo_ativo_vinculado
//       - esse codigo serve para vincular de forma mais fácil cada item a um diferente ativo para controlar OS que sejam grandes
          //NOTE - Alteração já feita no banco
          //REVIEW - Refatorar os CRUDS de item

//REVIEW - Analisar para trocar a escala da OS atual que é (N:1) para (N:N) na relação OS x ATIVO (famoso drop column) e refatorar os controladores e procs/fns

// Sincroniza o Sequelize com o banco de dados
sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
