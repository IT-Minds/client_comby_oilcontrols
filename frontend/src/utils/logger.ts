const logCreator = (log: Console["log"]) => (message: string, ...args: unknown[]) => {
  if (!process.browser) {
    const logObj = JSON.stringify({
      message,
      args
    });
    log(logObj);
  } else {
    log(message, ...args);
  }
};

type SingleLogLine = (message: string, ...args: unknown[]) => void;
type MyLog = {
  (message: string, ...args: unknown[]): void;
  info: SingleLogLine;
  debug: SingleLogLine;
  error: SingleLogLine;
  warn: SingleLogLine;
};

const myLog = <MyLog>(<unknown>logCreator(console.log));
myLog.info = logCreator(console.info);
myLog.debug = logCreator(console.debug);
myLog.error = logCreator(console.error);
myLog.warn = logCreator(console.warn);

export const logger = myLog;
