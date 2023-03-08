const { Pool } = require('pg');


const POSTGRES_HOST = process.env.POSTGRES_HOST || '127.0.0.1';
const POSTGRES_DB = process.env.POSTGRES_DB;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_USER = process.env.POSTGRES_PASSWORD;
const DATABASE_URL = process.env.DATABASE_URL;

function getPool() {
    const dbConfig = {
       user: POSTGRES_USER,
       host: POSTGRES_HOST,
       database: POSTGRES_DB,
       password: POSTGRES_PASSWORD,
       port: 5432, 
    };


let pool = null;
if(DATABASE_URL){
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        } 
    });
} else {
    pool = new Pool(dbConfig);
}

return pool;
}

module.exports = {getPool}