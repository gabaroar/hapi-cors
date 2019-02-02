'use strict'

const Lab = require('lab');
const Code = require('code');
const Hapi = require("hapi");

const lab = (exports.lab = Lab.script())

const { describe, it } = lab;
const expect = Code.expect;

describe('Cors plug in', () => {
    it('defaults to all origins', async () => {
        const server = new Hapi.Server();

        server.route({
            method: 'GET',
            path: '/',
            handler: () => {
                return {
                    pluginName: 'hapi-cors'
                };
            }
        });

        server.register({
            plugin: require('../index')
        })

        const injectOptions = {
            method: 'GET',
            url: '/',
            headers: {
                origin: "http://localhost"
            }
        }

        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(200);
        expect(response.headers['access-control-allow-origin']).to.equal('http://localhost');

        const injectOptions2 = {
            method: 'GET',
            url: '/',
            headers: {
                origin: "http://localhost:3000"
            }
        }

        const response2 = await server.inject(injectOptions2);
        expect(response2.statusCode).to.equal(200);
        expect(response2.headers['access-control-allow-origin']).to.equal('http://localhost:3000');
    });

    it('takes an array of origins', async () => {
        const server = new Hapi.Server();

        server.route({
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                return {
                    pluginName: 'hapi-cors'
                }
            }
        });

        await server.register({
            plugin: require('../index'),
            options: {
                origins: ['http://localhost', 'http://localhost:3000']
            }
        });

        const injectOptions = {
            method: 'GET',
            url: '/',
            headers: {
                origin: 'http://localhost:4000'
            }
        }

        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(200);
        expect(response.headers['access-control-allow-origin']).to.equal(undefined);

        const request2 = {
            method: 'GET',
            url: '/',
            headers: {
                origin: 'http://localhost'
            }
        }
        const response2 = await server.inject(request2);
        expect(response2.statusCode).to.equal(200);
        expect(response2.headers['access-control-allow-origin']).to.equal('http://localhost');

        const request3 = {
            method: 'GET',
            url: '/',
            headers: {
                origin: 'http://localhost:3000'
            }
        }
        const response3 = await server.inject(request3);
        expect(response3.statusCode).to.equal(200);
        expect(response3.headers['access-control-allow-origin']).to.equal('http://localhost:3000');
    });

    it('takes a function', async () => {
        const server = new Hapi.Server();

        let checkOrigin = (origin) => {
            if(origin === 'http://localhost' || origin === 'http://localhost:3000'){
                return true;
            }else{
                return false;
            }
        }

        await server.register({
            plugin: require('../index'),
            options: {
                checkOrigin: checkOrigin
            }
        });

        server.route({
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                return {
                    pluginName: 'hapi-cors'
                }
            }
        })

        const request = {
            method: 'GET',
            url: '/',
            headers: {
                origin: 'http://localhost:4000'
            }
        }

        const response = await server.inject(request);
        expect(response.statusCode).to.equal(200);
        expect(response.headers['access-control-allow-origin']).to.equal(undefined);

        const request2 = {
            method: 'GET',
            url: '/',
            headers: {
                origin: 'http://localhost'
            }
        }
        const response2 = await server.inject(request2);
        expect(response2.statusCode).to.equal(200);
        expect(response2.headers['access-control-allow-origin']).to.equal('http://localhost');

        const request3 = {
            method: 'GET',
            url: '/',
            headers: {
                origin: 'http://localhost:3000'
            }
        }
        const response3 = await server.inject(request3);
        expect(response3.statusCode).to.equal(200);
        expect(response3.headers['access-control-allow-origin']).to.equal('http://localhost:3000');
    });
});