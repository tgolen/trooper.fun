import winston from 'winston';
import expressWinston from 'express-winston';

// Console transport for winton.
const consoleTransport = new winston.transports.Console();

// Set up winston logging.
const winstonLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        consoleTransport
    ]
});

export const logger = (app) => {
    // Enable extensive logging if the DEBUG environment variable is set.
    if (process.env.DEBUG) {
        // Print all winston log levels.
        winstonLogger.level = 'silly';
      
        // Enable express.js debugging. This logs all received requests.
        app.use(expressWinston.logger({
          transports: [
                consoleTransport
              ],
              winstonInstance: winstonLogger
        }));
      
    } else {
        // By default, only print all 'verbose' log level messages or below.
        winstonLogger.level = 'verbose';
    }
};
