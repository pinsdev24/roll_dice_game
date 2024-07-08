const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Session extends Model {}
  
  Session.init({
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
  },{
    sequelize,
    modelName: 'Session',
    tableName: 'sessions',
    timestamps: false
  });

  return Session;
};