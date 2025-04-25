import morgan from 'morgan';

const morganFormat =
  ':method :url :status :res[content-length] - :response-time ms :remote-addr - :user-agent';

const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message) => {
      const [method, url, status, responseTime] = message.trim().split(' ');
      const logObject = {
        method,
        url,
        status,
        responseTime: responseTime + ' ms',
      };
      console.log(JSON.stringify(logObject));
    },
  },
});

export default morganMiddleware;
