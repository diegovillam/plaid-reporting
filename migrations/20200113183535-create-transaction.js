'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      itemId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Items',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      accountId: {
        type: Sequelize.STRING
      },
      accountOwner: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DOUBLE
      },
      category: {
        type: Sequelize.STRING
      },
      categoryId: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      isoCurrencyCode: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.TEXT
      },
      name: {
        type: Sequelize.STRING
      },
      paymentChannel: {
        type: Sequelize.STRING
      },
      paymentMeta: {
        type: Sequelize.TEXT
      },
      pending: {
        type: Sequelize.BOOLEAN
      },
      pendingTransactionId: {
        type: Sequelize.STRING
      },
      transactionId: {
        type: Sequelize.STRING
      },
      transactionType: {
        type: Sequelize.STRING
      },
      unofficialCurrencyCode: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Transactions');
  }
};