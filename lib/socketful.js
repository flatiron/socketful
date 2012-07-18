/*
 * socketful.js: creates socket.io event maps to resourceful
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */

var socketful = exports,
    resourceful = require('resourceful'),
    util     = require('util'),
    utile    = require('utile'),
    http     = require('http');

exports.engines = {
  "socket.io": require('../lib/engines/socketio')
};

//
// ### function createServer (resources)
// #### @resources {resourceful.Resource} Resource(s) to use for the server.
//
// Responds with an `http.Server` instance with a `socketfulRouter` for the
// specified `resources`.
//
exports.createServer = function (resources, options, callback) {
  options = options || {};
  options.engine = options.engine || 'socket.io';
  if (!Array.isArray(resources)){
    resources = [resources];
  }
  return socketful.engines[options.engine].createServer(resources, options, callback);
};

//
// Name this `broadway` plugin.
//
exports.name = 'socketful';

//
// ### function init ()
// Initializes the `socketful` plugin with the App.
//
exports.init = function (done) {
  var app = this;

  if (app.resources) {
    //socketful.createServer(app.resources);
  }

  done();
};