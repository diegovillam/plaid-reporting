'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    accessToken: DataTypes.STRING,
    itemId: DataTypes.STRING
  }, {});
  Item.associate = function(models) {
    Item.hasMany(models.Transaction, { foreignKey: 'itemId' });
  };
  return Item;
};