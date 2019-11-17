//require the just installed express app
var express = require('express');
var bodyParser = require('body-parser');

const db = require('./queries')
//then we call express
var app = express();
app.use(bodyParser.json());
//takes us to the root(/) URL
app.get('/', function (req, res) {
//when we visit the root URL express will respond with 'Hello World'
    res.send('Hello World!');
});

app.get('/api/v1/todos', db.getTodos);
app.post('/api/v1/todos', db.createTodo);
app.put('/api/v1/todos/:id',db.updateTodo);
app.post('/api/v1/subtasks', db.createSubtask);
app.post('/api/v1/subtasks/:id', db.updateSubtask);


//the server is listening on port 3000 for connections
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});