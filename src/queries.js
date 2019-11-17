const Pool = require('pg').Pool
const pool = new Pool({
    user: 'todoapp',
    host: 'localhost',
    database: 'todos',
    password: 'todoapp',
    port: 54320,
});



const getTodos = (request, response) => {
    pool.query('select row_to_json(t) as data\n' +
        'from (\n' +
        '  select td.id, td.title, json_agg(json_build_object(\'id\',st.id, \'title\', st.title, \'status\',st.status)) as subtasks\n' +
        '  from todo td \n' +
        '    join subtask st on td.id = st.todo_id\n' +
        '  group by td.id\n' +
        ') as t\n', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createTodo = (request, response) => {

    console.log(request.body);
    const data = {title: request.body.title,status:"pending"};
    pool.query('INSERT INTO todo(title,status,created_at) values($1,$2,$3)',[data.title,data.status,new Date()], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


const updateTodo = (request, response) => {

    const id = request.params.id;
    const data = {status:request.body.status};
    pool.query('UPDATE todo SET status=($1) WHERE id=($2)',[data.status,id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createSubtask = (request, response) => {

    const data = {title: request.body.title,todo_id:request.body.todo_id};
    pool.query('INSERT INTO subtask(title,todo_id,status,created_at) values($1,$2,$3,$4)',[data.title,data.todo_id,"pending",new Date()], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const updateSubtask = (request, response) => {

    const id = request.params.id;
    const data = {status:request.body.status};
    pool.query('UPDATE subtask SET status=($1) WHERE id=($2)',[data.status,id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    createSubtask,
    updateSubtask
}