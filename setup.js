const db = require('./db/database');
const fs = require('fs');

const schema = fs.readFileSync('./db/schema.sql', 'utf8');
db.exec(schema, () => {
  console.log('Database initialized');
  db.close();
});
