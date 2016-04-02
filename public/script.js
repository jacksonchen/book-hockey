$(document).ready(function(){
    var socket = io('http://localhost:8080');

    socket.on('emotions', function(emotions) {
        var sum = 0;
        for (e in emotions){
            console.log(e, emotions[e]);
            if(emotions.hasOwnProperty(e)){
                sum += emotions[e];
            }
        }
        $('#wrapper').text(JSON.stringify(emotions));
    });

});
