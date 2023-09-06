'use strict';

const {Spot} = require('../models');

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

    Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 example lane',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        lat: 34.0549,
        lng: 118.2426,
        name: 'Mojo Dojo Casa House',
        description: 'Former dream house',
        price: 1500.00,
      },
      {
        ownerId: 2,
        address: '456 notareal street',
        city: 'Boston',
        state: 'Massachusetts',
        country: 'United States',
        lat: 42.3601,
        lng: 71.0589,
        name: 'Nice House',
        description: 'A pretty nice place',
        price: 1200.00,
      },
      {
        ownerId: 3,
        address: '789 IdontKnow ave',
        city: 'New York City',
        state: 'New York',
        country: 'United States',
        lat: 40.7128,
        lng: 74.0060,
        name: 'Shack',
        description: 'Dank, dirty, cheap, and fun',
        price: 30.50,
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['123 example lane', '456 notareal street', '789 IdontKnow ave'] }
    }, {});
  }
};
