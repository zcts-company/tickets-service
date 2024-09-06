import { fileService, nemoTavelServer, services, servicesIndividualInterval, travellineHandServer } from "./instances/services.mjs";
import { TicketService } from "./services/interfaces/TicketService.mjs";
import { toDateForSQL } from "./util/dateFunction.mjs";
import express from "express"
import { LOGGER_PATH } from "./common/constants/constant.mjs";
import { changeLoggerFileName, getCurrentPath, logger } from "./common/logging/Logger.mjs";
import config from "./config/main-config.json" assert {type: 'json'}
import { array } from "joi";

let counter = 0;
let time = 0

let dateFrom:Date;
let dateTo:Date;

fileService.createDirectory(LOGGER_PATH)
logger.info(`[MAIN APP] Directory for logging: ${LOGGER_PATH} created`)

setSearchDate();
logger.info(`[MAIN APP] Start tickets service`)
logger.info(`[MAIN APP] main interval of checking: ${config.main.interval} seconds`)

config.main.servers.nemo.enabled ? nemoTavelServer.startServer(config.main.servers.nemo.port) : null
config.main.servers.travelline_hand.enabled ? travellineHandServer.startServer(config.main.servers.travelline_hand.port) : null


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
    },config.main.interval * 1000)


    servicesIndividualInterval.forEach(async (service) => {
        const arrayConfigs:string[] = []
        // todo
        //await getConfigs("./src/config",arrayConfigs) 
        
        // const config = await fileService.readFile()
        // const interval = 
        // setInterval(() => {

        // },)
    })


    async function getConfigs(path:string, arrayConfigs:string[]):Promise<string[]>{
        const array:string[] = await fileService.readDiretory(path)
        const strJsonFlag:string = ".json"
        array.forEach(async (elem) => {
            if(elem.includes(strJsonFlag)){
                arrayConfigs.push(path + "/" + elem)
            } else {
                path = path + "/" + elem;
                await getConfigs(path,arrayConfigs)
            }
        })
        return arrayConfigs
    }


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
