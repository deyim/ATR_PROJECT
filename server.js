const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const express = require('express');
const http = require('http');
const Graph = require('node-dijkstra')
const socketIO = require('socket.io');
var bodyParser = require('body-parser')
var ss = require('socket.io-stream');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
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

// var route = new Graph()
// var myPath = [], endPoint = 'A', startPoint = 'A';
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

io.on('connection', (socket)=>{
	console.log('raspberrypi connected');
	socket.emit('connection')

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

app.get('/index', (req,res)=>{
	console.log("HI");
	res.render('index');
})
app.get('/ready', (req,res)=>{	
	res.render('pathRequest')
})

app.get('/path_request', (req,res)=>{	
	route.addNode('A', { 'D':1, 'E':1 })
	route.addNode('B', { 'F':1 })
	route.addNode('C', { 'E':1, 'F':1 })
	route.addNode('D', { 'G':1 })
	route.addNode('E', { 'H':1, 'I':1 })
	route.addNode('F', { 'H':1 })
	route.addNode('G', {})
	route.addNode('H', { 'I':1 })
	route.addNode('I', {})

	console.log(route.graph);
	var myRoute = new Object();
	myRoute = map_to_object(route.graph);
	res.send(myRoute);
});

app.post('/path_request', (req,res)=>{
	startPoint = req.body.startPoint
	endPoint = req.body.endPoint
	myPath = route.path(startPoint, endPoint)
	console.log("node post path_request",myPath)
	res.redirect('/navigation');
})

app.get('/navigation', (req,res)=>{
	res.render('navigation', {myPath:myPath})	
})



server.listen(port, ()=>{
    console.log("Starting the server...");
})

