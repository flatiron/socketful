
# sockful

[![Build Status](https://secure.travis-ci.org/flatiron/sockful.png)](http://travis-ci.org/flatiron/sockful)

Creates [socket.io](http://socket.io) servers and event maps for [resourceful](http://github.com/flatiron/resourceful) resources. Can be used as a stand-alone module or as a [Flatiron](http://github.com/flatiron/) plugin.

# Explanation

The sockful project removes the process of writing boilerplate socket.io event mapping code for interacting with  [resourceful](http://github.com/flatiron/resourceful) resources. sockful uses <a href="http://en.wikipedia.org/wiki/Reflection_(computer_programming)">reflection</a> to reflect a socket.io server interface which maps all the socket.io events needed to perform basic [CRUD](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations with [resourceful](http://github.com/flatiron/resourceful). sockful also has the ability to expose additional arbitrary <a href="#remote">remote resource methods</a> through socket.io

Through the removal of this boilerplate code, sockful creates a robust, standardized, and re-usable socket.io interface for any [resourceful](http://github.com/flatiron/resourceful) resource.

# Installation

     npm install sockful

# Usage

## As a Flatiron Plugin

To use sockful as a <a href="http://github.com/flatiron/flatiron">Flatiron</a> plugin you will have to:

 - Define resource(s) in your Flatiron app
 - Use the sockful plugin in your Flatiron app
 - Set `sockful=true` on the resource to let Flatiron know to expose it

Here is a code example of using sockful as a Flatiron plugin: <a href="https://github.com/flatiron/sockful/blob/master/examples/app.js">https://github.com/flatiron/sockful/blob/master/examples/app.js</a>

## As a stand-alone server

To use sockful as a stand-alone server you will have to:

 - Define resource(s)
 - Create a new server based on the resource(s) using `sockful.createServer`

Here is a code example of using sockful as a stand-alone server: <a href="https://github.com/flatiron/sockful/blob/master/examples/server.js">https://github.com/flatiron/sockful/blob/master/examples/server.js</a>

## Core Socket.io Mappings

  By default, `sockful` will map all `Resourceful` methods in the following signature:

```js
server.on(resource, action, payload, callback);
```

Example:

```js
socket.emit('creature', 'create', { id: 'bob' } , function(err, bob) {
  console.log('created: ', bob);
};
```

     Socket Event                                           Action

     socket.emit('creature', 'create', data, callback)  => Creature.create()
     socket.emit('creature', 'get', data, callback)     => Creature.get()
     socket.emit('creature', 'all', data, callback)     => Creature.all()
     socket.emit('creature', 'update', data, callback)  => Creature.update()
     socket.emit('creature', 'destroy', data, callback) => Creature.destroy()


  The socket server will delegate all incoming Creature events to the resource and respond back with the appropriate result.

## Relational Resources

To define relational data in sockful you will have to:

 - Define the relationship in the resource itself using the resourceful `Resource.parent()` API
 - Create a new server based on the resource(s)

sockful will then properly reflect the relational properties of your resources into the socket server.

Here is a simple code example of using sockful with `Albums` and `Songs`: <a href="https://github.com/flatiron/sockful/blob/master/examples/server.js">https://github.com/flatiron/sockful/blob/master/examples/server.js</a>



<a name"remote"></a>
## Exposing Arbitrary Resource Methods

In many cases, you'll want to expose additional methods on a Resource through socket.io outside of the included CRUD operations: `create`, `all`, `get`, `update`, `destroy`.

sockful has built in support for easily exposing arbitrary remote resource methods.

Consider the example of a `Creature`. We've already defined all the sockful CRUD events, but a Creature also needs to eat! 

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

     socket.emit('creature', 'feed', data, callback)  => Creature.feed()


## Resource Security

There are several ways to provide security and authorization for accessing resource methods exposed with sockful. The recommended pattern for authorization is to use resourceful's ability for `before` and `after` hooks. In these hooks, you can add additional business logic to restrict access to the resource's methods. 

**TL;DR; For security and authorization, you should use resourceful's `before` and `after` hooks.**

# Tests

     npm test

# TODO

 - Full `resourceful` property type support ( numeric, boolean, array, object )
 - Full `resourceful` nested property schema support
 - Add ability to specify schemas for remote method argument payloads
 - Improve Tests
 - Add better error support via `errs` library
