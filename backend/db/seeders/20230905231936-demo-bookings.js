'use strict';

const {Booking} = require('../models');

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
    Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2022-01-17',
        endDate: '2022-01-20'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2020-03-08',
        endDate: '2020-03-15'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2023-07-17',
        endDate: '2023-07-31'
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
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
