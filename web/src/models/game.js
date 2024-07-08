const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Game extends Model {}
  
  Game.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'Game',
    tableName: 'games',
    timestamps: false
  });

  return Game;
};