var spawn = require('child_process').spawn,
    OAuth = require('oauth');

function genNonce(callback) {
  var nonceChars = []
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i=0; i < 32; i++) {
    nonceChars.push(possible.charAt(Math.floor(Math.random() * possible.length)));
  }
  callback(nonceChars.join(''));
}

// TODO: REMEMBER TO REMOVE SECRETS
function buildSignature(dataQuery, apiParams, callback) {
  var httpMethod = 'GET',
    	url = 'https://api.twitter.com/1.1/search/tweets.json';

  var oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      apiParams.oauth_consumer_key,
      apiParams.consumerSecret,
      '1.0',
      null,
      'HMAC-SHA1'
    );
  oauth.get(
    url + '?' + dataQuery,
    apiParams.oauth_token,
    apiParams.tokenSecret,
    function (e, data, res){
      if (e) console.error(e);
      callback(data);
   });
}

function getTweets(apiParams, callback) {
  genNonce(function(nonce) {
    apiParams.oauth_nonce = nonce;
    var dataQuery = 'count=100&q=' + encodeURI(apiParams.status) + '&src=typd';
    buildSignature(dataQuery, apiParams, function(tweetHash) {
      callback(JSON.parse(tweetHash.toString()).statuses);
    });
  });
}

exports.tweets = function compileTweets(topic, apiParams, callback) {
  apiParams = {
    oauth_consumer_key : 'UDA0b0ZogUZzk2PAFlBKcaPqB',
    oauth_token : '2922199336-aPKUBmP1kPlIN60WQJkZTh33E9nksBqau19bOVn',
    consumerSecret : '6KUdtbCjjhd1tTzo97dZhxTYmsUPloYbbkLInE2B0Xxnaiys0b',
    tokenSecret : '3tB5YMTbi6glEzpLYuJBjd796kiDYpJuhsOPRF7b3e6ys',
    oauth_timestamp : Date.now(),
    oauth_signature_method : 'HMAC-SHA1',
    oauth_version : '1.0',
    status: topic
  };
  var tweetArr = []
  getTweets(apiParams, function(tweetsHash) {
    tweetsHash.forEach(function(tweet) {
      tweetArr.push(tweet.text);
    });
    callback(tweetArr);
  });
}

// MAIN

// compileTweets(process.argv[2], function(tweetArr) {
//   console.log(tweetArr);
// })
