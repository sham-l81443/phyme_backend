import winston from "winston";

// class Logger {
//     static log(data: any): void {
//         // Get the stack trace
//         const stack = new Error().stack;

//         // Get the caller's file path from the stack trace
//         const callerLine = stack?.split('\n')[2]; // [2] gives us the caller's line
//         const match = callerLine?.match(/[\\/]([^\\/]+\.[jt]s):/);
//         const fileName = match ? match[1] : 'unknown';

//         console.log(`[${fileName}]`, data);
//     }
// }

// export default Logger;



// Logger setup
export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}