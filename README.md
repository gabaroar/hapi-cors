# hapi-cors

Enables cors for a hapijs app based on config.

   Default Options:
   

    {
	    origins: ['*'],
	    allowCredentials: 'true',
	    exposeHeaders: ['content-type', 'content-length'],
	    maxAge: 600,
	    methods: ['POST, GET, OPTIONS'],
        headers: ['Accept', 'Content-Type', 'Authorization']
    }

Usage:

    var Hapi = require('hapi');
    var server = new Hapi.Server();
    
    server.connection({port: 8080});

	server.register({
		register: require('hapi-cors'),
		options: {
			origins: ['http://localhost:4200']
		}
	}, function(err){
		server.start(function(){
			console.log(server.info.uri);
		});
	});
	    
	    