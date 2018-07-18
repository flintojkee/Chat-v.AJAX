const express = require("express");
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');

let messages = [];
let users = [];
const maxMessages = 100;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/script.js', function (req, res) {
    res.sendFile(__dirname + '/script.js');
});

app.get('/assets/main.css', function (req, res) {
    res.sendFile(__dirname + '/assets/main.css');
});

app.get('/messages', function (req, res) {
    res.json(messages);
});

app.post('/message', function (req, res) {
    if (messages.length >= maxMessages) {
        messages.shift();
        messages.push(req.body);
    } else {
        messages.push(req.body);
    }
});

app.post('/user', function (req, res) {
        users.push(req.body);
});

app.delete('/user', function (req, res){
    console.log(req.body);
    let index = users.findIndex(user => (user.name===req.body.name)&&(user.nickName===req.body.nickName));
    console.log(index);
    if (index > -1) {
        users.splice(index, 1);
    }
    console.log(users);
});

app.get('/users', function (req, res) {
    res.json(users);
});


http.listen(3000, function () {
    console.log('listening on port: 3000')
});