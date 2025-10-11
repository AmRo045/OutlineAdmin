// src/utils/logger.ts
import winston from "winston";
import "winston-daily-rotate-file";

export function createLogger(context: string) {
    const consoleTransport = new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            winston.format.printf(
                ({ timestamp, level, message, ...meta }) =>
                    `${timestamp} [${level}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`
            )
        )
    });

    let fileTransport: winston.transport | undefined;

    fileTransport = new winston.transports.DailyRotateFile({
        filename: `logs/${context}-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "10m",
        maxFiles: "7d",
        level: "info"
    });

    const transports = fileTransport ? [consoleTransport, fileTransport] : [consoleTransport];

    return winston.createLogger({
        level: "info",
        transports
    });
}
