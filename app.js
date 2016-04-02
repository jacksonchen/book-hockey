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
// use jackson's getTwitter
var getTwitter = require('./getTwitter');
// use watson parser
var watson = require('./watson');
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

io.on('connection', function(socket){
    var emotions = {
        anger: 0,
        disgust: 0,
        fear: 0,
        joy: 0,
        sadness: 0
    }
    console.log("A program connected");
    getTwitter.tweets(function(tweetArr) {
        var j = 0;
        for (var i = 0; i < tweetArr.length; i++) {
            (function(i) {
                watson.tone(tweetArr[i], function(tempJSON) {
                    var temp = tempJSON.document_tone.tone_categories[0];
                    var sortedObjArray = temp.tones.sort(compare);
                    var id = sortedObjArray[0].tone_id;
                    // console.log(id + ": " + sortedObjArray[0].score);
                    emotions[id]++;
                    j++;

                    if (j === tweetArr.length) {
                        console.log(emotions);
                        io.emit('emotions', emotions);
                    }
                });
            })(i);
        }
    });
});
