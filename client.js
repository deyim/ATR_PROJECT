const io = require("socket.io-client");
//const GPIO = require("onoff").Gpio
// const five = require("johnny-five");

//const socket = io.connect('https://aqueous-chamber-79940.herokuapp.com/');
const socket = io.connect('http://localhost:3000');

// var hallPin = 20;
// var relayPin = 2;
var myNodeNumber = 1;

// var hall = new GPIO(hallPin, 'in', 'both', {debounceTimeout: 10});
// var relay = new GPIO(relayPin, 'out');


socket.on('connect', function(){
    console.log('Connected to server - client 1');
}); 


socket.on('turn on', function(msg){
    /*{pi: pi}*/
    // socket.emit('')
    
    
    if(msg.pi == myNodeNumber){
        // relay.writeSync(1);
        // hall.watch((err, value) => {
        //   if (err) {
        //     throw err;
        //   }
         
        //   if (value == 1){
            // relay.writeSync(value);
        console.log("turned on", msg.pi)        
        console.log("111 roomba moving")
        var start = Date.now(), now = start;
        while (now - start < 5000) {
          now = Date.now();
        }
        socket.emit('on dock', {pi: myNodeNumber});
        
        //   }
        // });
    }


})
