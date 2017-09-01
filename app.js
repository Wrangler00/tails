	const fs = require('fs');

	var express = require('express');
	var app = express();
	var http = require('http').Server(app);
	var io = require('socket.io')(http);

	const Tail = require("tail").Tail;
	const readLastLines = require('read-last-lines');
	const readMutipleFiles = require('read-multiple-files');

	//paths to file
	var source = ["animals.txt","demo.txt","animalsCopy.txt"];

	var tail = new Array(source.length);
	app.use(express.static(__dirname + '/views'));
	app.set('view engine','ejs');

	var i=0,allLastLines = {};
	function lastlines(){
		if(i<source.length){
			tail[i] = new Tail(source[i]);	

			tail[i].on("line", function(data) {
			  console.log(data);
			});

			tail[i].on("error", function(error) {
			  console.log('ERROR: ', error);
			});

			readLastLines.read(source[i], 10)
		    .then((lines) =>{
		    	allLastLines[source[i]]=lines;
		    	i++;
		    	lastlines();
		    });
		}else{	
			console.log(allLastLines);
		}
	}
	lastlines();

	io.on('connection',function(socket){
		console.log('new connection');
		socket.emit('lastlines',allLastLines);
	});

	app.get('/',function(req,res){
		res.render('index',{msg:'hello'});
	});

	http.listen(3000, function(){
		console.log('listening on *:3000');
	});