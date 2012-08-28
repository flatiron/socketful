var engine = exports;

engine.createServer = function (resources, options, callback) {
  var io = require('socket.io').listen(options.server || 8000, function(){
    if (callback) {
      callback(null, io);
    }
  });
  io.sockets.on('connection', function (socket) {
    resources.forEach(function(resource) {
      //
      // For every resource, create a new socket.io handler
      //
      //
      // Remark: Delegate the resource action to the appropiate engine method
      //
      socket.on(resource.lowerResource, function (action, payload, callback) {
        //
        // CRUD methods
        //
        if(typeof resource[action] === 'function') {
          return engine.request(resource, action, payload, callback);
        }
        //
        // Abritrary remote methods
        //
        if(typeof  resource[action]  === 'function' && resource[action].remote) {
          return engine.request(resource, action, payload, callback);
        }
        return callback(new Error(action + ' is not a valid action.'));
      });
    });
    socket.on('disconnect', function () { 
      // console.log('got a disconnect');
    });
  });
  return io;
};

engine.request = function(resource, action, payload, callback) {
  //
  // Remark: Perform a switch/case to determine Resource method call signature
  //
  switch (action) {
    case 'create':
      resource[action](payload, callback);
    break;
    case 'get':
      resource[action](payload, callback);
    break;
    case 'all':
      resource[action](callback);
    break;
    case 'update':
      resource[action](payload.id, payload, callback);
    break;
    case 'destroy':
      resource[action](payload.id, callback);
    break;
    default:
      resource[action](payload.id, payload, callback);
    break;
  }
}