$(document).ready(function(){
    var socket = io('http://localhost:8080');

    socket.on('emotionsL', function(data) {
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

    socket.on('emotionsR', function(data) {
        var chart = new CanvasJS.Chart("twoCanvas",
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

    $('input#one').keyup(function(event) {
        var regex = /(<([^>]+)>)/ig
        if(event.keyCode === 13){
            var one = $('input#one').val().replace(regex, "");
            if (one[0] === '#') {
                one = one.substring(1, one.length);
            }
            console.log(one);
            socket.emit('hash', 0, one);
            $('input#one').val("");
        }
    });
    $('input#two').keyup(function(event) {
        var regex = /(<([^>]+)>)/ig
        if(event.keyCode === 13){
            var two = $('input#two').val().replace(regex, "");
            if (two[0] === '#') {
                two = two.substring(1, two.length);
            }
            console.log(two);
            socket.emit('hash', 1, two);
            $('input#two').val("");
        }
    })
});
