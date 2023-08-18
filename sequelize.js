const Sequelize = require('sequelize');

const sequelize = new Sequelize('u567409048_ppe', 'u567409048_ppe', 'MValencia123', {
  host: '191.101.13.103',
  dialect: 'mysql',
  logging: false
}); 

module.exports = sequelize;