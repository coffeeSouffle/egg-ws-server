'use strict';

module.exports = agent => {
  if (agent.config.ws.agent) require('./lib/loader')(agent);
};
