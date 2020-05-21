var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
db = low(adapter);

db.defaults({ users: [] })
    .write();

var port = 3000;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', function(req, res) {
    res.render('index', {
        name: 'baby'
    });
});

app.get('/users', function(req, res) {
    res.render('users/index', {
        users: db.get('users').value()
    });
});

app.get('/users/search', function(req, res) {
    var q = req.query.q;
    var matchedUsers = db.get('users').filter(function(user) {
        return user.name.toLowerCase().indexOf(q) !== -1
    })
    res.render('users/index', {
        users: matchedUsers
    });
});

app.get('/users/create', function(req, res) {
    res.render('users/create');
});

app.post('/users/create', function(req, res) {
    db.get('users').push(req.body).write();
    res.redirect('/users');
});

app.get('/users/:id', function(req, res) {
    var id = parseInt(req.params.id);

    var user = db.get('users').find({ id: id }).value();

    console.log(user);
    res.render('users/view', {
        user: user
    })
})

app.listen(port, function() {
    console.log('Server listening on port' + port);
});