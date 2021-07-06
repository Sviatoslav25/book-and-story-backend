import winston from 'winston';
import config from '../constants/config';

const format = config.isProduction
  ? winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      winston.format.metadata(),
      winston.format.splat(),
      winston.format.json()
    )
  : winston.format.combine(winston.format.cli(), winston.format.splat());

const logger = winston.createLogger({
  level: config.logLevel,
  levels: winston.config.npm.levels,
  format,
  transports: [new winston.transports.Console()],
  exitOnError: false,
});

export default logger;
