var Joi = require('joi');

module.exports = {
  pkg: require('../package.json'),
  name: "hapi-cors",
  register: async function(server, options) {

    var schema = {
      origins: Joi.array().default(['*']),
      allowCredentials: Joi.string().valid('true', 'false').default('true'),
      exposeHeaders: Joi.array().default(['content-type', 'content-length'], 'Array of exposed headers'),
      maxAge: Joi.number().default(600),
      methods: Joi.array().default(['POST, GET, OPTIONS']),
      headers: Joi.array().default(['Accept', 'Content-Type', 'Authorization']),
      checkOrigin: Joi.func()
    }

    Joi.validate(options, schema, function(err, value){
      if(err){
        throw err;
      }

      options = value;
    });

    server.ext({
      type: 'onPreResponse',
      method: function(request, reply){
        if(!request.headers.origin){
          return reply.continue;
        }

        var response = request.response.isBoom ? request.response.output : request.response

        // Use request's origin if it is present in whitelist
        if(options.checkOrigin !== undefined){
          if(options.checkOrigin(request.headers.origin)){
            response.headers['access-control-allow-origin'] = request.headers.origin;
          }
        }else{
          if (options.origins.indexOf(request.headers.origin) !== -1 || (options.origins.length == 1 && options.origins[0] == "*")) {
            response.headers['access-control-allow-origin'] = request.headers.origin;
          }
        }
        
        response.headers['access-control-allow-credentials'] = options.allowCredentials;

        if(request.method !== 'options'){
          return reply.continue;
        }

        response.statusCode = 200

        response.headers['access-control-expose-headers'] = options.exposeHeaders.join(', ');
        response.headers['access-control-max-age'] = options.maxAge;
        response.headers['access-control-allow-methods'] = options.methods.join(', ');
        response.headers['access-control-allow-headers'] = options.headers.join(', ');

        return reply.continue;
      }
    });
  }
}