const { Pool } = require('pg');
const dbConn = require('./dbconn')

const pool = dbConn.getPool();

function runMigrations(pool, callback) {
  pool.connect((err, client, done) => {
    if (err) {
      console.log("Failed to connect");
      console.error(err);
      return done();
    }
    //run migration SQL
    pool.query(
      `CREATE TABLE IF NOT EXISTS tasks (
            id serial PRIMARY KEY,
            name VARCHAR(150),
            date_added date, 
            date_due date,
            category_id integer FOREIGN KEY
            completed boolean);

            CREATE TABLE IF NOT EXISTS categories (
                id serial PRIMARY KEY,
                name VARCHAR(50)
            )`, (err, data) => {
                if(err){
                    console.log("CREATE TABLE failed");
                } else {
                    console.log("Tables created successfully");
                }

                done();
                callback()
            }
    );
  });
}

runMigrations(pool, ()=>{
    pool.end();
})
