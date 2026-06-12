import morgan from "morgan";
import { logger } from "../Frameworks/logger.js";

const stream = {
    write: (message: string) => logger.info(message.trim()),
};

export const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream }
);