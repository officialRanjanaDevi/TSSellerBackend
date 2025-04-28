import winston from 'winston';
import LokiTransport from 'winston-loki';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'backend' },
  transports: [
    new winston.transports.Console(),
    new LokiTransport({
      host: 'http://localhost:3100',
      json: true,
      labels: { job: 'backend' },
    }),
    new winston.transports.File({ filename: './logs/pm2-combined.log' }), // Combined log file for both stdout and stderr
  ],
});

export default logger;

