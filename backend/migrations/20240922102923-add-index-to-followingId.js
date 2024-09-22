'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('followers', ['followingId'], {
      name: 'followers_followingId_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('followers', 'followers_followingId_index');
  }
};