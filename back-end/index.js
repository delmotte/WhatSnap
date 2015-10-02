// some viariable to initialize the server
var express = require('express');
var app = express();
var siofu = require("socketio-file-upload");


// create the router with the bdd uniq instance
var router = require('./modules/router')(express.Router());

// module pour parser du json dans le body des requetes POST et PUT
var bodyParser = require('body-parser');
app.use(bodyParser());

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

// apply router to our app
app.use('/',router);
app.use(siofu.router);

console.log("Server Launched on port 7070...");

// listen on port 7070
var server = app.listen(7070);
var io = require('socket.io').listen(server);
var sockets = require('./modules/sockets');

io.on('connection', sockets.socketCallback);