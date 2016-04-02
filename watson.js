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
export.tone = function(tweet) {
    for (var t in tweet) {
        if (object.hasOwnProperty(t)) {
            tone_analyzer.tone({ text: t },
                function(err, tone) {
                    if (err)
                    return err
                    else
                    return (JSON.stringify(tone, null, 2));
                }
            );
        }
    }
}
