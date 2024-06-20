import { fileService, nemoTavelServer, services, travelline, travellineHandServer } from "./config/services.mjs";
import { TicketService } from "./services/interfaces/TicketService.mjs";
import { toDateForSQL } from "./util/dateFunction.mjs";
import {config} from "./config/config.mjs"
import express from "express"
import { LOGGER_PATH } from "./common/constants/constant.mjs";
import { changeLoggerFileName, getCurrentPath, logger } from "./common/logging/Logger.mjs";

let counter = 0;
let time = 0

let dateFrom:Date;
let dateTo:Date;

fileService.createDirectory(LOGGER_PATH)
logger.info(`[MAIN APP] Directory for logging: ${LOGGER_PATH} created`)

setSearchDate();
logger.info(`[MAIN APP] Start tickets service`)


nemoTavelServer.startServer(config.nemo.server.port)
travellineHandServer.startServer(config.travelline.server.port)


    setInterval(() => {
        counter++;
        time += 10000;

        if(Date.now() > dateTo.getTime()){
            logger.info(`[MAIN APP] start process of changing the current date`)
            setSearchDate()
        } else{
            logger.trace(`[MAIN APP] current date not need changing`)
        }

        services.forEach(async (service:TicketService) => {
            logger.trace(`[MAIN APP] Step number ${counter} [service name ${service.getServiceName()}]`)
            service.run(dateFrom,dateTo);
        })
    },config.interval * 1000)

    function setSearchDate(){      
        const now = new Date()  
        
        // for tests
        // dateFrom = new Date(2024,4,15,0,0,0,1)
        // dateTo = new Date(2024,4,15,23,59,59,0)

        dateFrom = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,1)
        dateTo = new Date(now.getFullYear(),now.getMonth(),now.getDate(),23,59,59,0)
        nemoTavelServer.setCurrentArchiveDirectory(dateTo)
        changeLoggerFileName(dateTo);

       
        logger.info(`[MAIN APP] Current date for search reservation setted: from ${toDateForSQL(dateFrom)} to ${toDateForSQL(dateTo)}`)
        logger.info(`[MAIN APP] Current path for logging setted: ${getCurrentPath()}`)
    }
