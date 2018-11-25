const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const express = require('express');
const http = require('http');
const Graph = require('node-dijkstra')
const socketIO = require('socket.io');
var ss = require('socket.io-stream');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
const publicPath = path.join(__dirname,'/public');
app.use(express.static(publicPath));


// views
var hbs = exphbs.create({
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, '/views/partials'),
    layoutsDir: path.join(__dirname, './views/layouts')
});

app.use(express.static('public'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

var route = new Graph()
var myPath = [], endPoint = 'A', startPoint = 'A';


function map_to_object(map) {
    const out = Object.create(null)
    map.forEach((value, key) => {
      if (value instanceof Map) {
        out[key] = map_to_object(value)
      }
      else {
        out[key] = value
      }
    })
    return out
 }

app.get('/ready', (req,res)=>{
	res.render('pathRequest')
})

app.get('/path_request', (req,res)=>{	
	route.addNode('A', { 'B':1 })
	route.addNode('B', { 'A':1, 'C':2, 'D': 4 })
	route.addNode('C', { 'B':2, 'D':1 })
	route.addNode('D', { 'C':1, 'B':4 })

	console.log(route.graph)
	var myRoute = new Object()
	myRoute = map_to_object(route.graph)
	console.log(myRoute)
	res.send(myRoute)
});

app.post('/path_request', (req,res)=>{
	startPoint = req.body.startPoint
	endPoint = req.body.endPoint
	myPath = route.path(startPoint, endPoint)
	myObjData = {route, path:myPath}
	res.redirect('/navigation');
})

app.get('/navigation', (req,res)=>{
	var navigation = io.of('/navigation');
	navigation.on('connection', (socket)=>{
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

})



server.listen(port, ()=>{
    console.log("Starting the server...");
})

