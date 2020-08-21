'use strict';

const convert = require('koa-convert');
const compose = require('koa-compose');
const http = require('http');
const isGeneratorFunction = require('is-generator-function');

class Server {
  constructor(opts) {
    this.opts = opts || {};
    this.clients = new Map();

    if (typeof this.opts.generateId !== 'function') {

    }
  }

  generateId() {

  }

  set(client, id = null) {
    if (!id) {
      id =
    }

    this.clients.set(id, client);
  }

  get(id) {
    return this.clients.get(name);
  }

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    if (isGeneratorFunction(fn)) {
      fn = convert(fn);
    }
    this.middleware.push(fn);
    return this;
  }

  callback() {
    const fn = compose(this.middleware);

    const handleRequest = msg => {
      const ctx = this.app.createContext(req, new http.ServerResponse(req));
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }
}

module.exports = Server;
