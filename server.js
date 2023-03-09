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
// get all tasks for a category 
app.get('/tasks/:category', (req, res, next)=>{
    const category = req.params.category
    // pool query to categories table to get id of param category
})

// post new task 
app.post('/tasks', (req, res, next)=>{
    const categoryId = Number.parseInt(req.body.id)
    const { name, dateAdded, dateDue, completed  } = req.body
    if(name && dateAdded && dateDue && categoryId && completed){
        pool.query(`INSERT INTO tasks
            (name, date_added, date_due, category_id, completed)
            VALUES 
            ($1, $2, $3, $4, $5),`, [name], [dateAdded], [dateDue], [categoryId], [completed], 
            (err, result)=>{
                if(err){
                 return next(err)
                }
                const task = result.rows[0]
                if(task){
                    return res.send(pet)
                } else{
                    return next(err)
                }
        })
    } else {
        return res.status(400).send("Unable to create pet from request body")
    }
            
})

app.listen(port, ()=>{
    console.log("listening on port ", port)
    console.log("connecting to postgres pool: ", pool)
})
