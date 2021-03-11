const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  return sequelize.define('slides', {
    id: {
      type: DataTypes.TEXT,
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
  });
};
