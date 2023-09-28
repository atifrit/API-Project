'use strict';

const {SpotImage} = require('../models');

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
   SpotImage.bulkCreate([
    {
      spotId: 1,
      url: 'https://www.the-sun.com/wp-content/uploads/sites/6/2023/07/EB_BARBIE_COMP.jpg?w=620'
    },
    {
      spotId: 2,
      url: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
      spotId: 3,
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Shack_in_Pigeon_Forge%2C_TN_by_Zachary_Davies.jpg/1280px-Shack_in_Pigeon_Forge%2C_TN_by_Zachary_Davies.jpg'
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['../../../images/d24cf340-5551-4c74-8fd4-525d5f167205-kens-dreamhouse-airbnb.avif', '../../../images/03992f2df0f728d7a4c875acce4c71e8.jpg', '../../../images/shack.jpg'] }
    }, {});
  }
};
