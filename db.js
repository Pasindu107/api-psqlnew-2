const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "aaa",
    database: "db",
    host: "localhost",
    port: "5432"
});

module.exports = pool;