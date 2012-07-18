var engine = exports;

engine.createServer = function (resources, options, callback) {
  var io = require('socket.io').listen(options.server || 8000, function(){
    if (callback) {
      callback(null, io);
    }
  });
  io.sockets.on('connection', function (socket) {
    
    //
    // Extend CRUD methods
    //
    resources.forEach(function(resource) {
      socket.on(resource.lowerResource + 's', function (action, payload, callback) {

        if(typeof engine[action] === 'function') {
          return engine[action](resource, payload, callback);
        }

        if(typeof resource[action] === 'function' && resource[action].remote) {
          return resource[action](payload.id, payload, callback);
        }

        return callback(new Error(action + ' is not a valid action.'));

      });
    });
    
    
    //
    // Extend abritrary remote methods
    //
    
    socket.on('disconnect', function () { 
      console.log('got a disconnect');
    });
  });
  return io;
};

engine.create = function (resource, payload, callback) {
  resource.create(payload, callback);
};

engine.get = function (resource, payload, callback) {
  resource.get(payload, callback);
};

engine.all = function (resource, payload, callback) {
  resource.all(callback);
};

engine.update = function (resource, payload, callback) {
  resource.update(payload.id, payload, callback);
};

engine.destroy = function (resource, payload, callback) {
  resource.destroy(payload.id, callback);
};
