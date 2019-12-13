import { BaseHandler } from 'https://deno.land/std/log/handlers.ts'
import { LogLevel } from 'https://deno.land/std/log/levels.ts';
import { LogRecord } from 'https://deno.land/std/log/logger.ts'
import { red, yellow, blue, bold } from 'https://deno.land/std/fmt/colors.ts'
import * as stdLog from 'https://deno.land/std/log/mod.ts'

/**
 * Customized ConsoleHandler
 */
class ConsoleHandler extends BaseHandler {
  format(logRecord: LogRecord): string {
    switch (logRecord.level) {
      case LogLevel.INFO:
        logRecord.levelName = blue(logRecord.levelName);
        break;
      case LogLevel.WARNING:
        logRecord.levelName = yellow(logRecord.levelName);
        break;
      case LogLevel.ERROR:
        logRecord.levelName = red(logRecord.levelName);
        break;
      case LogLevel.CRITICAL:
        logRecord.levelName = bold(red(logRecord.levelName));
        break;
      default:
        break;
    }

    let msg = super.format(logRecord);

    return msg;
  }

  log(msg: string): void {
    console.log(msg);
  }
}

await stdLog.setup({
  handlers: {
    console: new ConsoleHandler('DEBUG', {
      formatter: `[{levelName}] {msg}`
    }),
  },

  loggers: {
    default: {
      level: 'DEBUG',
      handlers: ['console']
    },
  }
});

export const log = stdLog.getLogger();
