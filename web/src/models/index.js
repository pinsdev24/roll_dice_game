const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const User = require('./user')(sequelize);
const Session = require('./session')(sequelize);
const Game = require('./game')(sequelize);
const Configuration = require('./configuration')(sequelize);

// Define relationships
User.hasMany(Session);
Session.belongsTo(User, { as: 'creator' });
Session.belongsToMany(User, { through: 'SessionPlayers', as: 'players' });

Session.hasMany(Game);
Game.belongsTo(Session);

User.hasMany(Game);
Game.belongsTo(User);

Session.hasOne(Configuration);
Configuration.belongsTo(Session);

module.exports = {
  sequelize,
  User,
  Session,
  Game,
  Configuration,
};