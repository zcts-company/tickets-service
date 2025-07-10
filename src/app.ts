import { callBackServices, fileService, nemoTavelServer, services, servicesIndividualInterval} from "./instances/services.mjs";
import { TicketService } from "./services/interfaces/TicketService.mjs";
import { toDateForSQL } from "./util/dateFunction.mjs";
import { LOGGER_PATH } from "./common/constants/constant.mjs";
import { changeLoggerFileName, getCurrentPath, logger } from "./common/logging/Logger.mjs";
import config from "./config/main-config.json" assert {type: 'json'}


import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import errorHandler from "./common/middleware/errorHandler.mjs";
import { mainRouter } from "./api/MainRouter.mjs";
import auth from "./common/middleware/Authentification.mjs";

let counter = 0;
let time = 0

let dateFrom:Date;
let dateTo:Date;

fileService.createDirectory(LOGGER_PATH)
logger.info(`[MAIN APP] Directory for logging: ${LOGGER_PATH} created`)

setSearchDate();
logger.info(`[MAIN APP] Start tickets service`)
logger.info(`[MAIN APP] main interval of checking: ${config.main.interval} seconds`)

    if(config.main.servers.hand.enabled){

        const server = express();
        server.use(cors())
        server.use(bodyParser.urlencoded({extended: true}));
        server.use(bodyParser.json());

        server.listen(config.main.servers.hand.port,() => {
                logger.info(`[HAND CHECK SERVER] Server for hand checing tickets listening on port ${config.main.servers.hand.port}`);
                    server.use(errorHandler);
            });

        server.use("/api",auth(),mainRouter)

    }

    callBackServices.forEach(callbackService => {
        callbackService.startServer()
    })


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
        // individual timer for services
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
