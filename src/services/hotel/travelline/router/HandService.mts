import express, { Response } from "express";
import config from "../config/config.mjs" //assert { type: "json" };;
import auth from "../middleware/Authentification.mjs";
import { TravellineWebService } from "../web-service/TravellineWebService.mjs";
import { BookingResponse } from "../types/BookingResponse.mjs";
import { nameOfFile } from "../Travelline.mjs";
import asyncHandler from 'express-async-handler'
import { TravellineTransport } from "../transport-service/TravellineTransport.mjs";
import { fileConverterXml, fileService} from "../../../../config/services.mjs";
import { logger } from "../../../../common/logging/Logger.mjs";


export const handService = express.Router();

const webService = new TravellineWebService();
const transportService:TravellineTransport = new TravellineTransport();
const currentDirectory = config.fileOutput.path

handService.post('/hand-create',auth(),asyncHandler( 
    
    async(req:any, res:Response) => {
    
        logger.trace(`[TRAVELLINE] Resived post request for hand create reservation file for locator: ${req.body}`);

   try {
    const reservation:BookingResponse|undefined = await webService.getReservation(req.body.locator)
    const updated = new Date();

    if(reservation){
        const path = await createFile(reservation, reservation.booking.number, updated);
        const exist = await fileService.pathExsist(path);
        res.status(200);
        res.send()
 
    }
           
   } catch (error) {
         res.status(500);
         logger.error(`[TRAVELLINE] send response to nemo server ${res.statusCode}`);
         res.send()
   }
  
}))

async function createFile(reservationData: BookingResponse, key:string, updated:Date) {
    const res:string = fileConverterXml.jsonToXml(reservationData);
    const fileName = nameOfFile(key,updated) + "_hand";
    const path = `${currentDirectory}${fileName}.xml`
    fileService.writeFile(path,res).then(() => {
        
        logger.info(`[TRAVELLINE] File with name ${fileName}.xml created by hand in directory: ${currentDirectory}`);
        transportService.forceSendTo1CSamba(fileName,currentDirectory)
    })

    return path;
}


