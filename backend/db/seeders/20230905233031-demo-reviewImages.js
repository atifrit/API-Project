'use strict';

const {ReviewImage} = require('../models');

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

    ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: '../../../images/d24cf340-5551-4c74-8fd4-525d5f167205-kens-dreamhouse-airbnb.avif'
      },
      {
        reviewId: 2,
        url: '../../../images/03992f2df0f728d7a4c875acce4c71e8.jpg'
      },
      {
        reviewId: 3,
        url: '../../../images/shack.jpg'
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
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['../../../images/d24cf340-5551-4c74-8fd4-525d5f167205-kens-dreamhouse-airbnb.avif', '../../../images/03992f2df0f728d7a4c875acce4c71e8.jpg', '../../../images/shack.jpg'] }
    }, {});
  }
};
