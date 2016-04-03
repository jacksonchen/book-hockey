var spawn = require('child_process').spawn,
    fs = require('fs'),
    OAuth = require('oauth');

GLOBAL.apiParams = {}
GLOBAL.counter = 1

function genNonce(callback) {
  var nonceChars = []
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i=0; i < 32; i++) {
    nonceChars.push(possible.charAt(Math.floor(Math.random() * possible.length)));
  }
  callback(nonceChars.join(''));
}

function sendCall(url, dataQuery, callback) {
  var httpMethod = 'GET';

  var oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      GLOBAL.apiParams.oauth_consumer_key,
      GLOBAL.apiParams.consumerSecret,
      '1.0',
      null,
      'HMAC-SHA1'
    );
  oauth.get(
    url + '?' + dataQuery,
    GLOBAL.apiParams.oauth_token,
    GLOBAL.apiParams.tokenSecret,
    function (e, data, res){
      if (e && e.statusCode === 429) {
        if (GLOBAL.counter === 3) {
          GLOBAL.counter = 1
        }
        else {
          GLOBAL.counter += 1
        }
        GLOBAL.apiParams.oauth_consumer_key = authkeys[GLOBAL.counter].oauth_consumer_key
        GLOBAL.apiParams.oauth_token = authkeys[GLOBAL.counter].oauth_token
        GLOBAL.apiParams.consumerSecret = authkeys[GLOBAL.counter].consumerSecret
        GLOBAL.apiParams.tokenSecret = authkeys[GLOBAL.counter].tokenSecret
        sendCall(url, dataQuery, function(data) {
          callback(data);
        })
      }
      else {
        callback(data);
      }
   });
}

function getTweets(callback) {
  genNonce(function(nonce) {
    GLOBAL.apiParams.oauth_nonce = nonce;
    var dataQuery = 'count=100&q=' + encodeURI(GLOBAL.apiParams.status) + '&src=typd',
        url = 'https://api.twitter.com/1.1/search/tweets.json';
    sendCall(url, dataQuery, function(tweetHash) {
      callback(JSON.parse(tweetHash.toString()).statuses);
    });
  });
}

// function checkStatus(counter, callback) {
//   var authkeys = JSON.parse(fs.readFileSync('auth.json', 'utf8'));
//   apiParams = {
//     oauth_consumer_key : authkeys[counter].oauth_consumer_key,
//     oauth_token : authkeys[counter].oauth_token,
//     consumerSecret : authkeys[counter].consumerSecret,
//     tokenSecret : authkeys[counter].tokenSecret,
//     oauth_timestamp : Date.now(),
//     oauth_signature_method : 'HMAC-SHA1',
//     oauth_version : '1.0',
//   };
//   var url = 'https://api.twitter.com/1.1/application/rate_limit_status.json',
//       dataQuery = 'resources=search';
//
//   genNonce(function(nonce) {
//     apiParams.oauth_nonce = nonce;
//     sendCall(url, dataQuery, apiParams, function(result) {
//       var num = JSON.parse(result.toString()).resources.search['/search/tweets'].remaining
//       console.log(num)
//       if (num > 0) {
//         console.log(counter)
//         callback(apiParams);
//       }
//       else {
//         if (counter === 3) {
//           callback("Out of requests");
//         }
//         else {
//           checkStatus(counter + 1, function(apiParams) {
//             callback(apiParams);
//           });
//         }
//       }
//     });
//   });
// }

exports.tweets = function compileTweets(topic, callback) {
  GLOBAL.authkeys = JSON.parse(fs.readFileSync('auth.json', 'utf8'));
  GLOBAL.apiParams = {
    oauth_consumer_key : authkeys[GLOBAL.counter].oauth_consumer_key,
    oauth_token : authkeys[GLOBAL.counter].oauth_token,
    consumerSecret : authkeys[GLOBAL.counter].consumerSecret,
    tokenSecret : authkeys[GLOBAL.counter].tokenSecret,
    oauth_timestamp : Date.now(),
    oauth_signature_method : 'HMAC-SHA1',
    oauth_version : '1.0',
  };
  GLOBAL.apiParams.status = topic;
  var tweetArr = []
  getTweets(function(tweetsHash) {
    tweetsHash.forEach(function(tweet) {
      tweetArr.push(tweet.text);
    });
    callback(tweetArr);
  });
}

// compileTweets(process.argv[2], function(tweetArr) {
//   console.log(tweetArr);
// })
