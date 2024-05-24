import pino from "pino";
import type { Logger } from "pino";

export const logger:Logger = pino({level: process.env.PINO_LOG_LEVEL || 'info',});
