'use strict';
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    name: DataTypes.STRING,
    itemId: DataTypes.INTEGER,
    sheetId: DataTypes.STRING,
    sheetUrl: DataTypes.STRING,
    sheets: DataTypes.STRING,
  }, {});
  Document.associate = function(models) {
    Document.belongsTo(models.Item, { foreignKey: 'itemId' });
  };
  return Document;
};