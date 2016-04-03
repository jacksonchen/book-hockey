var oauthSignature = require('oauth-signature'),
    apiParams = {
      oauth_consumer_key : 'UDA0b0ZogUZzk2PAFlBKcaPqB',
      oauth_token : '2922199336-aPKUBmP1kPlIN60WQJkZTh33E9nksBqau19bOVn',
      oauth_timestamp : 1459642116,
      oauth_nonce : "f777513a3c745231f4aeb5ab17c48cc4",
      oauth_signature_method : 'HMAC-SHA1',
      oauth_version : '1.0'
    };

var httpMethod = 'GET',
    url = 'https://api.twitter.com/1.1/search/tweets.json',
    consumerSecret = '6KUdtbCjjhd1tTzo97dZhxTYmsUPloYbbkLInE2B0Xxnaiys0b',
    tokenSecret = '3tB5YMTbi6glEzpLYuJBjd796kiDYpJuhsOPRF7b3e6ys';

console.log(oauthSignature.generate(httpMethod, url, apiParams, consumerSecret, tokenSecret));
