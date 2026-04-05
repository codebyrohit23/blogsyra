// src/logger/httpLogger.ts
import pinoHttp from 'pino-http';
import { randomUUID } from 'crypto';

import { logger } from './logger';

export const httpLogger = pinoHttp({
  logger,

  genReqId: (req) => req.headers['x-request-id']?.toString() || randomUUID(),

  useLevel: 'info',

  customSuccessMessage(req, res) {
    return `${req.method} ${req.url} -> ${res.statusCode}`;
  },

  customErrorMessage(req, res, err) {
    return `${req.method} ${req.url} -> ${res.statusCode || 500} ERROR: ${err.message}`;
  },

  customProps(req, res) {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress;

    return {
      reqId: req.id,
      ip,
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      statusCode: res.statusCode,
      latencyMs: res.getHeader('x-response-time'),
    };
  },
});
