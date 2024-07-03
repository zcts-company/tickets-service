import express, { Request, Response } from "express";
import asyncHandler from 'express-async-handler'
import auth from "../midleware/Authentification.mjs";
import { config } from "../config/config.mjs";
import { NemoOrder } from "../model/NemoOrder.mjs";
import { validation } from "../../../../common/validation/validation.mjs";
import { nemoOrder } from "../shemas/NemoOrder.mjs";
import valid from "../midleware/valid.mjs";
import { fileConverterXml, fileService} from "../../../../config/services.mjs";
import { logger } from "../../../../common/logging/Logger.mjs";
import setArchivePath from "../midleware/SetArchivePath.mjs";

export const service = express.Router();

const currentDirectory = config.fileOutput.path
//let counter = 0

service.use(validation(nemoOrder))

//service.use(setArchivePath()) //todo

service.use('',asyncHandler(
    async (req:any,res:Response,next) => {
        logger.info(`[NEMO TRAVEL] Check current archive path, path of service: ${req.currentArchivePath}`)
    if(req.currentArchivePath){
        
        const directoryArhiveExist:boolean = await fileService.pathExsist(req.currentArchivePath);
        
        if(!directoryArhiveExist){
            await fileService.createDirectory(req.currentArchivePath)
            logger.info(`[NEMO TRAVEL] Directory created by middlware of service: ${req.currentArchivePath}`);
        }
    } else {
        logger.error(`[NEMO TRAVEL] Imposible created directory: ${req.currentArchivePath}`);
    }
        
        next()
    }
))

service.post('/create',auth(),valid,asyncHandler(async(req:any, res:Response) => {

// service.post('/create',auth(),asyncHandler(async(req:any, res:Response) => {
   logger.info(`[NEMO TRAVEL] Resived post request for create reservation file: ${req.body}`);

   try {
    const updated = new Date(req.body.data.lastModifiedDate);
    //const updated = new Date();
    const fileName = nameOfFile(req.body.params.id.toString(),updated);
    //const fileName = nameOfFile(counter + "",updated);
    const existToCurrentArchive = await fileService.pathExsist(`${req.currentArchivePath}${fileName}`);
    const existToCurrent = await fileService.pathExsist(`${currentDirectory}${fileName}`);

            if(!existToCurrentArchive){
                
                if(!existToCurrent){
                    const path = await createFile(req.body, res);
                    await fileService.pathExsist(path);
                    res.status(200);
                    res.send()
                    logger.info(`[NEMO TRAVEL] send response to nemo server ${res.statusCode}`);

                    //counter++
                    
                } else {
                    logger.warn(`[NEMO TRAVEL] file with name ${fileName} exists in directory ${currentDirectory}`);
                    res.status(200);
                    res.send({fileExistsToCerrent:existToCurrent})
                }

            } else {
                logger.warn(`[NEMO TRAVEL] file with name ${fileName} exists in directory ${req.currentArchivePath}`);
                res.status(200);
                res.send({fileExistsToArchive:existToCurrentArchive})
            }
           
   } catch (error) {
        res.status(500);
        logger.error(`[NEMO TRAVEL] send response to nemo server ${res.statusCode}`);
        res.send()
   }
  
}))


async function createFile(order:NemoOrder, response:Response) {
    const res:string = fileConverterXml.jsonToXml(order);
    const updated = new Date(order.data.lastModifiedDate);
    const fileName = nameOfFile(order.params.id.toString(),updated);

    // const updated = new Date();
    // const fileName = nameOfFile(counter + "",updated);

    const path = `${currentDirectory}${fileName}.xml`
    fileService.writeFile(path,res).then(() => {
        
        logger.info(`[NEMO TRAVEL] File with name ${fileName}.xml created in directory: ${currentDirectory}`);
        
    })

    return path;
}

function nameOfFile(key:string,updated:Date) {
        
    let dateStr:string = ''
    let timeStr:string = ''

    if(config.checkUpdates){
        dateStr = updated.toLocaleDateString().replace(new RegExp('[./]', 'g'),"_")
        timeStr = updated.toLocaleTimeString().replace(new RegExp(':', 'g'),"_")
    }
    
    
    return config.checkUpdates ? `${key}D${dateStr}T${timeStr}` : `${key}.xml` 
}


