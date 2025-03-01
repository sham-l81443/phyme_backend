import path from 'path';

class Logger {
    static log(data: any): void {
        // Get the stack trace
        const stack = new Error().stack;

        // Get the caller's file path from the stack trace
        const callerLine = stack?.split('\n')[2]; // [2] gives us the caller's line
        const match = callerLine?.match(/[\\/]([^\\/]+\.[jt]s):/);
        const fileName = match ? match[1] : 'unknown';

        console.log(`[${fileName}]`, data);
    }
}

export default Logger;