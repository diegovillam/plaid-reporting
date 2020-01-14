require('dotenv').config();
const plaid = require('plaid');
const models = require('./models');
const moment = require('moment');

const plaidClient = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_KEY,
    process.env.PLAID_ENVIRONMENT === 'development' ? plaid.environments.development :  (process.env.PLAID_ENVIRONMENT === 'production' ? plaid.environments.production : plaid.environments.sandbox)
);

(function() {
    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment().subtract(7, 'days').format('YYYY-MM-DD');
    models.Item.findAll({}).then(items => {
        items.forEach(item => {
            item = item.dataValues;
            plaidClient.getTransactions(
                item.accessToken,
                yesterday,
                today,
                { count: 500 },
                async(err, result) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    result.transactions.forEach(async (transaction) => {
                        const stored = await models.Transaction.findOne({ where: { transactionId: transaction.transaction_id }, raw: true });
                        if (!stored) {
                            models.Transaction.create({
                                itemId: item.id,
                                accountId: transaction.account_id,
                                accountOwner: transaction.account_owner,
                                amount: transaction.amount,
                                category: JSON.stringify(transaction.category), // An array
                                categoryId: transaction.category_id,
                                date: transaction.date,
                                isoCurrencyCode: transaction.iso_currency_code,
                                location: JSON.stringify(transaction.location), // An object
                                name: transaction.name,
                                paymentChannel: transaction.payment_channel,
                                paymentMeta: JSON.stringify(transaction.payment_meta), // An object
                                pending: transaction.pending,
                                pendingTransactionId: transaction.pending_transaction_id,
                                transactionId: transaction.transaction_id,
                                transactionType: transaction.transaction_type,
                                unofficialCurrencyCode: transaction.unofficial_currency_code,
                            });
                            console.log('Added transaction ', transaction.transaction_id);
                            if (transaction.pending_transaction_id) {
                                models.Transaction.destroy({
                                    where: {
                                        transactionId: transaction.pending_transaction_id,
                                    }
                                }).then(affectedRows => {
                                    console.log('Deleted ', affectedRows, ' removed transactions.');
                                });
                            }
                        }
                    });
                }
            )
        });
    })
}());
