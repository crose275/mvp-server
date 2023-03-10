const { Pool } = require('pg');
const dbConn = require('./dbConn')

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
      `CREATE TABLE IF NOT EXISTS categories(
        id serial PRIMARY KEY,
        name VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS tasks (
            id serial PRIMARY KEY,
            name VARCHAR(150),
            date_added date, 
            date_due date,
            category_id integer references categories(id),
            completed boolean);`, (err, data) => {
                if(err){
                    console.log("CREATE TABLE tasks failed");
                    console.error(err)
                } else {
                    console.log("Tasks table created successfully");
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
