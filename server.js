const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const express = require('express');
const http = require('http');
const Graph = require('node-dijkstra')
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
var bodyParser = require('body-parser')
var ss = require('socket.io-stream');
const port = process.env.PORT || 3000;


// var io = socketIO(server);
const publicPath = path.join(__dirname,'/public');
app.use(express.static(publicPath));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

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


global.route = new Graph()
global.myPath = [], global.endPoint = 'A', global.startPoint = 'A';

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

// var nav = io.of('/navigation')
io.on('connection', function(socket){
    console.log('raspberrypi connected');
	// socket.emit('turn on', {pi: myPath[0]}); 
	i = 1
	// socket.emit('turn on', {pi: myPath[0]});
	socket.on('start', function(){
		console.log("Move!!")
		io.emit('turn on', {pi: myPath[0]});		
	})

	socket.on('on dock', function(msg, fn){
		console.log(msg.pi, " is on the dock");
		if (i == myPath.length){
			io.emit('finish',{pi: 'Destination'})
			console.log("Destination Arrived!!");

		}
		else{
			console.log("turn on ", myPath[i]);
			io.emit('turn on', {pi: myPath[i]});
			i++;
		}		
	});

	socket.on('disconnect', ()=>{
		console.log('browser shutdown');
	});    
});

app.get('/navigation', (req,res)=>{
	// res.sendFile(__dirname + '/public/index.html');
	res.render('navigation', {path: myPath[0]})
})

app.get('/ready', (req,res)=>{	
	res.render('pathRequest')
})

app.get('/path_request', (req,res)=>{	
	route.addNode('A', { 'B':1, 'D':1, 'E':1 })
	route.addNode('B', { 'A':1, 'F':1 })
	route.addNode('C', { 'F':1, 'E':1 })
	route.addNode('D', { 'A':1, 'G':1 })
	route.addNode('E', { 'A':1, 'C':1, 'I':1 })
	route.addNode('F', { 'C':1, 'B':1, 'H':1 })
	route.addNode('G', { 'D':1 })
	route.addNode('H', { 'I':1, 'F':1})
	route.addNode('I', { 'E':1, 'H':1})

	console.log(route.graph);
	var myRoute = new Object();
	myRoute = map_to_object(route.graph);
	res.send(myRoute);
});

app.post('/path_request', (req,res)=>{
	startPoint = req.body.startPoint
	endPoint = req.body.endPoint
	myPath = route.path(startPoint, endPoint)
	console.log(startPoint, endPoint)
	console.log("node post path_request",myPath)
	res.redirect('/navigation');
})

server.listen(port, ()=>{
    console.log("Starting the server...");
})

