'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.User, { foreignKey: "AuthorId" });
      Product.belongsTo(models.Category, { foreignKey: "CategoryId" });
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Name cannot be empty",
        },
        notNull: {
          args: true,
          msg: "Name cannot be empty",
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Description cannot be empty",
        },
        notNull: {
          args: true,
          msg: "Description cannot be empty",
        },
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "Price must be greater than 0",
        },
        notEmpty: {
          args: true,
          msg: "Price cannot be empty",
        },
        notNull: {
          args: true,
          msg: "Price cannot be empty",
        },
      },
    },
    stock: {
      type: DataTypes.INTEGER
    },
    imgUrl: {
      type: DataTypes.STRING
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Category cannot be empty",
        },
        notNull: {
          args: true,
          msg: "Category cannot be empty",
        },
      },
    },
    AuthorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Author cannot be empty",
        },
        notNull: {
          args: true,
          msg: "Author cannot be empty",
        },
      },
    },
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};