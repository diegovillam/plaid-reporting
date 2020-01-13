# plaid-reporting

1. Start the Express server `node server`

2. Run your migrations `npx sequelize-cli db:migrate` after configuring DB on `config/config.json`

3. Set a CRON job to run `node plaid` every 60 minutes
