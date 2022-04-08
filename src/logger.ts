interface ILogger {
  log(msg: any):void;
}

class Logger implements ILogger {

  log(msg: any): void {
    console.log(msg);
  }

}

export {
  ILogger,
  Logger
};
