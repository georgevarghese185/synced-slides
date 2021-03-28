'use strict';

module.exports = {
  up: async (queryInterface, { DataTypes }) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // add sequence column and fill default value '0' initially
      await queryInterface.addColumn(
        'display_slides',
        'sequence',
        { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        { transaction }
      );

      // now that the column is created and filled with default values, remove the default value constraint
      await queryInterface.changeColumn(
        'display_slides',
        'sequence',
        { type: DataTypes.INTEGER, allowNull: false },
        { transaction }
      );

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('display_slides', 'sequence', {
        transaction,
      });
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },
};
