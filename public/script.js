$(document).ready(function(){
    var socket = io('http://localhost:8080');

    socket.on('emotions', function(data) {
        var chart = new CanvasJS.Chart("oneCanvas",
    	{
    		title:{
    			text: "Real Time Emotions about \'" + data.topic + "\' on Twitter Right Now"
    		},
    		legend: {
    			maxWidth: 350,
    			itemWidth: 120
    		},
    		data: [
        		{
        			type: "pie",
        			showInLegend: false,
        			dataPoints: [
        				{
                        y: data.percents[0],
                            indexLabel: "Anger: " + data.percents[0]
                        },{
                        y: data.percents[1],
                            indexLabel: "Disgust: " + data.percents[1]
                        },{
                        y: data.percents[2],
                            indexLabel: "Fear: " + data.percents[2]
                        },{
                        y: data.percents[3],
                            indexLabel: "Joy: " + data.percents[3]
                        },{
                        y: data.percents[4],
                            indexLabel: "Sadness: " + data.percents[4]
                        }
        			]
        		}
    		]
        });
    	chart.render();
    });

    $('input#hash').keyup(function(event) {
        var regex = /(<([^>]+)>)/ig
        if(event.keyCode === 13){
            var hash = $('input#hash').val().replace(regex, "");
            if (hash[0] === '#') {
                hash = hash.substring(1, hash.length);
            }
            console.log(hash);
            socket.emit('hash', 0, hash);
            $('input#hash').val("");
        }
    });
});
