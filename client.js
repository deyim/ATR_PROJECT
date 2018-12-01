const io = require("socket.io-client");
const GPIO = require("onoff").Gpio
// const five = require("johnny-five");

const socket = io.connect('https://boiling-spire-30988.herokuapp.com/');
// const socket = io.connect('http://localhost:3000');

var hallPin = 20;
var relayPin = 2;
var myNodeNumber = 'A';

var hall = new GPIO(hallPin, 'in', 'both', {debounceTimeout: 10});
var relay = new GPIO(relayPin, 'out');


socket.on('connect', function(){
    console.log('Connected to server - client', myNodeNumber);
}); 

socket.on('disconnect',function(){
   console.log('disconnected');
});
socket.on('turn on', function(msg){
    /*{pi: pi}*/
    // socket.emit('')
    
    
    if(msg.pi == myNodeNumber){
        relay.writeSync(1);
   console.log("turned on", msg.pi)        
       console.log("roomba moving to", msg.pi)
        

   hall.watch((err, value) => {
           if (err) {
              throw err;
           }
            
           if (value == 0){         
         console.log("Sensed")
              socket.emit('on dock', {pi: myNodeNumber});
         relay.writeSync(0)
              console.log("arrived to", myNodeNumber);
           }
   });
    }


})


// const io = require("socket.io-client");
// const GPIO = require("onoff").Gpio
// // const five = require("johnny-five");

// const socket = io.connect('https://floating-inlet-57687.herokuapp.com/');
// // const socket = io.connect('http://localhost:3000');

// var hallPin = 20;
// var relayPin = 2;
// var myNodeNumber = 1;

// var hall = new GPIO(hallPin, 'in', 'both', {debounceTimeout: 10});
// var relay = new GPIO(relayPin, 'out');


// socket.on('connect', function(){
//     console.log('Connected to server - client 1');
// }); 


// socket.on('turn on', function(msg){
//     /*{pi: pi}*/
//     // socket.emit('')
    
    
//     if(msg.pi == myNodeNumber){
//         relay.writeSync(1);
// 		console.log("turned on", msg.pi)        
// 	    console.log("111 roomba moving")
	        

// 		hall.watch((err, value) => {
// 		        if (err) {
// 		           throw err;
// 		        }
		         
// 		        if (value == 0){      	
// 		        	socket.emit('on dock', {pi: myNodeNumber});
// 		        	console.log("arrived to", myNodeNumber);
// 	        	}
// 		});
// 	    }

// });


