var io = require('socket.io-client');
var socket = io.connect('http://localhost:8000');

var user =  { id: 'bob', type: 'dragon' };

socket.emit('creature', 'create', user, function(err, result) {
  if(err) {
    console.log('Error \n\n' + JSON.stringify(err, true, 2));
  } else {
    console.log('Created creature! \n\n' +  JSON.stringify(result, true, 2));
  }
});
