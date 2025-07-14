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
import { HandCheckReservation } from "../../../../common/types/HandCheckReservation";
import { createHttpError } from "../../../../util/errorFunction";

export const loadService = express.Router();

const webService = new TraveltechWebService();
const transportService:TraveltechTransport = new TraveltechTransport();
const currentDirectory = config.fileOutput.mainPath

loadService.post('/load',asyncHandler( 
    
    async(req:any, res:Response) => {
    const request: HandCheckReservation = req.body

    if(!request.locator){
        throw createHttpError(400,`Missing 'locator' property in request body`)
    }
    
    logger.info(`[TRAVELTECH] Resived post request for hand check reservation file for locator: ${request.locator}`);
        const reservation:LoadResponse|undefined = await webService.getOrder(request.locator)
        const updated = new Date();

        if(reservation){
            const path = await createFile(reservation, reservation.result.order.id.toString(), updated);
            res.status(200);
            res.send()
        }
                  
    }
))

async function createFile(reservationData: LoadResponse, key: string, updated: Date): Promise<string> {
  try {
    const res: string = fileConverterXml.jsonToXml(reservationData);
    const fileName = nameOfFile(key, updated, config.checkUpdates) + "_hand.xml";
    const path = `${currentDirectory}${fileName}`;

    await fileService.writeFile(path, res);

    logger.info(`[TRAVELTECH] File with name ${fileName}.xml created by hand in directory: ${currentDirectory}`);

    if (mainConfig.main.transport.smbserver) {
      await transportService.forceSendTo1CSamba(fileName, currentDirectory);
    }

    return path;
  } catch (err) {
    logger.error(`[TRAVELTECH] Failed to create or send file: ${(err as Error).message}`);
    throw new Error(`Failed to create or send reservation file: ${(err as Error).message}`);
  }
}


