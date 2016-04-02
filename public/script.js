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
        console.log("++++++++++++"+sum+"++++++++++++++++++++");
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
        				{ y: (emotions['anger']/sum)*100, indexLabel: "Anger: " + String(Math.round((emotions['anger']/sum)*100)) },
                        { y: (emotions['disgust']/sum)*100, indexLabel: "Disgust: " + String(Math.round((emotions['disgust']/sum)*100)) },
        				{ y: (emotions['fear']/sum)*100, indexLabel: "Fear: " + String(Math.round((emotions['fear']/sum)*100)) },
        				{ y: (emotions['sadness']/sum)*100, indexLabel: "Sadness: " + String(Math.round((emotions['sadness']/sum)*100)) },
        				{ y: (emotions['joy']/sum)*100, indexLabel: "Joy: " + String(Math.round((emotions['joy']/sum)*100)) },
        			]
        		}
    		]
    	});
    	chart.render();
    });
});
