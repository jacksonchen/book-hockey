// import express
var express = require('express');
// define an instance of express
var app = express();
// create a server with express and http
var server = require('http').createServer(app).listen(8080);
// import socket.io and connect it with the server
var io = require('socket.io');
