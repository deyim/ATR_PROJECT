const path = require('path');
const fs = require('fs');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var ss = require('socket.io-stream');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const publicPath = path.join(__dirname,'/public');
app.use(express.static(publicPath));

var findPath = ()=>{
	;
	return [1,2,3];
}

server.listen(port, ()=>{
    console.log("Starting the server...");
})

var myPath = findPath();

io.on('connection', (socket)=>{
    console.log('raspberrypi connected');

    socket.emit('turn on', {pi: myPath[0]});
    

    i = 1
	socket.on('on dock', function(msg, fn){
		console.log(msg.pi, " is on the dock");
		if (i == myPath.length){
	    	console.log("Destination Arrived!!");
	    }
	    else{
	    	console.log("turn on ", myPath[i]);
			socket.broadcast.emit('turn on', {pi: myPath[i]});
			i++;
	    }		
	});


	socket.on('disconnect', ()=>{
	    console.log('browser shutdown');
	});	  

    
})
