const CronJob = require ('cron').CronJob;
const sheets = require('./tasks/sheets');
const plaid = require('./tasks/plaid');

console.log(">> Worker started.");

const sheetsJob = new CronJob('0 * * * *', function() {
    sheets();
});

const plaidJob = new CronJob('5 * * * *', function() {
    plaid();
});

sheetsJob.start();
plaidJob.start();
