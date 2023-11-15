const { Pool } = require('pg');

const connection_url = process.env.DATABASE_URL;
let db = {};

try {
	const pool = new Pool({
		connectionString: connection_url,
		ssl: { rejectUnauthorized: false },
		max: 20,
		idleTimeoutMillis: 30000,
	});
	db = pool.connect();
} catch (error) {
	console.log('Error with PG DB connection', error);
}

module.exports = { DB: db };
