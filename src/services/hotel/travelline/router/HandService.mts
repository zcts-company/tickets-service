import express, { Response } from "express";
import { TravellineWebService } from "../web-service/TravellineWebService.mjs";
import { BookingResponse } from "../types/BookingResponse.mjs";
import asyncHandler from 'express-async-handler'
import { TravellineTransport } from "../transport-service/TravellineTransport.mjs";
import { fileConverterXml, fileService} from "../../../../instances/services.mjs";
import { logger } from "../../../../common/logging/Logger.mjs";
import config from "../../../../config/hotel/travelline.json" assert {type: 'json'}
import mainConfig from "../../../../config/main-config.json" assert {type: 'json'}
import { nameOfFile } from "../../../../util/fileFunction.mjs";

export const handService = express.Router();

const webService = new TravellineWebService();
const transportService:TravellineTransport = new TravellineTransport();
const currentDirectory = config.fileOutput.mainPath

handService.post('/check',asyncHandler( 
    
    async(req:any, res:Response) => {
    
        logger.trace(`[TRAVELLINE] Resived post request for hand check reservation file for locator: ${req.body}`);

   try {
    const reservation:BookingResponse|undefined = await webService.getOrder(req.body.locator)
    const updated = new Date();

    if(reservation){
        const path = await createFile(reservation, reservation.booking.number, updated);
        const exist = await fileService.pathExsist(path);
        res.status(200);
        res.send()
 
    }
           
   } catch (error) {
         res.status(500);
         logger.error(`[TRAVELLINE] error hand check of reservation ${error}`);
         res.send()
   }
  
}))

async function createFile(reservationData: BookingResponse, key:string, updated:Date) {
    const res:string = fileConverterXml.jsonToXml(reservationData);
    const fileName = nameOfFile(key,updated,config.checkUpdates) + "_hand";
    const path = `${currentDirectory}${fileName}.xml`
    fileService.writeFile(path,res).then(() => {
        
        logger.info(`[TRAVELLINE] File with name ${fileName}.xml created by hand in directory: ${currentDirectory}`);

        if(mainConfig.main.transport.smbserver){
            transportService.forceSendTo1CSamba(fileName,currentDirectory);
        }

    })

    return path;
}


