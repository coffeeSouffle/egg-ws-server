'use strict';

class Client {
  constructor(connection, ws, ctx) {
    this.connection = connection;
    this.ws = ws;
    this.ctx = ctx;
  }
}

module.exports = Client;
