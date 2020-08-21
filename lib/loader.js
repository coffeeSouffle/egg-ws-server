'use strict';

const ws = require('ws');
const assert = require('assert');
// const awaitFirst = require('await-first');
const path = require('path');
const Connection = require('./ws/connection');

const defaultConfig = {
  port: 8080,
  connection: {},
};

module.exports = app => {

  const config = Object.assign(app.config.ws, defaultConfig);
  assert(config.port && config.port !== 7001, '[egg-ws] port 7001 is protected port, please change it.');

  app.beforeStart(async () => {
    app.on('server', server => {
      const WebsocketServer = new ws.Server({ noServer: true });
      const conn = new Connection(app, WebsocketServer, config.connection);
      console.log(123);

      let connRouterPath = path.join(app.baseDir, 'app', 'ws', 'router.js');
      if (config.connection.routerPath) {
        connRouterPath = config.connection.routerPath;
      }

      app.wsServer = WebsocketServer;

      console.log(conn);

      require(connRouterPath)(conn);

      conn.use(conn.router.routes());
      server.on('upgrade', conn.callback());

      server.listen(config.port);
    });

    // await awaitFirst(app, [ 'server' ]);
  });
};
