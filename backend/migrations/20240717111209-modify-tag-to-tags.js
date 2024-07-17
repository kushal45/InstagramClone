'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the database supports array types directl
      // Fetch all existing rows in the 'Assets' table
      // const assets = await queryInterface.sequelize.query(
      //   `SELECT id, tag FROM "assets";`,
      //   { type: Sequelize.QueryTypes.SELECT }
      // );

      // Assuming direct array support is not available yet but planning ahead for the conversion
      // This step might need adjustments based on the specific database's capabilities

      // // Update each row to convert 'tag' to 'tags' array in preparation
      // for (const asset of assets) {
      //   await queryInterface.sequelize.query(
      //     `UPDATE "assets" SET tag = ARRAY[tag]::text[] WHERE id = :id;`,
      //     { 
      //       replacements: { tag: asset.tag, id: asset.id },
      //       type: Sequelize.QueryTypes.UPDATE 
      //     }
      //   );
      // }

      // Remove the old 'tag' column
     // await queryInterface.removeColumn('assets', 'tag');
      
      // Add the new 'tags' column with an array of ENUMs
      await queryInterface.changeColoumn('assets', 'tags', {
        type: Sequelize.ARRAY(Sequelize.ENUM('politics', 'sports', 'technology', 'entertainment', 'science', 'health', 'business', 'education', 'lifestyle', 'other')),
        allowNull: true, 
      });

      // Since the rows were already updated to an array structure, no further row updates are needed here
     
  },

  async down(queryInterface, Sequelize) {
    // Remove the 'tags' column
    await queryInterface.removeColumn('assets', 'tags');
    
    // Re-add the 'tag' column
    await queryInterface.addColumn('assets', 'tag', {
      type: Sequelize.ENUM('politics', 'sports', 'technology', 'entertainment', 'science', 'health', 'business', 'education', 'lifestyle', 'other'),
      allowNull: false,
    });
  }
};