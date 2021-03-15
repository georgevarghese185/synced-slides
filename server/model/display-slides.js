const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  return sequelize.define(
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
    { timestamps: true }
  );
};
