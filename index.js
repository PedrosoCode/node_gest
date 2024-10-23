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
const cadastroTecnico = require('./routes/cadastro_basico/tenico/TecnicoRoutes');
const ordemServicoRoutes = require('./routes/ordem_servico/ordemServicoRoutes');
const necessidadeManutencao = require('./routes/necessidade_manutencao/necessidadeManutencaoRouter');

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
app.use('/api', necessidadeManutencao);
app.use('/api', cadastroTecnico);

//TODO - Rota para CRUD de agendamentos de manutenção
        //NOTE - SCHEMA já criado no banco de dados
        //REVIEW - Verificar a viabilidade criar agendamentos automaticamente a partir de OS

//TODO - Verificar a viabilidade de um módulo de histórica dos ativos
        //REVIEW - Aproveitar para incluir uma visualização em massa dos status dos ativos
        //TODO - incluir um componente de calendários com manutenções passadas e agendamentos futuros
        //TODO - Na listagem em massa dos ativos, indicar atribuições e seus status como por exemplo, NM atribuida, OS atribuida, etc

//TODO - ROta de Crud completa de NMs - Necessidade de manutenção
//     - Irá conter vinculo com Ativos
      //NOTE - Listar todos os materiais necessários para toda a NM baseado em todos os ativos nelas 

//REVIEW - Nos controladores de CRUD de itens, alterar para incluir também o campo codigo_ativo_vinculado
//       - esse codigo serve para vincular de forma mais fácil cada item a um diferente ativo para controlar OS que sejam grandes
          //NOTE - Alteração já feita no banco
          //REVIEW - Refatorar os CRUDS de item

// Sincroniza o Sequelize com o banco de dados
sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
