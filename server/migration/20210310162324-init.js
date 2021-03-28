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
          uuid: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
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

      await queryInterface.addIndex('slides', {
        unique: true,
        fields: ['uuid'],
        transaction,
      });

      await queryInterface.createTable(
        'displays',
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
          loginName: {
            type: DataTypes.TEXT,
            unique: true,
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

      await queryInterface.addIndex('displays', {
        unique: true,
        fields: ['loginName'],
        transaction,
      });

      await queryInterface.createTable(
        'display_slides',
        {
          slideId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            references: {
              model: 'slides',
              key: 'id',
            },
          },
          displayId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            references: {
              model: 'displays',
              key: 'id',
            },
          },
          createdAt: {
            type: DataTypes.DATE,
          },
          updatedAt: {
            type: DataTypes.DATE,
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
      await queryInterface.dropTable('display_slides', { transaction });
      await queryInterface.dropTable('slides', { transaction });
      await queryInterface.dropTable('displays', { transaction });

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },
};
