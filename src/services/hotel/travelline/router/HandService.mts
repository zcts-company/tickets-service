import express, { Response } from "express";
import { FileService } from "../../../../common/file-service/FileService.mjs";
import { FileConverterXml } from "../../../../common/converter/FileConverterXml.mjs";
import config from "../config/config.mjs" //assert { type: "json" };;
import { logger } from "../../../../common/logging/Logger.mjs";
import auth from "../middleware/Authentification.mjs";
import { TravellineWebService } from "../web-service/TravellineWebService.mjs";
import { BookingResponse } from "../types/BookingResponse.mjs";
import { nameOfFile } from "../Travelline.mjs";
import asyncHandler from 'express-async-handler'


export const handService = express.Router();
const fileService = new FileService();
const webService = new TravellineWebService();
const converter:FileConverterXml = new FileConverterXml();
const directory1C = config.directory1C.path

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
    const res:string = converter.jsonToXml(reservationData);
    const fileName = nameOfFile(key,updated) + "_hand";
    const path = `${directory1C}${fileName}.xml`
    fileService.writeFile(path,res).then(() => {
        
        logger.info(`[TRAVELLINE] File with name ${fileName}.xml created by hand in directory: ${directory1C}`);
        
    })

    return path;
}


