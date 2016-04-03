// update Interval
var updateInterval = 10000;
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
var tweetsProcessedL = 0;
var tweetsProcessedR = 0;
// number of tweets
var totalTweetsL = 0;
var totalTweetsR = 0;
// define the search
var hashtagLeft = "swag";
// define the search
var hashtagRight = "swag";
// past hashtags
var pastHashL = ["swag"];
var pastHashR = ["swag"];
//
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
var emotionsL = [0,0,0,0,0];
var emotionsR = [0,0,0,0,0];

start(hashtagLeft);
start(hashtagRight);

io.on('connection', function(socket) {
    console.log("the program connected");
    socket.on('hash', function(which, hash) {
        if (hash.length > 0) {
            if (which) {
                hashtagRight = hash;
            }else {
                hashtagLeft = hash;
            }
        }
        console.log(hashtagLeft);
    });
    // emit the emotions hash
    eventEmitter.on('sendL', function(val) {
        console.log("error: " + val);
        var sumL = emotionsL.sum();
        // console.log("sum: " + sumL);
        var percentsL = [];
        for (var i=0;i<emotionsL.length;i++) {
          percentsL.push(getPercent(emotionsL[i],sumL));
        }
        socket.emit('emotionsL', { "sum": sumL, "percents": percentsL, topic:pastHashL[pastHashL.length - 1] });
        emotionsL.clear();
        tweetsProcessedL = 0;
        setTimeout(start(hashtagLeft), updateInterval);
    });
    eventEmitter.on('sendR', function(val) {
        var sumR = emotionsL.sum();
        // console.log("sum: " + sumR);
        var percentsR = [];
        for (var i=0;i<emotionsR.length;i++) {
          percentsR.push(getPercent(emotionsL[i],sumR));
        }
        socket.emit('emotionsR', { "sum": sumR, "percents": percentsR, topic:pastHashR[pastHashR.length - 1] });
        emotionsR.clear();
        tweetsProcessedR = 0;
        setTimeout(start(hashtagRight), updateInterval);
    });
    eventEmitter.on('nadaL', function(data) {
        hashtagLeft = "swag";
        start(hashtagLeft);
    });
    eventEmitter.on('nadaR', function(data) {
        hashtagRight = "swag";
        start(hashtagRight);
    });
});

function start(h) {
    getTwitter.tweets(h, function(tweetArr) {
        if (h === hashtagLeft) {
            totalTweetsL = tweetArr.length;
            if (tweetArr.length === 0) {
                eventEmitter.emit("nadaL", 0);
            }
        }else if (h === hashtagRight) {
            totalTweetsR = tweetArr.length;
            if (totalTweetsR === 0) {
                eventEmitter.emit("nadaR", 0);
            }
        }
        for (var i = 0; i < tweetArr.length; i++) {
            // console.log(tweetArr[i]);
            watsonInit(h, i, tweetArr);
        }
    });
}

function watsonInit(h, i, tweetArr) {
  watson.tone(h, tweetArr[i], watsonCallback);
};

function watsonCallback(h, err, tempJSON) {
    var errNum = 0;
    if (err === null){
        var temp = tempJSON.document_tone.tone_categories[0];
        var sortedObjArray = temp.tones.sort(compare);
        var id = sortedObjArray[0].tone_id;
        if (h === hashtagLeft) {
            switch(id) {
              case 'anger':
                emotionsL[0]++;
                break;
              case 'disgust':
                emotionsL[1]++;
                break;
              case 'fear':
                emotionsL[2]++;
                break;
              case 'joy':
                emotionsL[3]++;
                break;
              case 'sadness':
                emotionsL[4]++;
                break;
              default:
                emotionsL[0]++;
                break;
            }
            tweetsProcessedL++;
        }else{
            switch(id) {
              case 'anger':
                emotionsR[0]++;
                break;
              case 'disgust':
                emotionsR[1]++;
                break;
              case 'fear':
                emotionsR[2]++;
                break;
              case 'joy':
                emotionsR[3]++;
                break;
              case 'sadness':
                emotionsR[4]++;
                break;
              default:
                emotionsR[0]++;
                break;
            }
        }
    }else {
        errNum++;
    }
    if (tweetsProcessedL === totalTweetsL) {
        eventEmitter.emit('sendL', errNum);
        pastHashL.push(hashtagLeft);
    }else if (tweetsProcessedR === totalTweetsR) {
        eventEmitter.emit('sendR', errNum);
        pastHashR.push(hashtagRight);
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
