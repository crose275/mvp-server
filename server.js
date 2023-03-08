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

// get request to show one id of a table
app.get('/:table/:id', (req, res, next)=>{
    const table = req.params.table
    const id = Number.parseInt(req.params.id)
    if(table === "tasks"){
        // pool query to tasks table where id matches request id
        pool.query('SELECT * FROM tasks WHERE id = $1', [id], (err, result)=>{
            if(err){
                return next(err)
            }
            const tasks = result.rows[0];
            if(tasks){
                res.send(tasks)
            } else{
                res.status(404).send("No tasks found with that id")
            }
        })
    } else if(table === "categories"){
        //pool query to categories table where id matches request id
        pool.query('SELECT * FROM categories WHERE id = $1', [id], (err, result)=>{
            if(err){
                return next(err)
            }
            const categories = result.rows[0];
            if(categories){
                res.send(categories)
            } else {
                res.status(404).send("No categories found with that id")
            }
        })
    } else{
        //send response that there is no data to return
        res.status(404).send("No tables with that name")
    }
})



app.listen(port, ()=>{
    console.log("listening on port ", port)
    console.log("connecting to postgres pool: ", pool)
})
