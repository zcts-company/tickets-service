import pino from "pino";
import type { DestinationStream, Logger, TransportMultiOptions } from "pino";
import { LOGGER_PATH } from "../constants/constant.mjs";


let currentPath:string = `${LOGGER_PATH}${new Date().toLocaleDateString().replace(new RegExp('[./]', 'g'),"_")}.log`

let transport = pino.transport({
    targets: [
      {
        target: 'pino-pretty',
        options: { destination: currentPath},
      },
      {
        target: 'pino-pretty' // по-умолчанию логирует в стандартный вывод
      },
    ],
  });

export let logger:Logger = pino(
    {
        level: process.env.PINO_LOG_LEVEL || 'trace',
        timestamp: pino.stdTimeFunctions.isoTime
    },
    transport
);


export function changeLoggerFileName(date:Date){

      currentPath = `${LOGGER_PATH}${`${date.toLocaleDateString().replace(new RegExp('[./]', 'g'),"_")}.log`}`

      transport = pino.transport({
          targets: [
              {
                target: 'pino-pretty',
                options: { destination: currentPath},
              },
              {
                target: 'pino-pretty' // по-умолчанию логирует в стандартный вывод
              },
           ],
      });

      logger = pino(
        {
            level: process.env.PINO_LOG_LEVEL || 'trace',
            timestamp: pino.stdTimeFunctions.isoTime
        },
        transport
    );

}

export function getCurrentPath(){
  return currentPath
}
