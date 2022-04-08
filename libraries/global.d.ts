import type { ILogger } from '../src/logger';

declare global {
  interface Window {
    logger: ILogger;
  }
}
