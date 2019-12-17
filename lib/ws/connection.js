'use strict';

const compose = require('koa-compose');
const convert = require('koa-convert');
const isGeneratorFunction = require('is-generator-function');
const onFinished = require('on-finished');
const http = require('http');
const Stream = require('stream');
const KoaRouter = require('egg-router').Router;
const WEBSOCKET_SERVER = Symbol('EGG-WS#WEBSOCKET_SERVER');

class Connection {
  constructor(app, server, config = {}) {
    this.app = app;
    this[WEBSOCKET_SERVER] = server;
    this.middleware = [];
    this.router = new KoaRouter(config);
    console.log(this.router);
  }

  get server() {
    return this[WEBSOCKET_SERVER];
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

    const handleRequest = (req, socket, head) => {
      req.socket = socket;
      req.head = head;
      const ctx = this.app.createContext(req, new http.ServerResponse(req));
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }

  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    const onerror = err => ctx.onerror(err);
    const handle = () => connect(ctx);
    onFinished(res, onerror);
    return fnMiddleware(ctx).then(handle).catch(onerror);
  }
}

function connect(ctx) {
  if (!ctx.req) return;

  const req = ctx.req;
  console.log(req);
  if (req.socket && req.head) {
    // build connection
    ctx.ws.server.handleUpgrade(req, req.socket, req.head, ws => {
      ctx.ws.server.emit('connection', ws, req);
    });

    return;
  }

  const res = ctx.res;
  let body = ctx.body;
  const code = ctx.status || 404;

  if (body === null) {
    if (req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      body = ctx.message || String(code);
    }

    if (!res.headerSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }

    return res.end(body);
  }

  if (Buffer.isBuffer(body)) return res.end(body);
  if (typeof body === 'string') return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  body = JSON.stringify(body);
  if (!res.headerSent) {
    ctx.length = Buffer.byteLength(body);
  }

  res.end(body);
}

module.exports = Connection;
