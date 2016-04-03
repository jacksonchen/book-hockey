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
var tweetsProcessed = 0;
// number of tweets
var totalTweets = 0;
// define the search
var hashtag = "swag";
// past hashtags
var pastHash = ["swag"];
var events = require('events');
var eventEmitter = new events.EventEmitter();


// make it so that index.html can access public files
app.use(express.static(__dirname + "/public"));
// route the people with this
app.get("/", function(req, res) {
    res.writeHead(200);
    fs.createReadStream('index.html').pipe(res);
});

// for the sort array
function compare(a,b) {
    if (a.score > b.score) {
      return -1;
    } else if (a.score < b.score) {
      return 1;
    } else {
      return 0;
    }
}

Array.prototype.sum = function() {
  var sum = 0;
  for (var i=0;i<this.length;i++) {
    sum += this[i];
  }
  return sum;
}

Array.prototype.clear = function() {
  for (var i=0;i<this.length;i++) {
    this[i] = 0;
  }
}

// var to update and send to clients
// 0 = anger
// 1 = disgust
// 2 = fear
// 3 = joy
// 4 = sadness
var emotions = [0,0,0,0,0];

start(hashtag);

io.on('connection', function(socket) {
    console.log("the program connected");
    socket.on('hash', function(hash) {
        hashtag = hash;
        console.log(hashtag);
    });
    // emit the emotions hash
    eventEmitter.on('send', function(val) {
        console.log("error: " + val);
        console.log(emotions);
        var sum = emotions.sum();
        console.log("sum: " + sum);
        var percents = [];
        for (var i=0;i<emotions.length;i++) {
          percents.push(getPercent(emotions[i],sum));
        }
        socket.emit('emotions', { "sum": sum, "percents": percents, topic:pastHash[pastHash.length - 1] });
        emotions.clear();
        tweetsProcessed = 0;
        setTimeout(start(), updateInterval);
    });
});

function start() {
    getTwitter.tweets(hashtag, function(tweetArr) {
        totalTweets = tweetArr.length;
        console.log("Total Tweets: " + totalTweets);
        for (var i = 0; i < totalTweets; i++) {
            watsonInit(i, tweetArr);
        }
    });
}

function watsonInit(i, tweetArr) {
  watson.tone(tweetArr[i], watsonCallback);
};

function watsonCallback(err, tempJSON) {
    var errNum = 0;
    if (err === null){
        var temp = tempJSON.document_tone.tone_categories[0];
        var sortedObjArray = temp.tones.sort(compare);
        var id = sortedObjArray[0].tone_id;
        switch(id) {
          case 'anger':
            emotions[0]++;
            break;
          case 'disgust':
            emotions[1]++;
            break;
          case 'fear':
            emotions[2]++;
            break;
          case 'joy':
            emotions[3]++;
            break;
          case 'sadness':
            emotions[4]++;
            break;
          default:
            emotions[0]++;
            break;
        }
    }else {
        errNum++;
    }
    tweetsProcessed++;
    if (tweetsProcessed === totalTweets) {
        eventEmitter.emit('send', errNum);
        pastHash.push(hashtag);
    }
}

function getPercent(value,sum) {
  return Math.floor((value/sum)*100);
}

function sumEmotions(emotions) {
  var sum = 0;
  for (i in emotions) {
    sum += emotions[emotion];
  }
  return sum;
}
