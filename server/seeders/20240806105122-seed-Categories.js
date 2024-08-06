'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = require("../data/category.json")
    data.forEach((e) => {
      delete e.id;
      e.createdAt = e.updatedAt = new Date();
    });
    await queryInterface.bulkInsert('Categories', data);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
