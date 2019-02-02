# hapi-cors

Enables cors for a hapijs app based on config.

Default Options:  
```javascript
{
	origins: ['*'],
	allowCredentials: 'true',
	exposeHeaders: ['content-type', 'content-length'],
	maxAge: 600,
	methods: ['POST, GET, OPTIONS'],
	headers: ['Accept', 'Content-Type', 'Authorization']
}
```
	

Usage:
```javascript
'use strict'

const Hapi = require('hapi');

const server = Hapi.server({
	host: 'localhost',
	port: 8000
});

server.route({
	method: 'GET',
	path: '/hello',
	handler: function(request, h) {
		return h.response({greeting: "Hello there!"});
	}
});

const start = async function() {
	try {
		await server.register({
			plugin: require('hapi-cors'),
			options: {
				origins: ['http://localhost:3000']
			}
		})

		await server.start();
	} catch(err) {
		console.log(err);
		process.exit(1);
	}
};

start();
```
	    
	    