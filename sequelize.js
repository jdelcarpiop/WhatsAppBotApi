const Sequelize = require('sequelize');

const sequelize = new Sequelize('db', 'user', 'pass', {
  host: 'ip',
  dialect: 'mysql',
  logging: false
}); 
module.exports = sequelize;
