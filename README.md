# socketful

<img src="https://secure.travis-ci.org/flatiron/socketful.png?branch=master"></img>

Reflects [socket.io](http://socket.io) servers from [resourceful](http://github.com/flatiron/resourceful) resources. Can be used as a stand-alone module or as a [Flatiron](http://github.com/flatiron/) plugin.

# Explanation

The socketful project removes the process of writing boilerplate socket.io event mapping code for interacting with  [resourceful](http://github.com/flatiron/resourceful) resources. socketful uses <a href="http://en.wikipedia.org/wiki/Reflection_(computer_programming)">reflection</a> to reflect a [socket.io](http://socket.io) server interface that maps all socket.io events needed to perform basic real-time [CRUD](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations with [resourceful](http://github.com/flatiron/resourceful). socketful also has the ability to expose additional arbitrary <a href="#remote">remote resource methods</a> in socket.io

Through the removal of this boilerplate code, socketful creates a robust, standardized, and re-usable socket.io interface for any [resourceful](http://github.com/flatiron/resourceful) resource.

**Remark:** If you require [RESTful](http://en.wikipedia.org/wiki/Representational_state_transfer) HTTP routing instead of sockets, try the [restful](http://github.com/flatiron/restful) library.

# Installation

     npm install socketful

# Usage

## Define resource(s)

```js
var resourceful = require('resourceful'),
    Creature    = resourceful.define('creature');

Creature.property('type', String, { default: "dragon" });
Creature.property('life', Number, { default: 10, min: 0, max: 20 });
```

*[additional API documentation for defining resources](http://github.com/flatiron/resourceful)*

## As a Flatiron Plugin

To use socketful as a <a href="http://github.com/flatiron/flatiron">Flatiron</a> plugin you will have to:

 - Define resource(s) in your Flatiron app
 - Use the Flatiron `http` plugin
 - Pass the Flatiron `app.server` instance to `socketful.createServer`

Here is a code example of using socketful as a Flatiron plugin: <a href="https://github.com/flatiron/socketful/blob/master/examples/app.js">https://github.com/flatiron/socketful/blob/master/examples/app.js</a>

## As a stand-alone server

To use socketful as a stand-alone server you will have to:

 - Define resource(s)
 - Create a new server based on the resource(s) using `socketful.createServer`

Here is a code example of using socketful as a stand-alone server: <a href="https://github.com/flatiron/socketful/blob/master/examples/server.js">https://github.com/flatiron/socketful/blob/master/examples/server.js</a>

# Connecting to socketful

## Browser

```html
<script src="/socket.io/socket.io.js" type="text/javascript"></script>
<script>
  var socket = io.connect('http://localhost');
  var name = prompt('creature name?');
  var type = prompt('creature type?');
  socket.emit('creature', 'create', { id: name, type: type }, function(err, result) {
    if(err) {
      alert('Error \n\n' + JSON.stringify(err, true, 2));
    } else {
      alert('Created creature! \n\n' +  JSON.stringify(result, true, 2));
    }
  })
</script>
```

*see: <a href="https://github.com/flatiron/socketful/blob/master/examples/public/index.html">https://github.com/flatiron/socketful/blob/master/examples/public/index.html</a>*

## Node.js Client Script

```js
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
```
*see: <a href="https://github.com/flatiron/socketful/blob/master/examples/client.js">https://github.com/flatiron/socketful/blob/master/examples/client.js</a>*

# Core Socket.io Mappings

  By default, `socketful` will map all `Resourceful` methods in the following signature:

```js
server.on(resource, action, payload, callback);
```

**Example:**

```js
socket.emit('creature', 'create', { id: 'bob' } , function(err, bob) {
  console.log('created: ', bob);
};
```
```
Socket       Resource     Action    Payload  Callback        Resource Method

socket.emit('creature', 'create',  data,    callback)   =>  Creature.create()
socket.emit('creature', 'get',     data,    callback)   =>  Creature.get()
socket.emit('creature', 'all',     data,    callback)   =>  Creature.all()
socket.emit('creature', 'update',  data,    callback)   =>  Creature.update()
socket.emit('creature', 'destroy', data,    callback)   =>  Creature.destroy()
```

  The socket.io server will delegate all incoming `Creature` events to the resource and respond back with the appropriate result.

<a name"remote"></a>
# Exposing Arbitrary Resource Methods

In many cases, you'll want to expose additional methods on a Resource through socket.io outside of the included CRUD operations: `create`, `all`, `get`, `update`, `destroy`.

socketful has built in support for easily exposing arbitrary remote resource methods.

Consider the example of a `Creature`. We've already defined all the socketful CRUD events, but a Creature also needs to eat! 

Simply create a new method on the `Creature` resource called `feed`.

```js
Creature.feed = function (_id, options, callback) {
  callback(null, 'I have been fed');
}
```
This `feed` method is consider private by default, in that it will not be exposed to the web unless it's set to a `remote` function. To set a resource method to remote, simply:

```js
Creature.feed.remote = true
```

It's easy as that! By setting the `feed` method to remote, the following events will exist in the `socket.io` server.

```js
socket.emit('creature', 'feed', data, callback)  => Creature.feed()
```

## Resource Security

There are several ways to provide security and authorization for accessing resource methods exposed with socketful. The recommended pattern for authorization is to use resourceful's ability for `before` and `after` hooks. In these hooks, you can add additional business logic to restrict access to the resource's methods. 

**TL;DR; For security and authorization, you should use resourceful's `before` and `after` hooks.**

# Tests

     npm test

# TODO

 - Cleanup create / extend code for flatiron plugin
 - Better browser / isomorphic support via resourceful `socketful` engine
 - Add ability to specify schemas for remote method argument payloads
 - Improve Tests
 - Add better error support via `errs` library
