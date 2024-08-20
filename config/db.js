// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gest', 'postgres', '@Inspiron1', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // Desativa logs de queries SQL
});

module.exports = sequelize;
