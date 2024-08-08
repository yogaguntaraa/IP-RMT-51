'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Product, { foreignKey: "AuthorId" });
      User.hasMany(models.Order, { foreignKey: "userId" });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email already exists",
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Email cannot be empty",
        },
        notNull: {
          args: true,
          msg: "Email cannot be empty",
        },
        isEmail: {
          args: true,
          msg: "Email format is incorrect",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Password cannot be empty",
        },
        notNull: {
          args: true,
          msg: "Password cannot be empty",
        },
        len: {
          args: [5, 255],
          msg: "Password at least 5 characters",
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "Customer",
    },
    phoneNumber:{
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};