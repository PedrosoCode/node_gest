// models/ParceiroNegocio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assumindo que seu sequelize está configurado em config/sequelize.js

const ParceiroNegocio = sequelize.define('ParceiroNegocio', {
  codigo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    field: 'codigo',
  },
  nome_razao_social: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  is_cnpj: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  documento: {
    type: DataTypes.STRING(18),
    allowNull: false,
    unique: true, // Correspondente ao índice único `idx_documento`
  },
  endereco: {
    type: DataTypes.STRING(255),
  },
  cidade: {
    type: DataTypes.STRING(100),
  },
  estado: {
    type: DataTypes.CHAR(2),
  },
  cep: {
    type: DataTypes.STRING(10),
  },
  telefone: {
    type: DataTypes.STRING(20),
  },
  email: {
    type: DataTypes.STRING(255),
  },
  data_cadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  tipo_parceiro: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    validate: {
      isIn: [['C', 'F', 'A']], // Validação correspondente ao CHECK CONSTRAINT
    },
  },
  codigo_empresa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true, // Incluído como parte da chave primária composta
  },
}, {
  tableName: 'tb_cad_parceiro_negocio',
  timestamps: false, // Desabilitar timestamps automáticos (createdAt, updatedAt)
});

module.exports = ParceiroNegocio;
