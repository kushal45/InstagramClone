'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'bio', {
      type: Sequelize.TEXT,
      allowNull: true, // Assuming the bio is optional
    });


    await queryInterface.addColumn('users', 'website', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true, 
    });

    await queryInterface.addColumn('users', 'avatarUrl', {
        type: Sequelize.STRING,
        allowNull: true, 
    });

    await queryInterface.addColumn('users', 'tags', {
      type: Sequelize.ARRAY(Sequelize.ENUM('politics', 'sports', 'technology', 'entertainment', 'science', 'health', 'business', 'education', 'lifestyle', 'other')),
      allowNull: true, 
    });

    await queryInterface.addColumn('users', 'langPrefs', {
      type: Sequelize.ARRAY(Sequelize.ENUM('English', 'Spanish', 'French', 'German', 'Japanese')),
      allowNull: true, 
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users', 'bio');
    await queryInterface.removeColumn('users', 'phone');
    await queryInterface.removeColumn('users', 'website');
    await queryInterface.removeColumn('users', 'tags');
    await queryInterface.removeColumn('users', 'langPrefs');
  }
};
