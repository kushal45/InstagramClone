const { createLogger, transports, format } = require("winston");
 // Increase the limit as needed
//const WinstonLogStash = require("winston3-logstash-transport");
const path = require("path");
const callsite = require('callsite');
function formatMessage(message) {
  return message
    .map((msg) => (typeof msg === "object" ? JSON.stringify(msg) : msg))
    .join(" ");
}

// Custom format to include file name and function name
const customFormat = format.printf(({ level, message, timestamp }) => {
  const stack = callsite();
  const callSite = stack[2]; // Adjust the index based on where the logger is called
  const fileName = callSite.getFileName();
  const functionName = callSite.getFunctionName() || "anonymous";
  console.log("fileName",fileName,"functionName",functionName);
  return `${timestamp} [${level}] [${fileName}:${functionName}] ${message}`;
});


class Logger {
  constructor() {
    try {
      const logFilePath = path.resolve(__dirname, "../logs/combined.log");
      const errorLogPath = path.resolve(__dirname, "../logs/error.log");
      this.logger =  createLogger({
        level: "debug",
        format: format.combine(format.timestamp(), format.json()),
        defaultMeta: { service: "user-service" },
        transports: [
          new transports.Console(),
          new transports.File({
            filename: `${errorLogPath}`,
            level: "error",
          }),
          new transports.File({
            filename: logFilePath,
            level: "debug",
          }),
          // new WinstonLogStash({
          //   mode: "tcp",
          //   host: "localhost",
          //   port: 5044,
          // }),
        ],
        exceptionHandlers: [
          new transports.File({ filename: "../logs/exceptions.log" }),
        ],
      });
      //console.log("environment",process.env.COMBINED_LOG_PATH);
    } catch (error) {
      console.error("Error in creating logger", error);
    }
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
instance.debug("Logger initialized");
Object.freeze(instance);
module.exports = instance;
