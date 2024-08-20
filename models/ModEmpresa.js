// models/Empresa.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Certifique-se de que o caminho esteja correto

const ModEmpresa = sequelize.define('Empresa', {
  codigo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  razao_social: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  nome_fantasia: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  documento: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'tb_info_empresa',
  timestamps: false, // Desativa os timestamps automáticos (createdAt, updatedAt)
});

module.exports = ModEmpresa;
