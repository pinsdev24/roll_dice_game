const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Configuration extends Model {}
  
  Configuration.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    playerCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    diceCount: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
    },
    gameCount: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    waitTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'Configuration',
  });

  return Configuration;
};