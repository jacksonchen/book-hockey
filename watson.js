// to import watson
var watson = require('watson-developer-cloud');

tone_analyzer = watson.tone_analyzer({
    username: "af761d6f-4f29-480c-a4a8-8b899d105e18",
    password: "Z92dlPEJSf42",
    version: 'v3-beta',
    version_date: '2016-02-11'
});

export.tone = function(tweet) {
    tone_analyzer.tone({ text: tweet },
    function(err, tone) {
        if (err)
        return err
        else
        return (JSON.stringify(tone, null, 2));
    });
}
