const knex = require('knex');
const { parse } = require('pg-connection-string');
const app = require('./app');
const { PORT, DB_URL } = require('./config');

const pgconfig = parse(DB_URL);
pgconfig.ssl = { rejectUnauthorized: false };

const db = knex({
  client: 'pg',
  connection: pgconfig,
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
