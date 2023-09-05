'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, {foreignKey:'ownerId'});
      Spot.hasMany(models.Review, {foreignKey:'spotId'});
      Spot.hasMany(models.Booking, {foreignKey:'spotId'});
      Spot.hasMany(models.SpotImage, {foreignKey:'spotId'});
    }
  }
  Spot.init({
    ownerId: {
      type:DataTypes.INTEGER,
      references:{model:'Users'}
    },
    address: {
      type:DataTypes.STRING
    },
    city: {
      type:DataTypes.STRING
    },
    state: {
      type:DataTypes.STRING
    },
    country: {
      type:DataTypes.STRING
    },
    lat: {
      type: DataTypes.DECIMAL
    },
    lng: {
      type: DataTypes.DECIMAL
    },
    name: {
      type:DataTypes.STRING,
      allowNull: false
    },
    description: {
      type:DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10,2)
    }
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Spot;
};
