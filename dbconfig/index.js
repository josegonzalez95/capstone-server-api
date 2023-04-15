const {Pool} = require('pg')

const connection_url = "postgres://qlxouxhpuqlcli:c416400a0bd65ef07cc531dbe05b05e643983c24c7019898e083bdffc214a672@ec2-23-20-211-19.compute-1.amazonaws.com:5432/d7mu35vh781rtv"

const pool = new Pool({
            connectionString:connection_url,
            ssl:{rejectUnauthorized: false},
            max: 20,
            idleTimeoutMillis: 30000
        });

const db = pool.connect()

module.exports = {DB: db}