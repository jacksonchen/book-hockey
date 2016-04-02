// import express
var express = require('express');
// fs file reader
var fs = require('fs');
// define an instance of express
var app = express();
// create a server with express and http
var server = require('http').createServer(app).listen(8080);
// import socket.io and connect it with the server
var io = require('socket.io')(server);
// make it so that index.html can excess public files
app.use(express.static(__dirname + "/public"));
// route the people with this
app.get("/", function(req, res) {
    res.writeHead(200);
    res.end(fs.readFileSync('index.html'));
});

io.on('connection', function(socket){
    console.log("A program connected");
});
