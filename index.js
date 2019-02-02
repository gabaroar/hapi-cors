var Joi = require('joi');

exports.plugin = {
  pkg: require('./package.json'),
  register: async function(server, options) {

    var schema = {
      origins: Joi.array().default(['*']),
      allowCredentials: Joi.string().valid('true', 'false').default('true'),
      exposeHeaders: Joi.array().default(['content-type', 'content-length'], 'Array of exposed headers'),
      maxAge: Joi.number().default(600),
      methods: Joi.array().default(['POST, GET, OPTIONS']),
      headers: Joi.array().default(['Accept', 'Content-Type', 'Authorization'])
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
        if (options.origins.indexOf(request.headers.origin) !== -1 || (options.origins.length == 1 && options.origins[0] == "*")) {
          response.headers['Access-Control-Allow-Origin'] = request.headers.origin;
        }
        response.headers['Access-Control-Allow-Credentials'] = options.allowCredentials;

        if(request.method !== 'options'){
          return reply.continue;
        }

        response.statusCode = 200

        response.headers['access-control-expose-headers'] = options.exposeHeaders.join(', ');
        response.headers['access-control-max-age'] = options.maxAge;
        response.headers['Access-Control-Allow-Methods'] = options.methods.join(', ');
        response.headers['Access-Control-Allow-Headers'] = options.headers.join(', ');

        return reply.continue;
      }
    });
  }
}
