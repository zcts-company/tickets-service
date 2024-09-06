import pino from "pino";
import type {Logger} from "pino";
import config from "../../config/main-config.json" assert {type: 'json'} 



let currentPath:string = `${config.main.loggerPath}${new Date().toLocaleDateString().replace(new RegExp('[./]', 'g'),"_")}.log`

let transport = pino.transport({
    targets: [
      {
        level:process.env.PINO_LOG_LEVEL || "info",
        target: 'pino-pretty',
        options: { destination: currentPath},
      },
      {
        level:process.env.PINO_LOG_LEVEL || "info",
        target: 'pino-pretty' // по-умолчанию логирует в стандартный вывод
      },
    ],
  });

export let logger:Logger = pino(
    {
        level: process.env.PINO_LOG_LEVEL || "info",
        timestamp: pino.stdTimeFunctions.isoTime
    },
    transport
);


export function changeLoggerFileName(date:Date){

      currentPath = `${config.main.loggerPath}${`${date.toLocaleDateString().replace(new RegExp('[./]', 'g'),"_")}.log`}`

      transport = pino.transport({
          targets: [
              {
                level:process.env.PINO_LOG_LEVEL || "info",
                target: 'pino-pretty',
                options: { destination: currentPath},
              },
              {
                level:process.env.PINO_LOG_LEVEL || "info",
                target: 'pino-pretty' // по-умолчанию логирует в стандартный вывод
              },
           ],
      });

      logger = pino(
        {
            level: process.env.PINO_LOG_LEVEL || "info",
            timestamp: pino.stdTimeFunctions.isoTime
        },
        transport
    );

}

export function getCurrentPath(){
  return currentPath
}
