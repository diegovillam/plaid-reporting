require('dotenv').config();
const fs = require('fs');
const { google } = require ('googleapis');

module.exports = {
    create: (title) => createSheet(title),
    truncate: (id, sheet) => truncateSheet(id, sheet),
    write: (id, values, sheet) => writeSheet(id, values, sheet),
    addSheet: (id, title) => addSheet(id, title),
};

const getAuth = () => new Promise((resolve, reject) => {
    fs.readFile('credentials.json', async (err, content) => {
        if (err) {
            console.error('Error loading credentials: ', err);
            return reject(err);
        }
        const auth = await authorize(JSON.parse(content));
        return resolve(auth);
    });
});

const addSheet = (id, title) => new Promise(async (resolve, reject) => {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const request = {
        spreadsheetId: id,
        resource: {
            requests: [
                {
                    addSheet: {
                        properties: {
                            title: title,
                        }
                    },
                }
            ],
        },
    };
    sheets.spreadsheets.batchUpdate(request, (err, response) => {
        if (err) {
            console.error(err);
            return reject(err);
        }
        return resolve(response.data);
    });
});

const writeSheet = (id, values, sheet) => new Promise(async (resolve, reject) => {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const request = {
        spreadsheetId: id,
        range: !!sheet ? `${sheet}!B2:B9` : 'B2:B9',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'OVERWRITE',
        resource: {
            values: values,
        },
    };
    sheets.spreadsheets.values.append(request, (err, response) => {
        if (err) {
            console.error(err);
            return reject(err);
        }
        return resolve(response.data);
    });
});

const truncateSheet = (id, sheet) => new Promise(async (resolve, reject) => {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const request = {
        spreadsheetId: id,
        // F is the column for `Category` in this app
        // TODO: Get rid of this magic number? make it somewhat configurable.
        range: !!sheet? [`${sheet}!A1:F10000`] : ['A1:F10000'],
    };
    sheets.spreadsheets.values.clear(request, (err, response) => {
        if (err) {
            console.error(err);
            return reject(err);
        }
        return resolve(response.data);
    });
});

const createSheet = (title) => new Promise(async (resolve, reject) => {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const request = {
        resource: {
            properties: {
                title,
            },
        },
    };
    sheets.spreadsheets.create(request, (err, response) => {
        if (err) {
            console.error(err);
            return reject(err);
        }
        return resolve(response.data); // data includes spreadsheetId
    });
});

/**
* Create an OAuth2 client with the given credentials, and then execute the
* given callback function.
* @param {Object} credentials The authorization client credentials.
* @param {function} callback The callback to call with the authorized client.
*/
const authorize = (credentials) => {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    return new Promise((resolve, reject) => {
        // Check if we have previously stored a token.
        fs.readFile('token.json', (err, token) => {
            if (err) {
                console.error("token.json not found - run `google-auth.js` to generate it.");
                return reject(err);
            }
            oAuth2Client.setCredentials(JSON.parse(token));
            return resolve(oAuth2Client);
        });
    });
};
