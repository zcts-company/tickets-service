import { nemoTavelServer, services } from "./config/services.mjs";
import { TicketService } from "./services/interfaces/TicketService.mjs";
import { toDateForSQL } from "./util/dateFunction.mjs";
import {config} from "./config/config.mjs"
import express from "express"

let counter = 0;
let time = 0

let dateFrom:Date;
let dateTo:Date;

setSearchDate();
console.log(`[MAIN APP] Start tickets service`);

nemoTavelServer.startServer(config.nemo.server.port)


    setInterval(() => {
        counter++;
        time += 10000;
       
        services.forEach(async (service:TicketService) => {
            console.log(`[MAIN APP] Step number ${counter} time: ${time/1000} sec [service name ${service.getServiceName()}]`);            

            if(Date.now() > dateTo.getTime()){
                console.log(`[MAIN APP] start process of changing the current date `);
                setSearchDate()
            }

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
        console.log(`[MAIN APP] Current date for search reservation setted: from ${toDateForSQL(dateFrom)} to ${toDateForSQL(dateTo)}`);
        
    }
