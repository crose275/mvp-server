'use strict'
const express = require('express')
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8001;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());

const dbConn = require('./dbConn');
const pool = dbConn.getPool();

app.get('/tasks', (req, res, next)=>{
    pool.query('SELECT * FROM tasks', (err, result)=> {
        if(err) {
            return next(err);
        }

        const rows = result.rows
        return res.send(rows)
    })
})

app.get('/categories', (req, res, next)=>{
    pool.query('SELECT * FROM categories', (err, result)=> {
        if(err) {
            return next(err);
        }

        const rows = result.rows
        return res.send(rows)
    })
})

app.listen(port, ()=>{
    console.log("listening on port ", port)
    console.log("connecting to postgres pool: ", pool)
})
