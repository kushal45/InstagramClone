'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('assets', 'tag', {
      type: Sequelize.ENUM('politics', 'sports', 'technology', 'entertainment', 'science', 
            'health', 'business', 'education', 'lifestyle', 'other'),
      allowNull: true, // Change to allow null
    });
  },

  async down(queryInterface, Sequelize) {
    // Note: Reverting this change requires ensuring no null values exist in the column
    await queryInterface.changeColumn('assets', 'tag', {
      type: Sequelize.ENUM('politics', 'sports', 'technology', 'entertainment', 'science', 
            'health', 'business', 'education', 'lifestyle', 'other'),
      allowNull: false, // Revert to not allow null
    });
  }
};