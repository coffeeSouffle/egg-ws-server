'use strict';

module.exports = app => {
  if (app.config.ws.app) require('./lib/loader')(app);
};
