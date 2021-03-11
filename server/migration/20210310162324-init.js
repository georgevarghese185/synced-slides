'use strict';

module.exports = {
  up: async (queryInterface, { DataTypes }) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'slides',
        {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          name: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false,
          },
          type: DataTypes.TEXT,
          data: {
            type: DataTypes.BLOB,
            allowNull: false,
          },
          etag: {
            type: DataTypes.TEXT,
            allowNull: false,
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
        },
        {
          transaction,
          timestamps: true,
        }
      );

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },

  down: async queryInterface => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('slides');

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },
};
