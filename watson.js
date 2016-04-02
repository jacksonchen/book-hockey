// to import watson
var watson = require('watson-developer-cloud');

// readies the wateson by using usernames and stuff
tone_analyzer = watson.tone_analyzer({
    username: "af761d6f-4f29-480c-a4a8-8b899d105e18",
    password: "Z92dlPEJSf42",
    version: 'v3-beta',
    version_date: '2016-02-11'
});

// the actual tone analysis
exports.tone = function(tweet, callback) {
    tone_analyzer.tone({ text: tweet }, function(err, tone) {
        if (err){
            if(err.code != 429 && err.code != 500){
                console.log(tweet);
                console.log(err);
            }
            callback(err, tone);
        }else{
            callback(null, tone);
        }
    });
}
