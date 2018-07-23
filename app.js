const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const port = 3000;


const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = 'mongodb://localhost:27017/todoapp';



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));


/// view setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//conect to mongodb
MongoClient.connect(url, (err, database) => {
    console.log('Mongodb connected ....');
    if (err) throw err;
    else console.log('no error ...')

    var db = database.db('todoapp');
    console.log('db is succsss ');
    Todos = db.collection('todos');
    app.listen(port, () => {
        console.log('Server running on port ' + port);
    });
});


app.get('/', (req, res, next) => {
    console.log('in get')
    if (Todos) {

        var x = Todos.find({});
        Todos.find({}).toArray((err, todos) => {
            if (err) {
                return console.log(err);
            }
            console.log(todos);
            res.render('index', {
                todos: todos
            });
        });
    } else
        res.render('index', '');
});



app.post('/todo/add', (req, res, next) => {
    console.log('Add submitted');

    const todo = {
        text: req.body.text,
        body: req.body.body
    }

    Todos.insert(todo, (err, result) => {
        if (err) {
            return console.log(err);
        }
        console.log('todo added')
        res.redirect('/');

    })
});



app.get('/todo/edit/:id', (req, res, next) => {
    console.log('edit requested');

    const query = {
        _id: ObjectID(req.params.id)
    };

    Todos.find(query).next((err, todo) => {
        if (err) {
            console.log(err);
        }
        res.render('edit', {
            todo:todo
        });
    });
});



app.post('/todo/edit/:id', (req, res, next) => {
    console.log('edit submitted', req.params.id);
    const query = {
        _id: ObjectID(req.params.id)
    };
    
    const todo = {
        text: req.body.text,
        body: req.body.body
    }

    Todos.updateOne(query, {$set:todo}, (err, result)=>{
        if (err) {
            return console.log(err);
        }
        console.log('to do updated .. ');
        res.redirect('/');
        
    });
});


app.delete('/todo/delete/:id', (req, res, next) => {
    const query = {
        _id: ObjectID(req.params.id)
    };
    Todos.deleteOne(query, (err, response) => {
        if (err) {
            return console.log(err);
        }
        console.log('ToDo removed');
        res.sendStatus(200);
    })
});

