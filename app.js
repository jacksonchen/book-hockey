// update Interval
var updateInterval = 5000;
// import express
var express = require('express');
// fs file reader
var fs = require('fs');
// define an instance of express
var app = express();
// create a server with express and http
var server = require('http').createServer(app).listen(8080);
console.log("Listening on port 8080...");
// import socket.io and connect it with the server
var io = require('socket.io')(server);
// use jackson's getTwitter
var getTwitter = require('./getTwitter');
// use watson parser
var watson = require('./watson');
// twitter counter to tell us when to start a new thread
var tweeterCounter = 0;
// number of tweets
var lengthOfTweetArr = 0;
// define the search
var hashtag = "";

var events = require('events');
var eventEmitter = new events.EventEmitter();


// make it so that index.html can excess public files
app.use(express.static(__dirname + "/public"));
// route the people with this
app.get("/", function(req, res) {
    res.writeHead(200);
    fs.createReadStream('index.html').pipe(res);
});

// for the sort array
function compare(a,b) {
    if (a.score > b.score)
    return -1;
    else if (a.score < b.score)
    return 1;
    else
    return 0;
}
// var to update and send to clients
var emotions = {
    anger: 0,
    disgust: 0,
    fear: 0,
    joy: 0,
    sadness: 0
}

start();

io.on('connection', function(socket) {
    console.log("the program connected");
    socket.on('hash', function(hash) {
        hashtag = hash;
    });
    // emit the emotions hash
    eventEmitter.on('send', function(val) {
        if (val) {
            console.log(emotions);
            var sum = 0;
            for (e in emotions){
                if(emotions.hasOwnProperty(e)){
                    sum += emotions[e];
                }
            }
            console.log(sum);
            socket.emit('emotions', emotions);
            for(e in emotions){
                emotions[e] = 0;
            }
            tweeterCounter = 0;
            start();
        }
    });
});

function start() {
    getTwitter.tweets(hashtag, function(tweetArr) {
        lengthOfTweetArr = tweetArr.length;
        for (var i = 0; i < lengthOfTweetArr; i++) {
            // console.log(i);
            watsonInit(i, tweetArr);
        }
    });
}

function watsonInit(i, tweetArr) {
    // console.log(i + ": " +tweetArr[i]);
    // console.log(i);
    watson.tone(tweetArr[i], watsonCallback);
};

function watsonCallback(err, tempJSON) {
    if(err === null){
        // console.log(err);
        var temp = tempJSON.document_tone.tone_categories[0];
        var sortedObjArray = temp.tones.sort(compare);
        var id = sortedObjArray[0].tone_id;
        // console.log(id + ": " + sortedObjArray[0].score);
        emotions[id]++;
        // console.log(emotions);
        // console.log(tweeterCounter + ": " + lengthOfTweetArr);
        // console.log(send);
    }
    tweeterCounter++;
    if (tweeterCounter === lengthOfTweetArr) {
        eventEmitter.emit('send', true);
    }
}
