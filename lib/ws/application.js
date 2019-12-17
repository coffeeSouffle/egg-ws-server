'use strict';

// const Connection = require('./connection');

class Application {
  constructor(app, websocketServer) {
    this.app = app;
    this.websocketServer = websocketServer;
    this.middleware = [];
  }
}

module.exports = Application;
