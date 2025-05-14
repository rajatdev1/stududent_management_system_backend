const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'student_management_system',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'RAJAT1992jha@@@@',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3308,
    dialect: 'mysql',
    logging: false
  }
);

module.exports = sequelize;