# plaid-reporting

1. Start the Express server `node server`

2. Run your migrations `npx sequelize-cli db:migrate` after configuring DB on environment file

3. Set a CRON job to run `node plaid` every 60 minutes, and `node sheets` every 65 minutes.

## Please remember:

This uses Google Sheets to store the parsed data.

You may need to run `google-auth` in order to generate a token file which may be consumed by the sheets generator file.

This will associate the token to your Google account, e.g. all sheets will be created for that account. This concept allows Google to use your account to create spreadsheets and other documents.

For now there's only one token stored in the app, meaning all sheets will be stored in that account, not necessarily each user's separate Google account.
