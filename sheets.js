require('dotenv').config();
const handler = require('./sheets-handler');
const models = require('./models');

(function() {
    const now = new Date();
    models.Item.findAll({}).then(items => {
        // Each item must have a spreadsheet
        items.forEach(async (item) => {
            item = item.dataValues;
            let document = await models.Document.findOne({ where: { itemId: item.id }, raw: true });
            if (!document) {
                const sheet = await handler.create('Sheet ' + item.id);
                document = await models.Document.create({
                    name: 'Sheet ' + item.id,
                    itemId: item.id,
                    month: now.getMonth(),
                    sheetId: sheet.spreadsheetId,
                    sheetUrl: sheet.spreadsheetUrl,
                    sheets: '',
                });
                await putDataOnSheet(document, sheet.spreadsheetId);
            } else {
                await putDataOnSheet(document, document.sheetId).then(item => console.log(item));
            }
        });
    });
})();

const putDataOnSheet = (document, id) => new Promise(async (resolve, reject) => {
    try {
        const currentSheets = document.sheets.split(',');
        const sheetName = new Date().toLocaleString('default', { month: 'long' });
        if (!currentSheets.includes(sheetName)) {
            await handler.addSheet(id, sheetName);
            await models.Document.update(
                { sheets: document.sheets + sheetName + ',' },
                { where: {id: document.id } }
            );
        }
        const transactions = await getSheetData(id);
        await handler.truncate(id, sheetName);
        const values = [];
        values.push(['#', 'Date', 'Amount', 'Name', 'Category', 'Note', 'Frequency']);
        transactions.forEach(transaction => {
            values.push(
                [transaction.id, transaction.date, transaction.amount, transaction.name, JSON.parse(transaction.category)[0], '', ''],
            );
        });
        const result = await handler.write(id, values, sheetName);
        return resolve(result);
    } catch (e) {
        console.error(e);
        return reject(e);
    }
});

const getSheetData = id => new Promise(async (resolve, reject) => {
    console.log('Getting Document');
    models.Document.findOne({
        where: { sheetId: id },
        include: [
            {
                model: models.Item,
                required: true,
                include: [
                    {
                        model: models.Transaction,
                    }
                ]
            }
        ],
    }).then(document => {
        const transactions = document.toJSON().Item.Transactions;
        return resolve(transactions);
    });
});
