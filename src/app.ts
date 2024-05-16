import { services } from "./config/services.mjs";
import { TicketService } from "./services/interfaces/TicketService.mjs";
import { toDateForSQL } from "./util/dateFunction.mjs";


let counter = 0;
let time = 0

console.log('Start tickets service');

let dateFrom:Date;
let dateTo:Date;

setSearchDate(counter);


    setInterval(() => {
        counter++;
        time += 10000;
       
        services.forEach(async (service:TicketService) => {
            console.log('====================================');
            console.log(`Step number ${counter} time: ${time/1000} sec [service name ${service.getServiceName()}]`);            
            
            if(Date.now() > dateTo.getTime()){
                setSearchDate(counter)
            }

            service.run(dateFrom,dateTo);
            console.log('====================================');
        })
    },5000)

    function setSearchDate(counter:number){      
        const now = new Date()  
        
        if(counter == 0) {
            // for tests
            dateFrom = new Date(2024,4,15,0,0,0,1)
            dateTo = new Date(2024,4,15,23,59,59,0)
        } else {
            dateFrom = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,1)
            dateTo = new Date(now.getFullYear(),now.getMonth(),now.getDate(),23,59,59,0)
        }

        console.log(`Current date for search reservation setted: from ${toDateForSQL(dateFrom)} to ${toDateForSQL(dateTo)}`);
        
    }