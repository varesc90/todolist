const {Pool,Client} = require('pg');


const connectionString = 'postgresql://todoapp:todoapp@localhost:54320/todos'



const pool = new Pool({
    connectionString: connectionString,
})

pool.query('CREATE TABLE Todo(id SERIAL PRIMARY KEY, title VARCHAR(40) not null, status VARCHAR(40) not null, created_at TIMESTAMP);' +
    'CREATE TABLE Subtask(id SERIAL PRIMARY KEY, title VARCHAR(40) not null, status VARCHAR(40) not null, created_at TIMESTAMP,todo_id INT not null);', (err, res) => {
    console.log(err, res)
    pool.end()
})