'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    accountId: DataTypes.STRING,
    itemId: DataTypes.INTEGER,
    accountOwner: DataTypes.STRING,
    amount: DataTypes.DOUBLE,
    category: DataTypes.STRING,
    categoryId: DataTypes.STRING,
    date: DataTypes.DATE,
    isoCurrencyCode: DataTypes.STRING,
    location: DataTypes.TEXT,
    name: DataTypes.STRING,
    paymentChannel: DataTypes.STRING,
    paymentMeta: DataTypes.TEXT,
    pending: DataTypes.BOOLEAN,
    pendingTransactionId: DataTypes.STRING,
    transactionId: DataTypes.STRING,
    transactionType: DataTypes.STRING,
    unofficialCurrencyCode: DataTypes.STRING
  }, {});
  Transaction.associate = function(models) {
    Transaction.belongsTo(models.Item, { foreignKey: 'itemId' });
  };
  return Transaction;
};