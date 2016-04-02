// var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

// var options = {
//   host: 'https://api.twitter.com',
//   path: '/1.1/search/tweets.json?q=%23berniesanders&src=typd',
//   headers: {Authorization: OAuth oauth_consumer_key="UDA0b0ZogUZzk2PAFlBKcaPqB", oauth_nonce="762cbf613d55c289e1659ac49c8a2a60", oauth_signature="aUcszI8A3bJK7fflNQykOVO6x7k%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1459576199", oauth_version="1.0"}
// }

// var command = "--header "

function getTweets(callback) {
  var child = spawn('curl', [
    '--get', 'https://api.twitter.com/1.1/search/tweets.json',
    '--data', 'count=100&q=%23berniesanders&src=typd',
    '--header', 'Authorization: OAuth oauth_consumer_key=\"UDA0b0ZogUZzk2PAFlBKcaPqB\", oauth_nonce=\"9ec7e6ed80103cb5c476e3b611faf80f\", oauth_signature=\"WnA6Lp94QQSilsLZCGTgra6MCgo%3D\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"1459579286\", oauth_version=\"1.0\"'
  ]);

  var tweetsHash = '';

  child.stdout.on('data', function(chunk) {
    tweetsHash += chunk;
  });

  child.stdout.on('end', function() {
    callback(JSON.parse(tweetsHash.toString()).statuses);
  });
}

function compileTweets(callback) {
  var tweetArr = []
  getTweets(function(tweetsHash) {
    tweetsHash.forEach(function(tweet) {
      tweetArr.push(tweet.text);
    });
    callback(tweetArr);
  });
}

// MAIN

compileTweets(function(tweetArr) {
  console.log(tweetArr);
})
