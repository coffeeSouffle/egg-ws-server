'use strict';

module.exports = conn => {
  const { router } = conn;

  router.get('/', async (ctx, next) => {
    await next();
  });
};
