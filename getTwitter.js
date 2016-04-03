var spawn = require('child_process').spawn;

function getTweets(callback) {
  var child = spawn('curl', [
    '--get', 'https://api.twitter.com/1.1/search/tweets.json',
    '--data', 'count=100&q=%23berniesanders&src=typd',
    '--header', 'Authorization: OAuth oauth_consumer_key=\"UDA0b0ZogUZzk2PAFlBKcaPqB\", oauth_nonce=\"80fed41a8537395e237d9f0a0ec8fddb\", oauth_signature=\"Eor3wUueJBSeB4LZaksaKXaVeBI%3D\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"1459647859\", oauth_token=\"2922199336-aPKUBmP1kPlIN60WQJkZTh33E9nksBqau19bOVn\", oauth_version=\"1.0\"'
  ]);

  var tweetsHash = '';

  child.stdout.on('data', function(chunk) {
    tweetsHash += chunk;
  });

  child.stdout.on('end', function() {
    callback(JSON.parse(tweetsHash.toString()).statuses);
  });
}

exports.tweets = function compileTweets(hash, callback) {
  var tweetArr = []
  getTweets(function(tweetsHash) {
    tweetsHash.forEach(function(tweet) {
      tweetArr.push(tweet.text);
    });
    callback(tweetArr);
  });
}

// MAIN

// compileTweets("hi", function(tweetArr) {
//   console.log(tweetArr);
// })
