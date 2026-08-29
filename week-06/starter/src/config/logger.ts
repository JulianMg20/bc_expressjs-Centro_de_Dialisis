import winston from "winston";

const esDesarrollo = process.env.NODE_ENV !== "production";

export const logger = winston.createLogger({
  level: esDesarrollo ? "http" : "warn",
  format: esDesarrollo
    ? winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
      )
    : winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console(),
    ...(esDesarrollo ? [] : [new winston.transports.File({ filename: "logs/error.log", level: "error" })]),
  ],
});

export const morganStream = {
  write: (mensaje: string) => logger.http(mensaje.trim()),
};