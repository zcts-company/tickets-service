import express, { Response } from "express";
import asyncHandler from 'express-async-handler'
import { fileConverterXml, fileService} from "../../../../instances/services.mjs";
import { logger } from "../../../../common/logging/Logger.mjs";
import config from "../../../../config/hotel/traveltech.json" assert {type: 'json'}
import mainConfig from "../../../../config/main-config.json" assert {type: 'json'}
import { TraveltechWebService } from "../web-service/TraveltechWebService.mjs";
import { TraveltechTransport } from "../transport-service/TraveltechTransport.mjs";
import { LoadResponse } from "../types/response/LoadResponse";
import { nameOfFile } from "../../../../util/fileFunction.mjs";

export const handService = express.Router();

const webService = new TraveltechWebService();
const transportService:TraveltechTransport = new TraveltechTransport();
const currentDirectory = config.fileOutput.mainPath

handService.post('/check',asyncHandler( 
    
    async(req:any, res:Response) => {
    
    logger.info(`[TRAVELTECH] Resived post request for hand check reservation file for locator: ${req.body}`);
        try {
            const reservation:LoadResponse|undefined = await webService.getOrder(req.body.locator)
            const updated = new Date();

            if(reservation){
                const path = await createFile(reservation, reservation.result.order.id.toString(), updated);
                res.status(200);
                res.send()
            }
                
        } catch (error) {
                res.status(500);
                logger.error(`[TRAVELTECH] error hand check of reservation ${req.body}. Error - ${error}`);
                res.send()
        }
  
    }
))

async function createFile(reservationData: LoadResponse, key:string, updated:Date) {
    const res:string = fileConverterXml.jsonToXml(reservationData);
    const fileName = nameOfFile(key,updated,config.checkUpdates) + "_hand";
    const path = `${currentDirectory}${fileName}.xml`
    fileService.writeFile(path,res).then(() => {
        
        logger.info(`[TRAVELTECH] File with name ${fileName}.xml created by hand in directory: ${currentDirectory}`);

        if(mainConfig.main.transport.smbserver){
            transportService.forceSendTo1CSamba(fileName,currentDirectory);
        }

    })

    return path;
}


