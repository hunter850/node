require('dotenv').config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, NODE_ENV} = process.env;

console.log({DB_HOST, DB_PORT, DB_USER, DB_PASS, NODE_ENV});