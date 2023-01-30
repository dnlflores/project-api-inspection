'use strict';
const bcrypt = require('bcryptjs');
const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(
        models.Spot,
        {
          foreignKey: 'spotId'
        }
      );
      Review.belongsTo(
        models.User,
        {
          foreignKey: 'userId'
        }
      );
      Review.hasMany(
        models.ReviewImage,
        {
          foreignKey: 'reviewId',
          onDelete: 'CASCADE',
          hooks: true
        }
      );
    }
  }
  Review.init({
    // id: DataTypes.INTEGER,
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // spotId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
        max: 5,
      },
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
