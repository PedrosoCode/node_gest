// models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Certifique-se de que o caminho esteja correto

const ModUsuario = sequelize.define('Usuario', {
  codigo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  usuario: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: 'emailEmpresaIndex', // Para o índice único composto
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  data_input: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  codigo_empresa: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: 'emailEmpresaIndex', // Para o índice único composto
  },
}, {
  tableName: 'tb_cad_usuario',
  timestamps: false, // Desativa os timestamps automáticos (createdAt, updatedAt)
});

module.exports = ModUsuario;
