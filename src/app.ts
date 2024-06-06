import { nemoTavelServer, services } from "./config/services.mjs";
import { TicketService } from "./services/interfaces/TicketService.mjs";
import { toDateForSQL } from "./util/dateFunction.mjs";
import {config} from "./config/config.mjs"
import express from "express"
import { logger } from "./common/logging/Logger.mjs";

let counter = 0;
let time = 0

let dateFrom:Date;
let dateTo:Date;

setSearchDate();
logger.info(`[MAIN APP] Start tickets service`)

nemoTavelServer.startServer(config.nemo.server.port)


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
        
        logger.info(`[MAIN APP] Current date for search reservation setted: from ${toDateForSQL(dateFrom)} to ${toDateForSQL(dateTo)}`)
        
    }
