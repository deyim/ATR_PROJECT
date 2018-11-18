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


var findPath = ()=>{
	;
	return [1,2];
}



// const publicPath = path.join(__dirname,'/public');
app.use(express.static(publicPath));

server.listen(port, ()=>{
    console.log("Starting the server...");
})

var path = findPath();

io.on('connection', (socket)=>{
    console.log('raspberrypi connected');

    socket.emit('turn on', {pi: path[0]});

    for(var i = 1 ; i < path.length ; i++){
    	socket.on('on dock', function(msg){
	   		/*msg = {sender: 3}*/
	        socket.broadcast.emit('turn on', {pi: path[i]});
	    })  
    }

	socket.on('disconnect', ()=>{
	    console.log('browser shutdown');
	});	  

    
})
