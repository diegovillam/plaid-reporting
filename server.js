require('dotenv').config();
const express = require('express');
const path = require('path');
const sass = require('node-sass-middleware');
const plaid = require('plaid');
const bodyParser = require('body-parser');
const models = require('./models');
const app = express();

const plaidClient = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_KEY,
    process.env.NODE_ENV === 'production' ? plaid.environments.production : plaid.environments.sandbox
);

app.set('view engine', 'ejs');
app.use(
    sass({
        src: path.join(__dirname, '/sass'),
        dest: path.join(__dirname, '/public', '/css'),
        prefix: '/css',
        debug: process.env.NODE_ENV === 'development',
    }),
    express.static(path.join(__dirname, 'public')),
    bodyParser(),
);
app.get('/', (req, res) => {
    return res.render('pages/index', {
        plaidKey: process.env.PLAID_KEY,
        plaidEnv: process.env.PLAID_ENVIRONMENT,
    });
});
app.post('/plaid-token', (req, res) => {
    plaidClient.exchangePublicToken(
        req.body.public_token,
        (err, tokenResponse) => {
            if (err !== null) {
                console.error('Could not exchange public token.');
                console.error(err);
                return res.json({ err });
            }
            const { item_id: itemId, access_token: accessToken } = tokenResponse;
            models.Item.create({ itemId, accessToken });
        }
    );
});

const server = app.listen(process.env.PORT, () => console.log('App listening to HTTP requests at port ' + process.env.PORT));
