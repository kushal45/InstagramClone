const { createLogger, transports, format } = require("winston");
const KafkaTransport = require("./KafKaTransport");
function formatMessage(message) {
  return message
    .map((msg) => (typeof msg === "object" ? JSON.stringify(msg) : msg))
    .join(" ");
}




class Logger {
  constructor() {
    try {
      //const logFilePath = path.resolve(__dirname, "../logs/combined.log");
     // const errorLogPath = path.resolve(__dirname, "../logs/error.log");
      this.logger =  createLogger({
        level: "debug",
        format: format.combine(
          format.timestamp(),
          format.errors({ stack: true }),
          format.splat(),
          format.json()
        ),
        defaultMeta: { service: "user-service" },
        transports: [
          new transports.Console(),
          // new transports.File({
          //   filename: logFilePath,
          //   level: "debug",
          // }),
          new KafkaTransport({
            topic: "logs",
          })
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
