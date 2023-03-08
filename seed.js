const { Pool } = require('pg');
const dbConn = require('./dbConn');
const pool = dbConn.getPool();

function runSeeder(pool, callback){
    // connect to DB
    pool.connect((err, client, done) => {
        if (err) {
            console.log("Failed to connect to the database");
            console.error(err);
            return done();
        }
        // run seed SQL
        pool.query(`SELECT COUNT(*) FROM tasks`, (err, data) => {
            console.log("number of existing rows: ", data.rows[0]['count']);
            // only INSERT new rows if the table is currently empty
            if (data.rows[0]['count'] == 0){
                pool.query(`INSERT INTO tasks (name, date_added, date_due, completed) VALUES 
                ('Complete Homework', '03-07-2023', '03-10-2023', false),
                ('Mow Lawn', '03-07-2023', '03-10-2023', false),
                ('Feed Snakes', '03-07-2023', '03-10-2023', false)
                ('Send Email', '03-07-2023', '03-10-2023', false)
                ('Go Grocery Shopping', '03-07-2023', '03-10-2023', false)`, 
                (err, data) => {
                    if (err){
                        console.log("Insert failed");
                    } else {
                        console.log("Seeding complete");
                    }
                });
            } else {
                console.log("Did not seed new data because Table was not empty");
            }
            // tell pg we are done with this connection, then execute callback to close it
            done();
            callback();
        });
    });
};

runSeeder(pool, () => {
    // seeding is done, so we can close the pool
    pool.end();
})