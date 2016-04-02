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
        var chart = new CanvasJS.Chart("wrapper",
    	{
    		title:{
    			text: "Real Time Emotions in Twitter Right Now"
    		},
    		legend: {
    			maxWidth: 350,
    			itemWidth: 120
    		},
    		data: [
        		{
        			type: "pie",
        			showInLegend: false,
        			legendText: "{indexLabel}",
        			dataPoints: [
        				{ y: emotions['anger'], indexLabel: "Anger: " + String(emotions['anger']) },
        				{ y: emotions['disgust'], indexLabel: "Disgust: " + String(emotions['disgust']) },
        				{ y: emotions['fear'], indexLabel: "Fear: " + String(emotions['fear']) },
        				{ y: emotions['sadness'], indexLabel: "Sadness: " + String(emotions['sadness']) },
        				{ y: emotions['joy'], indexLabel: "Joy: " + String(emotions['joy']) },
        			]
        		}
    		]
    	});
    	chart.render();
    });
});
