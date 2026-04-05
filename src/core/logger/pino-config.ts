import { LoggerOptions } from 'pino';
import { Log_level } from './types';
import { Environment } from '@/shared/constants';
import { config } from '../config';

const getLoglevel = () =>
  config.app.logLevel || config.app.nodeEnv === Environment.DEVELOPEMENT
    ? Log_level.INFO
    : Log_level.DEBUG;

export const pinoConfig: LoggerOptions = {
  level: getLoglevel(),

  base: {
    // service: config.app.appName,
    // env: config.app.nodeEnv,
    pid: process.pid,
  },

  timestamp: () => `,"time":"${new Date().toISOString()}"`,

  formatters: {
    level(label) {
      return { level: label };
    },
  },

  transport:
    config.app.nodeEnv === Environment.PRODUCTION
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true,
            translateTime: true,
          },
        },

  redact: {
    paths: ['req.headers.authorization', '*.password', '*.token', 'password', 'token'],
    remove: true,
  },
};
