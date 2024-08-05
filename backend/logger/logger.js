const { createLogger, transports, format } = require("winston");


function formatMessage(message) {
  return message.map((msg) => (typeof msg === 'object' ? JSON.stringify(msg) : msg)).join(' ');
}

class Logger {
  constructor() {
    this.logger = createLogger({
      level: "debug",
      format: format.combine(format.timestamp(), format.json()),
      defaultMeta: { service: "user-service" },
      transports: [
        new transports.Console(),
        new transports.File({ filename: "error.log", level: "error" }),
        new transports.File({ filename: "combined.log" }),
      ],
    });
  }

  

  info(...message) {
    this.logger.info(formatMessage(message));
  }

  error(...message) {
    this.logger.error(formatMessage(message));
  }

  debug(...message) {
    this.logger.debug(formatMessage(message));
  }

  // Add other logging methods as needed
}

const instance = new Logger();
Object.freeze(instance);

module.exports = instance;
