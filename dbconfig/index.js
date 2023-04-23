const {Pool} = require('pg')

const connection_url = process.env.DB_URI
console.log(connection_url)
const pool = new Pool({
            connectionString:connection_url,
            ssl:{rejectUnauthorized: false},
            max: 20,
            idleTimeoutMillis: 30000
        });

const db = pool.connect()

module.exports = {DB: db}