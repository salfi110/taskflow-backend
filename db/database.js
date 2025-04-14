const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./taskflow.db');
module.exports = db;
