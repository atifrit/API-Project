'use strict';

const {Review} = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: 'It was radical. I am Kenough',
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: 'It was pretty nice, but it was priced like it was really nice',
        stars: 4
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Gross but cheap',
        stars: 2
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.in]: ['It was radical. I am Kenough', 'It was pretty nice, but it was priced like it was really nice', 'Gross but cheap'] }
    }, {});
  }
};
